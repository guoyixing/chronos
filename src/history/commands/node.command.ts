import { Context } from "../../core/context/context";
import {
	BaseCommand,
	NodeStateSnapshot
} from "./base.command";
import {
	HistoryCommand,
	HistoryCommandType,
	SerializedCommand,
	CommandFactory
} from "../history.interface";
import { TYPES } from "../../config/inversify.config";
import { ChronosNodeGroupComponent } from "../../component/node/operate/group/node-group.component";
import { ChronosNodeEntryData, ChronosNodeEntryDataType } from "../../component/node/operate/entry/node-entry.data";
import { injectable } from "inversify";

/**
 * 节点拖拽命令
 * 用于处理节点的拖拽操作（改变泳道ID、行号、开始时间、结束时间）
 * Command for node drag operations (changes laneId, row, startTime, finishTime)
 */
export class NodeDragCommand extends BaseCommand implements HistoryCommand {
	private readonly nodeId: string;
	private readonly beforeState: NodeStateSnapshot;
	private readonly afterState: NodeStateSnapshot;

	constructor(
		context: Context,
		nodeId: string,
		beforeState: NodeStateSnapshot,
		afterState: NodeStateSnapshot,
		id?: string
	) {
		super(context, id);
		this.nodeId = nodeId;
		this.beforeState = beforeState;
		this.afterState = afterState;
	}

	get type(): HistoryCommandType {
		return HistoryCommandType.NODE_DRAG;
	}

	get description(): string {
		return `拖拽节点 ${this.nodeId} 到泳道 ${this.afterState.laneId} 行号 ${this.afterState.row}`;
	}

	execute(): void {
		this.applyState(this.afterState);
	}

	undo(): void {
		this.applyState(this.beforeState);
	}

	private applyState(state: NodeStateSnapshot): void {
		const nodeGroupComponent = this.context.ioc.get<ChronosNodeGroupComponent>(
			TYPES.ChronosNodeGroupComponent
		);
		const nodeEntry = nodeGroupComponent.service.getNodeEntryByNodeId(this.nodeId);

		if (!nodeEntry) {
			throw Error(`节点 ${this.nodeId} 未找到`);
		}

		// 更新节点数据
		nodeEntry.data.laneId = state.laneId;
		nodeEntry.data.row = state.row;
		nodeEntry.data.startTime = new Date(state.startTime);
		if (state.finishTime) {
			nodeEntry.data.finishTime = new Date(state.finishTime);
		}

		// 触发重绘
		nodeEntry.service.reDraw();
	}

	toJSON(): SerializedCommand {
		return {
			id: this.id,
			type: this.type,
			timestamp: this.timestamp,
			beforeState: this.beforeState,
			afterState: this.afterState,
			metadata: {
				nodeId: this.nodeId
			}
		};
	}
}

/**
 * 节点添加命令
 * 用于处理新增节点操作
 * Command for adding new nodes
 */
export class NodeAddCommand extends BaseCommand implements HistoryCommand {
	private readonly nodeId: string;
	private readonly afterState: NodeStateSnapshot;

	constructor(
		context: Context,
		nodeId: string,
		afterState: NodeStateSnapshot,
		id?: string
	) {
		super(context, id);
		this.nodeId = nodeId;
		this.afterState = afterState;
	}

	get type(): HistoryCommandType {
		return HistoryCommandType.NODE_ADD;
	}

	get description(): string {
		return `添加节点 ${this.nodeId}`;
	}

    execute(): void {
        const nodeGroupComponent = this.context.ioc.get<ChronosNodeGroupComponent>(
            TYPES.ChronosNodeGroupComponent
        );

        // 检查节点是否已存在
        const existingNode = nodeGroupComponent.service.getNodeEntryByNodeId(this.nodeId);
        if (existingNode) {
            return;
        }

        // 创建节点数据对象
        const nodeData: ChronosNodeEntryDataType = {
            id: this.afterState.id,
            name: this.afterState.name,
            type: this.afterState.type,
            startTime: this.afterState.startTime,
            finishTime: this.afterState.finishTime,
            laneId: this.afterState.laneId,
            row: this.afterState.row,
            progress: this.afterState.progress,
            hidden: this.afterState.hidden ?? false,
            extendField: this.afterState.extendField
        };

        const entryData = new ChronosNodeEntryData(this.context, nodeData);
        // 传入 false 避免循环记录历史
        nodeGroupComponent.service.addNodeEntry(entryData, false);
    }

	undo(): void {
		const nodeGroupComponent = this.context.ioc.get<ChronosNodeGroupComponent>(
			TYPES.ChronosNodeGroupComponent
		);

		const nodeEntry = nodeGroupComponent.service.getNodeEntryByNodeId(this.nodeId);
		if (!nodeEntry) {
			throw Error(`节点 ${this.nodeId} 未找到`);
		}

		// 销毁节点图形的underlying shape
		nodeEntry.data.graphics?.shape?.destroy();
		nodeEntry.data.graphics = undefined;
		nodeEntry.data.progressTextGraphics?.destroy();
		nodeEntry.data.progressTextGraphics = undefined;

		// 从节点组中移除
		nodeGroupComponent.service.removeNodeEntry(this.nodeId);
	}

	toJSON(): SerializedCommand {
		return {
			id: this.id,
			type: this.type,
			timestamp: this.timestamp,
			beforeState: undefined,
			afterState: this.afterState,
			metadata: {
				nodeId: this.nodeId
			}
		};
	}
}

/**
 * 节点删除命令
 * 用于处理删除节点操作
 * Command for deleting nodes
 */
export class NodeDeleteCommand extends BaseCommand implements HistoryCommand {
	private readonly nodeId: string;
	private readonly beforeState: NodeStateSnapshot;

	constructor(
		context: Context,
		nodeId: string,
		beforeState: NodeStateSnapshot,
		id?: string
	) {
		super(context, id);
		this.nodeId = nodeId;
		this.beforeState = beforeState;
	}

	get type(): HistoryCommandType {
		return HistoryCommandType.NODE_DELETE;
	}

	get description(): string {
		return `删除节点 ${this.nodeId}`;
	}

	execute(): void {
		const nodeGroupComponent = this.context.ioc.get<ChronosNodeGroupComponent>(
			TYPES.ChronosNodeGroupComponent
		);

		const nodeEntry = nodeGroupComponent.service.getNodeEntryByNodeId(this.nodeId);
		if (!nodeEntry) {
			throw Error(`节点 ${this.nodeId} 未找到`);
		}

		// 销毁节点图形的underlying shape
		nodeEntry.data.graphics?.shape?.destroy();
		nodeEntry.data.graphics = undefined;
		nodeEntry.data.progressTextGraphics?.destroy();
		nodeEntry.data.progressTextGraphics = undefined;

		// 从节点组中移除
		nodeGroupComponent.service.removeNodeEntry(this.nodeId);
	}

    undo(): void {
        const nodeGroupComponent = this.context.ioc.get<ChronosNodeGroupComponent>(
            TYPES.ChronosNodeGroupComponent
        );

        // 检查节点是否已存在
        const existingNode = nodeGroupComponent.service.getNodeEntryByNodeId(this.nodeId);
        if (existingNode) {
            return;
        }

        // 从快照恢复节点数据
        const nodeData: ChronosNodeEntryDataType = {
            id: this.beforeState.id,
            name: this.beforeState.name,
            type: this.beforeState.type,
            startTime: this.beforeState.startTime,
            finishTime: this.beforeState.finishTime,
            laneId: this.beforeState.laneId,
            row: this.beforeState.row,
            progress: this.beforeState.progress,
            hidden: this.beforeState.hidden ?? false,
            extendField: this.beforeState.extendField
        };

        const entryData = new ChronosNodeEntryData(this.context, nodeData);
        // 传入 false 避免循环记录历史
        nodeGroupComponent.service.addNodeEntry(entryData, false);
    }

	toJSON(): SerializedCommand {
		return {
			id: this.id,
			type: this.type,
			timestamp: this.timestamp,
			beforeState: this.beforeState,
			afterState: undefined,
			metadata: {
				nodeId: this.nodeId
			}
		};
	}
}

/**
 * 节点变形命令
 * 用于处理节点的缩放操作（改变开始时间、结束时间）
 * Command for node resize operations (changes startTime, finishTime)
 */
export class NodeTransformCommand extends BaseCommand implements HistoryCommand {
	private readonly nodeId: string;
	private readonly beforeState: NodeStateSnapshot;
	private readonly afterState: NodeStateSnapshot;

	constructor(
		context: Context,
		nodeId: string,
		beforeState: NodeStateSnapshot,
		afterState: NodeStateSnapshot,
		id?: string
	) {
		super(context, id);
		this.nodeId = nodeId;
		this.beforeState = beforeState;
		this.afterState = afterState;
	}

	get type(): HistoryCommandType {
		return HistoryCommandType.NODE_TRANSFORM;
	}

	get description(): string {
		return `调整节点 ${this.nodeId} 时间范围`;
	}

	execute(): void {
		this.applyState(this.afterState);
	}

	undo(): void {
		this.applyState(this.beforeState);
	}

	private applyState(state: NodeStateSnapshot): void {
		const nodeGroupComponent = this.context.ioc.get<ChronosNodeGroupComponent>(
			TYPES.ChronosNodeGroupComponent
		);
		const nodeEntry = nodeGroupComponent.service.getNodeEntryByNodeId(this.nodeId);

		if (!nodeEntry) {
			throw Error(`节点 ${this.nodeId} 未找到`);
		}

		// 更新节点时间数据
		nodeEntry.data.startTime = new Date(state.startTime);
		if (state.finishTime) {
			nodeEntry.data.finishTime = new Date(state.finishTime);
		} else {
			nodeEntry.data.finishTime = undefined;
		}

		// 触发重绘
		nodeEntry.service.reDraw();
	}

	toJSON(): SerializedCommand {
		return {
			id: this.id,
			type: this.type,
			timestamp: this.timestamp,
			beforeState: this.beforeState,
			afterState: this.afterState,
			metadata: {
				nodeId: this.nodeId
			}
		};
	}
}

/**
 * 节点命令工厂
 * 用于从序列化数据创建节点命令实例
 * Factory for creating node commands from serialized data
 */
@injectable()
export class NodeCommandFactory implements CommandFactory {
	readonly supportedTypes: HistoryCommandType[] = [
		HistoryCommandType.NODE_ADD,
		HistoryCommandType.NODE_DELETE,
		HistoryCommandType.NODE_DRAG,
		HistoryCommandType.NODE_TRANSFORM
	];

	fromJSON(data: SerializedCommand, context: Context): HistoryCommand {
		const nodeId = data.metadata?.nodeId as string;

		if (!nodeId) {
			throw Error("序列化数据缺少 nodeId");
		}

		switch (data.type) {
			case HistoryCommandType.NODE_ADD:
				return new NodeAddCommand(
					context,
					nodeId,
					data.afterState as NodeStateSnapshot,
					data.id
				);

			case HistoryCommandType.NODE_DELETE:
				return new NodeDeleteCommand(
					context,
					nodeId,
					data.beforeState as NodeStateSnapshot,
					data.id
				);

			case HistoryCommandType.NODE_DRAG:
				return new NodeDragCommand(
					context,
					nodeId,
					data.beforeState as NodeStateSnapshot,
					data.afterState as NodeStateSnapshot,
					data.id
				);

			case HistoryCommandType.NODE_TRANSFORM:
				return new NodeTransformCommand(
					context,
					nodeId,
					data.beforeState as NodeStateSnapshot,
					data.afterState as NodeStateSnapshot,
					data.id
				);

			default:
				throw Error(`不支持的命令类型: ${data.type}`);
		}
	}
}
