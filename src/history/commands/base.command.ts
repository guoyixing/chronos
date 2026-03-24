import { Context } from "../../core/context/context";
import { HistoryCommand, HistoryCommandType, SerializedCommand } from "../history.interface";

/**
 * 生成唯一ID
 * Generate unique ID for commands
 */
export function generateCommandId(): string {
    return `cmd_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * 命令基类
 * Base class for all history commands
 */
export abstract class BaseCommand implements HistoryCommand {
    readonly id: string;
    readonly timestamp: number;
    
    protected readonly context: Context;
    
    constructor(context: Context, id?: string) {
        this.context = context;
        this.id = id ?? generateCommandId();
        this.timestamp = Date.now();
    }
    
    abstract get type(): HistoryCommandType;
    abstract get description(): string;
    
    abstract execute(): void;
    abstract undo(): void;
    abstract toJSON(): SerializedCommand;
    
    /**
     * 触发重绘
     * Trigger redraw for affected components
     */
    protected reDraw(): void {
        // 通过 Context 获取重绘方法
        // 由子类根据需要调用
    }
}

/**
 * 节点状态快照
 * Snapshot of node state for undo/redo
 */
export interface NodeStateSnapshot {
    id: string;
    name: string;
    type: string;
    startTime: string;  // ISO string
    finishTime?: string;
    laneId: string;
    row: number;
    progress?: number;
    hidden?: boolean;
    extendField?: Record<string, unknown>;
}

/**
 * 泳道状态快照
 * Snapshot of lane state for undo/redo
 */
export interface LaneStateSnapshot {
    id: string;
    name: string;
    rowNum: number;
    hide?: boolean;
    index: number;  // 泳道在组中的位置
    extendField?: Record<string, unknown>;
}

/**
 * 从节点数据创建快照
 * Create snapshot from node data
 */
export function createNodeSnapshot(node: {
    id: string;
    name: string;
    type: string;
    startTime: Date;
    finishTime?: Date;
    laneId: string;
    row: number;
    progress?: number;
    hidden?: boolean;
    extendField?: Record<string, unknown>;
}): NodeStateSnapshot {
    return {
        id: node.id,
        name: node.name,
        type: node.type,
        startTime: node.startTime.toISOString(),
        finishTime: node.finishTime?.toISOString(),
        laneId: node.laneId,
        row: node.row,
        progress: node.progress,
        hidden: node.hidden,
        extendField: node.extendField ? { ...node.extendField } : undefined
    };
}

/**
 * 从泳道数据创建快照
 * Create snapshot from lane data
 */
export function createLaneSnapshot(lane: {
    id: string;
    name: string;
    rowNum: number;
    hide?: boolean;
    index: number;
    extendField?: Record<string, unknown>;
}): LaneStateSnapshot {
    return {
        id: lane.id,
        name: lane.name,
        rowNum: lane.rowNum,
        hide: lane.hide,
        index: lane.index,
        extendField: lane.extendField ? { ...lane.extendField } : undefined
    };
}
