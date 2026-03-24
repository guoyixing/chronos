import { Context } from "../core/context/context";

/**
 * 命令类型枚举
 * Command types for serialization and identification
 */
export enum HistoryCommandType {
    // Node 操作
    NODE_ADD = "node:add",
    NODE_DELETE = "node:delete",
    NODE_DRAG = "node:drag",
    NODE_TRANSFORM = "node:transform",
    
    // Lane 操作
    LANE_ADD = "lane:add",
    LANE_DELETE = "lane:delete",
    LANE_MOVE = "lane:move",
    LANE_ROW_CHANGE = "lane:rowChange",
    
    // 通用
    COMPOSITE = "composite"
}

/**
 * 序列化的命令数据
 * Serialized command for export/import
 */
export interface SerializedCommand {
    /** 命令唯一标识 */
    id: string;
    /** 命令类型 */
    type: HistoryCommandType;
    /** 执行时间戳 */
    timestamp: number;
    /** 操作前状态快照 */
    beforeState: unknown;
    /** 操作后状态快照 */
    afterState: unknown;
    /** 额外元数据 */
    metadata?: Record<string, unknown>;
}

/**
 * 历史命令接口
 * Command pattern interface for undo/redo operations
 */
export interface HistoryCommand {
    /** 命令唯一标识 */
    readonly id: string;
    /** 命令类型 */
    readonly type: HistoryCommandType;
    /** 执行时间戳 */
    readonly timestamp: number;
    /** 命令描述（用于调试和UI显示） */
    readonly description: string;
    
    /**
     * 执行命令（应用 afterState）
     * Execute the command (apply afterState)
     */
    execute(): void;
    
    /**
     * 撤销命令（恢复 beforeState）
     * Undo the command (restore beforeState)
     */
    undo(): void;
    
    /**
     * 序列化命令用于导出
     * Serialize command for export
     */
    toJSON(): SerializedCommand;
}

/**
 * 命令工厂接口
 * Factory for creating commands from serialized data
 */
export interface CommandFactory {
    /**
     * 从序列化数据创建命令
     * Create command from serialized data
     */
    fromJSON(data: SerializedCommand, context: Context): HistoryCommand;
    
    /**
     * 支持的命令类型
     * Supported command types
     */
    readonly supportedTypes: HistoryCommandType[];
}

/**
 * 历史管理器配置
 * Configuration options for HistoryManager
 */
export interface HistoryOptions {
    /** 是否启用历史记录 (默认: true) */
    enabled?: boolean;
    /** 最大历史记录数量 (默认: 100) */
    maxSize?: number;
    /** 是否启用键盘快捷键 (默认: true) */
    enableKeyboardShortcuts?: boolean;
}

/**
 * 历史变更事件
 * Event emitted when history state changes
 */
export interface HistoryChangeEvent {
    /** 事件类型 */
    action: "execute" | "undo" | "redo" | "clear";
    /** 相关命令 */
    command?: HistoryCommand;
    /** 当前 undo 栈大小 */
    undoStackSize: number;
    /** 当前 redo 栈大小 */
    redoStackSize: number;
}

/**
 * 历史管理器接口
 * Manager for command history with undo/redo support
 */
export interface IHistoryManager {
    /** 是否启用 */
    readonly enabled: boolean;
    
    /**
     * 执行命令并添加到历史记录
     * Execute command and add to history
     */
    execute(command: HistoryCommand): void;
    
    /**
     * 仅记录命令到历史（不执行）
     * 用于操作已经完成后记录历史
     * Push command to history without executing (for operations already performed)
     */
    push(command: HistoryCommand): void;
    
    /**
     * 撤销上一个命令
     * Undo the last command
     * @returns 是否成功撤销
     */
    undo(): boolean;
    
    /**
     * 重做上一个撤销的命令
     * Redo the last undone command
     * @returns 是否成功重做
     */
    redo(): boolean;
    
    /**
     * 是否可以撤销
     * Check if undo is available
     */
    canUndo(): boolean;
    
    /**
     * 是否可以重做
     * Check if redo is available
     */
    canRedo(): boolean;
    
    /**
     * 获取撤销栈
     * Get the undo stack (readonly)
     */
    getUndoStack(): readonly HistoryCommand[];
    
    /**
     * 获取重做栈
     * Get the redo stack (readonly)
     */
    getRedoStack(): readonly HistoryCommand[];
    
    /**
     * 导出历史记录为 JSON
     * Export history to JSON string
     */
    exportHistory(): string;
    
    /**
     * 从 JSON 导入历史记录
     * Import history from JSON string
     */
    importHistory(json: string): void;
    
    /**
     * 清空历史记录
     * Clear all history
     */
    clear(): void;
    
    /**
     * 添加历史变更监听器
     * Add listener for history changes
     */
    onChange(callback: (event: HistoryChangeEvent) => void): void;
    
    /**
     * 移除历史变更监听器
     * Remove history change listener
     */
    offChange(callback: (event: HistoryChangeEvent) => void): void;
    
    /**
     * 销毁管理器
     * Destroy manager and cleanup resources
     */
    destroy(): void;
}

/**
 * 历史上下文
 * Context passed to commands for state access
 */
export interface HistoryContext {
    /** Chronos 上下文 */
    readonly context: Context;
    /** 历史管理器引用 */
    readonly historyManager: IHistoryManager;
}
