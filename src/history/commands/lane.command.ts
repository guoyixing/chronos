import { BaseCommand, LaneStateSnapshot, createLaneSnapshot } from "./base.command";
import { HistoryCommand, HistoryCommandType, SerializedCommand, CommandFactory } from "../history.interface";
import { Context } from "../../core/context/context";
import { TYPES } from "../../config/inversify.config";
import { ChronosLaneGroupComponent } from "../../component/lane/group/lane-group.component";
import { ChronosLaneEntryData } from "../../component/lane/entry/lane-entry.data";
import { ChronosLaneEntryService } from "../../component/lane/entry/lane-entry.service";
import { ChronosLaneEntryComponent } from "../../component/lane/entry/lane-entry.component";
import { Callback } from "../../core/event/callback/callback";
import { ChronosWindowComponent } from "../../component/window/window.component";
import { ChronosLaneReviseComponent } from "../../component/revise/lane/lane-revise.component";

/**
 * 泳道移动命令
 * Lane move command for reordering lanes in laneGroup
 */
export class LaneMoveCommand extends BaseCommand implements HistoryCommand {
    private beforeState: LaneStateSnapshot;
    private afterState: LaneStateSnapshot;
    private laneId: string;
    private oldIndex: number;
    private newIndex: number;

    constructor(
        context: Context,
        laneId: string,
        oldIndex: number,
        newIndex: number,
        id?: string
    ) {
        super(context, id);
        this.laneId = laneId;
        this.oldIndex = oldIndex;
        this.newIndex = newIndex;

        // 获取泳道组组件和泳道数据
        const laneGroupComponent = context.ioc.get<ChronosLaneGroupComponent>(TYPES.ChronosLaneGroupComponent);
        const laneEntry = laneGroupComponent.service.laneById(this.laneId);

        if (!laneEntry) {
            throw Error(`泳道 ${laneId} 未找到`);
        }

        // 记录移动前的状态
        this.beforeState = createLaneSnapshot({
            id: laneEntry.data.id,
            name: laneEntry.data.name,
            rowNum: laneEntry.data.rowNum,
            hide: laneEntry.data.hide,
            index: this.oldIndex,
            extendField: laneEntry.data.extendField
        });

        // 记录移动后的状态
        this.afterState = createLaneSnapshot({
            id: laneEntry.data.id,
            name: laneEntry.data.name,
            rowNum: laneEntry.data.rowNum,
            hide: laneEntry.data.hide,
            index: this.newIndex,
            extendField: laneEntry.data.extendField
        });
    }

    get type(): HistoryCommandType {
        return HistoryCommandType.LANE_MOVE;
    }

    get description(): string {
        return `移动泳道 ${this.laneId}`;
    }

    execute(): void {
        // 从旧位置移除
        const laneGroupComponent = this.context.ioc.get<ChronosLaneGroupComponent>(TYPES.ChronosLaneGroupComponent);
        const removed = laneGroupComponent.data.laneGroup.splice(this.oldIndex, 1);

        // 插入到新位置
        const lane = removed[0];
        if (lane) {
            laneGroupComponent.data.laneGroup.splice(this.newIndex, 0, lane);
        }

        // 重新绘制
        laneGroupComponent.service.reDraw();
    }

    undo(): void {
        // 从新位置移除
        const laneGroupComponent = this.context.ioc.get<ChronosLaneGroupComponent>(TYPES.ChronosLaneGroupComponent);
        const removed = laneGroupComponent.data.laneGroup.splice(this.newIndex, 1);

        // 插入到旧位置
        const lane = removed[0];
        if (lane) {
            laneGroupComponent.data.laneGroup.splice(this.oldIndex, 0, lane);
        }

        // 重新绘制
        laneGroupComponent.service.reDraw();
    }

    toJSON(): SerializedCommand {
        return {
            id: this.id,
            type: this.type,
            timestamp: this.timestamp,
            beforeState: this.beforeState,
            afterState: this.afterState,
            metadata: {
                laneId: this.laneId,
                oldIndex: this.oldIndex,
                newIndex: this.newIndex
            }
        };
    }
}

/**
 * 泳道添加命令
 * Lane add command for creating new lanes
 */
export class LaneAddCommand extends BaseCommand implements HistoryCommand {
    private laneId: string;
    private afterState: LaneStateSnapshot;
    private insertIndex: number;

    constructor(
        context: Context,
        laneId: string,
        name: string,
        rowNum: number = 1,
        insertIndex?: number,
        id?: string
    ) {
        super(context, id);
        this.laneId = laneId;

        const laneGroupComponent = context.ioc.get<ChronosLaneGroupComponent>(TYPES.ChronosLaneGroupComponent);
        this.insertIndex = insertIndex ?? laneGroupComponent.data.laneGroup.length;

        // 记录添加后的状态
        this.afterState = createLaneSnapshot({
            id: laneId,
            name: name,
            rowNum: rowNum,
            hide: false,
            index: this.insertIndex,
            extendField: {}
        });
    }

    get type(): HistoryCommandType {
        return HistoryCommandType.LANE_ADD;
    }

    get description(): string {
        return `添加泳道 ${this.laneId}`;
    }

    execute(): void {
        const laneGroupComponent = this.context.ioc.get<ChronosLaneGroupComponent>(TYPES.ChronosLaneGroupComponent);
        
        if (!laneGroupComponent) {
            throw Error("泳道组组件未找到");
        }

        const callback = this.context.ioc.get<Callback>(TYPES.Callback);
        const window = this.context.ioc.get<ChronosWindowComponent>(TYPES.ChronosWindowComponent);
        const revise = this.context.ioc.get<ChronosLaneReviseComponent>(TYPES.ChronosLaneReviseComponent);

        if (!window || !revise) {
            throw Error("必要组件未找到");
        }

        // 创建新泳道数据
        const entryData = new ChronosLaneEntryData(this.context, {
            id: this.afterState.id,
            name: this.afterState.name,
            rowNum: this.afterState.rowNum,
            hide: this.afterState.hide,
            extendField: this.afterState.extendField
        });

        // 创建服务和组件
        const service = new ChronosLaneEntryService(entryData, callback, window, laneGroupComponent, revise);
        const component = new ChronosLaneEntryComponent(entryData, service);

        // 插入到指定位置
        laneGroupComponent.data.laneGroup.splice(this.insertIndex, 0, component);

        // 重新绘制
        laneGroupComponent.service.reDraw();
    }

    undo(): void {
        const laneGroupComponent = this.context.ioc.get<ChronosLaneGroupComponent>(TYPES.ChronosLaneGroupComponent);

        // 从指定位置移除
        laneGroupComponent.data.laneGroup.splice(this.insertIndex, 1);

        // 重新绘制
        laneGroupComponent.service.reDraw();
    }

    toJSON(): SerializedCommand {
        return {
            id: this.id,
            type: this.type,
            timestamp: this.timestamp,
            beforeState: undefined,
            afterState: this.afterState,
            metadata: {
                laneId: this.laneId,
                insertIndex: this.insertIndex
            }
        };
    }
}

/**
 * 泳道删除命令
 * Lane delete command for removing lanes
 */
export class LaneDeleteCommand extends BaseCommand implements HistoryCommand {
    private laneId: string;
    private beforeState: LaneStateSnapshot;
    private deleteIndex: number;

    constructor(
        context: Context,
        laneId: string,
        id?: string
    ) {
        super(context, id);
        this.laneId = laneId;

        const laneGroupComponent = context.ioc.get<ChronosLaneGroupComponent>(TYPES.ChronosLaneGroupComponent);
        const laneEntry = laneGroupComponent.service.laneById(laneId);

        if (!laneEntry) {
            throw Error(`泳道 ${laneId} 未找到`);
        }

        // 找到泳道在数组中的索引
        this.deleteIndex = laneGroupComponent.data.laneGroup.findIndex(
            entry => entry.data.id === laneId
        );

        if (this.deleteIndex === -1) {
            throw Error(`泳道 ${laneId} 在数组中未找到`);
        }

        // 记录删除前的状态
        this.beforeState = createLaneSnapshot({
            id: laneEntry.data.id,
            name: laneEntry.data.name,
            rowNum: laneEntry.data.rowNum,
            hide: laneEntry.data.hide,
            index: this.deleteIndex,
            extendField: laneEntry.data.extendField
        });
    }

    get type(): HistoryCommandType {
        return HistoryCommandType.LANE_DELETE;
    }

    get description(): string {
        return `删除泳道 ${this.laneId}`;
    }

    execute(): void {
        const laneGroupComponent = this.context.ioc.get<ChronosLaneGroupComponent>(TYPES.ChronosLaneGroupComponent);

        // 移除泳道
        laneGroupComponent.data.laneGroup.splice(this.deleteIndex, 1);

        // 重新绘制
        laneGroupComponent.service.reDraw();
    }

    undo(): void {
        const laneGroupComponent = this.context.ioc.get<ChronosLaneGroupComponent>(TYPES.ChronosLaneGroupComponent);
        const callback = this.context.ioc.get<Callback>(TYPES.Callback);
        const window = this.context.ioc.get<ChronosWindowComponent>(TYPES.ChronosWindowComponent);
        const revise = this.context.ioc.get<ChronosLaneReviseComponent>(TYPES.ChronosLaneReviseComponent);

        // 重新创建泳道数据
        const entryData = new ChronosLaneEntryData(this.context, {
            id: this.beforeState.id,
            name: this.beforeState.name,
            rowNum: this.beforeState.rowNum,
            hide: this.beforeState.hide,
            extendField: this.beforeState.extendField
        });

        // 创建服务和组件
        const service = new ChronosLaneEntryService(entryData, callback, window, laneGroupComponent, revise);
        const component = new ChronosLaneEntryComponent(entryData, service);

        // 插入到原位置
        laneGroupComponent.data.laneGroup.splice(this.deleteIndex, 0, component);

        // 初始化泳道组件（需要调用初始化方法）
        component.init();

        // 重新绘制
        laneGroupComponent.service.reDraw();
    }

    toJSON(): SerializedCommand {
        return {
            id: this.id,
            type: this.type,
            timestamp: this.timestamp,
            beforeState: this.beforeState,
            afterState: undefined,
            metadata: {
                laneId: this.laneId,
                deleteIndex: this.deleteIndex
            }
        };
    }
}

/**
 * 泳道行数变更命令
 * Lane row change command for modifying rowNum property
 */
export class LaneRowChangeCommand extends BaseCommand implements HistoryCommand {
    private laneId: string;
    private beforeState: LaneStateSnapshot;
    private afterState: LaneStateSnapshot;
    private oldRowNum: number;
    private newRowNum: number;

    constructor(
        context: Context,
        laneId: string,
        oldRowNum: number,
        newRowNum: number,
        id?: string
    ) {
        super(context, id);
        this.laneId = laneId;
        this.oldRowNum = oldRowNum;
        this.newRowNum = newRowNum;

        const laneGroupComponent = context.ioc.get<ChronosLaneGroupComponent>(TYPES.ChronosLaneGroupComponent);
        const laneEntry = laneGroupComponent.service.laneById(laneId);

        if (!laneEntry) {
            throw Error(`泳道 ${laneId} 未找到`);
        }

        // 找到泳道在数组中的索引
        const index = laneGroupComponent.data.laneGroup.findIndex(
            entry => entry.data.id === laneId
        );

        if (index === -1) {
            throw Error(`泳道 ${laneId} 在数组中未找到`);
        }

        // 记录变更前的状态
        this.beforeState = createLaneSnapshot({
            id: laneEntry.data.id,
            name: laneEntry.data.name,
            rowNum: oldRowNum,
            hide: laneEntry.data.hide,
            index: index,
            extendField: laneEntry.data.extendField
        });

        // 记录变更后的状态
        this.afterState = createLaneSnapshot({
            id: laneEntry.data.id,
            name: laneEntry.data.name,
            rowNum: newRowNum,
            hide: laneEntry.data.hide,
            index: index,
            extendField: laneEntry.data.extendField
        });
    }

    get type(): HistoryCommandType {
        return HistoryCommandType.LANE_ROW_CHANGE;
    }

    get description(): string {
        return `修改泳道 ${this.laneId} 行数`;
    }

    execute(): void {
        const laneGroupComponent = this.context.ioc.get<ChronosLaneGroupComponent>(TYPES.ChronosLaneGroupComponent);
        const laneEntry = laneGroupComponent.service.laneById(this.laneId);

        if (laneEntry) {
            laneEntry.data.rowNum = this.newRowNum;
            laneGroupComponent.service.reDraw();
        }
    }

    undo(): void {
        const laneGroupComponent = this.context.ioc.get<ChronosLaneGroupComponent>(TYPES.ChronosLaneGroupComponent);
        const laneEntry = laneGroupComponent.service.laneById(this.laneId);

        if (laneEntry) {
            laneEntry.data.rowNum = this.oldRowNum;
            laneGroupComponent.service.reDraw();
        }
    }

    toJSON(): SerializedCommand {
        return {
            id: this.id,
            type: this.type,
            timestamp: this.timestamp,
            beforeState: this.beforeState,
            afterState: this.afterState,
            metadata: {
                laneId: this.laneId,
                oldRowNum: this.oldRowNum,
                newRowNum: this.newRowNum
            }
        };
    }
}

/**
 * 泳道命令工厂
 * Factory for deserializing lane commands from JSON
 */
export class LaneCommandFactory implements CommandFactory {
    readonly supportedTypes = [
        HistoryCommandType.LANE_ADD,
        HistoryCommandType.LANE_DELETE,
        HistoryCommandType.LANE_MOVE,
        HistoryCommandType.LANE_ROW_CHANGE
    ];

    fromJSON(data: SerializedCommand, context: Context): HistoryCommand {
        const metadata = data.metadata as Record<string, unknown>;

        switch (data.type) {
            case HistoryCommandType.LANE_ADD: {
                const afterState = data.afterState as LaneStateSnapshot;
                return new LaneAddCommand(
                    context,
                    afterState.id,
                    afterState.name,
                    afterState.rowNum,
                    metadata.insertIndex as number,
                    data.id
                );
            }

            case HistoryCommandType.LANE_DELETE: {
                const beforeState = data.beforeState as LaneStateSnapshot;
                return new LaneDeleteCommand(context, beforeState.id, data.id);
            }

            case HistoryCommandType.LANE_MOVE: {
                return new LaneMoveCommand(
                    context,
                    metadata.laneId as string,
                    metadata.oldIndex as number,
                    metadata.newIndex as number,
                    data.id
                );
            }

            case HistoryCommandType.LANE_ROW_CHANGE: {
                return new LaneRowChangeCommand(
                    context,
                    metadata.laneId as string,
                    metadata.oldRowNum as number,
                    metadata.newRowNum as number,
                    data.id
                );
            }

            default:
                throw Error(`不支持的泳道命令类型: ${data.type}`);
        }
    }
}
