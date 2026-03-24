import { Context } from "../../core/context/context";
import { HistoryCommand } from "../history.interface";
import { NodeStateSnapshot, createNodeSnapshot, LaneStateSnapshot, createLaneSnapshot } from "./base.command";
import { NodeDragCommand, NodeDeleteCommand, NodeTransformCommand, NodeAddCommand } from "./node.command";
import { LaneMoveCommand, LaneDeleteCommand, LaneRowChangeCommand, LaneAddCommand } from "./lane.command";
import { ChronosNodeEntryData } from "../../component/node/operate/entry/node-entry.data";
import { ChronosLaneEntryData } from "../../component/lane/entry/lane-entry.data";

/**
 * 历史辅助工具
 * Helper utilities for creating history commands
 */
export class HistoryHelper {
    
    /**
     * 创建节点拖拽命令
     * Create node drag command with before/after state
     */
    static createNodeDragCommand(
        context: Context,
        nodeId: string,
        beforeState: NodeStateSnapshot,
        afterState: NodeStateSnapshot
    ): HistoryCommand | null {
        if (!context.historyManager?.enabled) {
            return null;
        }
        
        return new NodeDragCommand(
            context,
            nodeId,
            beforeState,
            afterState
        );
    }
    
    /**
     * 创建节点删除命令
     * Create node delete command
     */
    static createNodeDeleteCommand(
        context: Context,
        nodeId: string,
        nodeData: ChronosNodeEntryData
    ): HistoryCommand | null {
        if (!context.historyManager?.enabled) {
            return null;
        }
        
        const snapshot = createNodeSnapshot(nodeData);
        return new NodeDeleteCommand(context, nodeId, snapshot);
    }
    
    /**
     * 创建节点添加命令
     * Create node add command
     */
    static createNodeAddCommand(
        context: Context,
        nodeId: string,
        nodeData: ChronosNodeEntryData
    ): HistoryCommand | null {
        if (!context.historyManager?.enabled) {
            return null;
        }
        
        const snapshot = createNodeSnapshot(nodeData);
        return new NodeAddCommand(context, nodeId, snapshot);
    }
    
    /**
     * 创建节点变形命令
     * Create node transform command (resize)
     */
    static createNodeTransformCommand(
        context: Context,
        nodeId: string,
        beforeState: NodeStateSnapshot,
        afterState: NodeStateSnapshot
    ): HistoryCommand | null {
        if (!context.historyManager?.enabled) {
            return null;
        }
        
        return new NodeTransformCommand(
            context,
            nodeId,
            beforeState,
            afterState
        );
    }
    
    /**
     * 创建泳道移动命令
     * Create lane move command
     */
    static createLaneMoveCommand(
        context: Context,
        laneId: string,
        oldIndex: number,
        newIndex: number
    ): HistoryCommand | null {
        if (!context.historyManager?.enabled) {
            return null;
        }
        
        return new LaneMoveCommand(
            context,
            laneId,
            oldIndex,
            newIndex
        );
    }
    
    /**
     * 创建泳道删除命令
     * Create lane delete command
     */
    static createLaneDeleteCommand(
        context: Context,
        laneId: string
    ): HistoryCommand | null {
        if (!context.historyManager?.enabled) {
            return null;
        }
        
        return new LaneDeleteCommand(context, laneId);
    }
    
    /**
     * 创建泳道添加命令
     * Create lane add command
     */
    static createLaneAddCommand(
        context: Context,
        laneData: ChronosLaneEntryData
    ): HistoryCommand | null {
        if (!context.historyManager?.enabled) {
            return null;
        }
        
        return new LaneAddCommand(
            context, 
            laneData.id, 
            laneData.name, 
            laneData.rowNum, 
            laneData.index
        );
    }
    
    /**
     * 创建泳道行数变更命令
     * Create lane row change command
     */
    static createLaneRowChangeCommand(
        context: Context,
        laneId: string,
        oldRowNum: number,
        newRowNum: number
    ): HistoryCommand | null {
        if (!context.historyManager?.enabled) {
            return null;
        }
        
        return new LaneRowChangeCommand(
            context,
            laneId,
            oldRowNum,
            newRowNum
        );
    }
    
    /**
     * 执行命令
     * Execute command if history manager is available
     */
    static execute(context: Context, command: HistoryCommand | null): void {
        if (command && context.historyManager?.enabled) {
            context.historyManager.execute(command);
        }
    }
    
    /**
     * 仅记录命令（不执行）
     * Push command to history without executing
     * 用于操作已经完成后记录历史
     */
    static push(context: Context, command: HistoryCommand | null): void {
        if (command && context.historyManager?.enabled) {
            context.historyManager.push(command);
        }
    }
    
    /**
     * 从节点数据捕获快照
     * Capture snapshot from node data
     */
    static captureNodeSnapshot(nodeData: ChronosNodeEntryData): NodeStateSnapshot {
        return createNodeSnapshot(nodeData);
    }
    
    /**
     * 从泳道数据捕获快照
     * Capture snapshot from lane data
     */
    static captureLaneSnapshot(laneData: ChronosLaneEntryData): LaneStateSnapshot {
        return createLaneSnapshot(laneData);
    }
}
