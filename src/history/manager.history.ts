import { Context } from "../core/context/context";
import {
    IHistoryManager,
    HistoryCommand,
    HistoryOptions,
    HistoryChangeEvent,
    SerializedCommand,
    CommandFactory,
    HistoryCommandType
} from "./history.interface";

/**
 * 默认配置
 * Default configuration values
 */
const DEFAULT_OPTIONS: Required<HistoryOptions> = {
    enabled: true,
    maxSize: 100,
    enableKeyboardShortcuts: true
};

/**
 * 导出的历史数据格式
 * Exported history data format
 */
interface ExportedHistory {
    version: string;
    exportedAt: string;
    undoStack: SerializedCommand[];
    redoStack: SerializedCommand[];
}

/**
 * 历史管理器实现
 * HistoryManager implementation with undo/redo stacks
 */
export class HistoryManager implements IHistoryManager {
    /** 配置选项 */
    private readonly options: Required<HistoryOptions>;
    
    /** Chronos 上下文 */
    private readonly context: Context;
    
    /** 撤销栈 */
    private undoStack: HistoryCommand[] = [];
    
    /** 重做栈 */
    private redoStack: HistoryCommand[] = [];
    
    /** 变更监听器 */
    private changeListeners: Set<(event: HistoryChangeEvent) => void> = new Set();
    
    /** 命令工厂注册表 */
    private commandFactories: Map<HistoryCommandType, CommandFactory> = new Map();
    
    /** 键盘事件处理器 */
    private keyboardHandler?: (e: KeyboardEvent) => void;
    
    /** 是否正在执行 undo/redo（防止递归） */
    private isExecutingHistory = false;

    constructor(context: Context, options?: HistoryOptions) {
        this.context = context;
        this.options = { ...DEFAULT_OPTIONS, ...options };
        
        if (this.options.enableKeyboardShortcuts) {
            this.setupKeyboardShortcuts();
        }
    }

    get enabled(): boolean {
        return this.options.enabled;
    }

    /**
     * 执行命令并添加到历史记录
     * Execute command and add to history
     */
    execute(command: HistoryCommand): void {
        if (!this.options.enabled || this.isExecutingHistory) {
            return;
        }

        // 执行命令
        command.execute();
        
        // 添加到撤销栈
        this.undoStack.push(command);
        
        // 清空重做栈（新操作会使之前的重做无效）
        this.redoStack = [];
        
        // 限制栈大小
        this.enforceMaxSize();
        
        // 触发变更事件
        this.emitChange({
            action: "execute",
            command,
            undoStackSize: this.undoStack.length,
            redoStackSize: this.redoStack.length
        });
    }
    
    /**
     * 仅记录命令到历史（不执行）
     * 用于操作已经完成后记录历史
     * Push command to history without executing (for operations already performed)
     */
    push(command: HistoryCommand): void {
        if (!this.options.enabled || this.isExecutingHistory) {
            return;
        }
        
        // 直接添加到撤销栈（不执行命令）
        this.undoStack.push(command);
        
        // 清空重做栈（新操作会使之前的重做无效）
        this.redoStack = [];
        
        // 限制栈大小
        this.enforceMaxSize();
        
        // 触发变更事件
        this.emitChange({
            action: "execute",
            command,
            undoStackSize: this.undoStack.length,
            redoStackSize: this.redoStack.length
        });
    }

    /**
     * 撤销上一个命令
     * Undo the last command
     */
    undo(): boolean {
        if (!this.canUndo()) {
            return false;
        }

        this.isExecutingHistory = true;
        try {
            const command = this.undoStack.pop();
            if (!command) {
                return false;
            }

            // 执行撤销
            command.undo();
            
            // 移动到重做栈
            this.redoStack.push(command);
            
            // 触发变更事件
            this.emitChange({
                action: "undo",
                command,
                undoStackSize: this.undoStack.length,
                redoStackSize: this.redoStack.length
            });
            
            return true;
        } finally {
            this.isExecutingHistory = false;
        }
    }

    /**
     * 重做上一个撤销的命令
     * Redo the last undone command
     */
    redo(): boolean {
        if (!this.canRedo()) {
            return false;
        }

        this.isExecutingHistory = true;
        try {
            const command = this.redoStack.pop();
            if (!command) {
                return false;
            }

            // 执行重做
            command.execute();
            
            // 移动回撤销栈
            this.undoStack.push(command);
            
            // 触发变更事件
            this.emitChange({
                action: "redo",
                command,
                undoStackSize: this.undoStack.length,
                redoStackSize: this.redoStack.length
            });
            
            return true;
        } finally {
            this.isExecutingHistory = false;
        }
    }

    canUndo(): boolean {
        return this.options.enabled && this.undoStack.length > 0;
    }

    canRedo(): boolean {
        return this.options.enabled && this.redoStack.length > 0;
    }

    getUndoStack(): readonly HistoryCommand[] {
        return this.undoStack;
    }

    getRedoStack(): readonly HistoryCommand[] {
        return this.redoStack;
    }

    /**
     * 导出历史记录为 JSON
     * Export history to JSON string
     */
    exportHistory(): string {
        const exportData: ExportedHistory = {
            version: "1.0.0",
            exportedAt: new Date().toISOString(),
            undoStack: this.undoStack.map(cmd => cmd.toJSON()),
            redoStack: this.redoStack.map(cmd => cmd.toJSON())
        };
        return JSON.stringify(exportData, null, 2);
    }

    /**
     * 从 JSON 导入历史记录
     * Import history from JSON string
     */
    importHistory(json: string): void {
        try {
            const data = JSON.parse(json) as ExportedHistory;
            
            if (!data.version || !data.undoStack || !data.redoStack) {
                throw new Error("无效的历史记录格式 / Invalid history format");
            }
            
            // 清空当前历史
            this.clear();
            
            // 重建命令
            this.undoStack = data.undoStack
                .map(serialized => this.deserializeCommand(serialized))
                .filter((cmd): cmd is HistoryCommand => cmd !== null);
                
            this.redoStack = data.redoStack
                .map(serialized => this.deserializeCommand(serialized))
                .filter((cmd): cmd is HistoryCommand => cmd !== null);
            
            // 触发变更事件
            this.emitChange({
                action: "clear",
                undoStackSize: this.undoStack.length,
                redoStackSize: this.redoStack.length
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            throw new Error(`导入历史记录失败: ${message} / Failed to import history: ${message}`);
        }
    }

    /**
     * 清空历史记录
     * Clear all history
     */
    clear(): void {
        this.undoStack = [];
        this.redoStack = [];
        
        this.emitChange({
            action: "clear",
            undoStackSize: 0,
            redoStackSize: 0
        });
    }

    /**
     * 注册命令工厂
     * Register command factory for deserialization
     */
    registerCommandFactory(factory: CommandFactory): void {
        for (const type of factory.supportedTypes) {
            this.commandFactories.set(type, factory);
        }
    }

    onChange(callback: (event: HistoryChangeEvent) => void): void {
        this.changeListeners.add(callback);
    }

    offChange(callback: (event: HistoryChangeEvent) => void): void {
        this.changeListeners.delete(callback);
    }

    /**
     * 销毁管理器
     * Destroy manager and cleanup resources
     */
    destroy(): void {
        // 移除键盘监听
        if (this.keyboardHandler) {
            window.removeEventListener("keydown", this.keyboardHandler);
            this.keyboardHandler = undefined;
        }
        
        // 清空监听器
        this.changeListeners.clear();
        
        // 清空栈
        this.undoStack = [];
        this.redoStack = [];
    }

    /**
     * 设置键盘快捷键
     * Setup keyboard shortcuts for undo/redo
     */
    private setupKeyboardShortcuts(): void {
        this.keyboardHandler = (e: KeyboardEvent) => {
            // 检查是否在输入框中
            const target = e.target as HTMLElement;
            if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
                return;
            }

            // Ctrl+Z / Cmd+Z: Undo
            if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
                e.preventDefault();
                this.undo();
                return;
            }

            // Ctrl+Y / Cmd+Shift+Z: Redo
            if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
                e.preventDefault();
                this.redo();
                return;
            }
        };

        window.addEventListener("keydown", this.keyboardHandler);
    }

    /**
     * 限制栈大小
     * Enforce maximum stack size
     */
    private enforceMaxSize(): void {
        while (this.undoStack.length > this.options.maxSize) {
            this.undoStack.shift();
        }
    }

    /**
     * 反序列化命令
     * Deserialize command from JSON
     */
    private deserializeCommand(data: SerializedCommand): HistoryCommand | null {
        const factory = this.commandFactories.get(data.type);
        if (!factory) {
            console.warn(`[HistoryManager] 未找到命令工厂: ${data.type} / Command factory not found`);
            return null;
        }
        
        try {
            return factory.fromJSON(data, this.context);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            console.error(`[HistoryManager] 反序列化命令失败: ${message} / Failed to deserialize command`);
            return null;
        }
    }

    /**
     * 触发变更事件
     * Emit change event to all listeners
     */
    private emitChange(event: HistoryChangeEvent): void {
        for (const listener of this.changeListeners) {
            try {
                listener(event);
            } catch (error) {
                console.error("[HistoryManager] 变更监听器错误 / Change listener error:", error);
            }
        }
    }
}
