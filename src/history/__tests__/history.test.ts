import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { HistoryManager } from '../manager.history';
import { 
    HistoryCommand, 
    HistoryCommandType, 
    SerializedCommand,
    CommandFactory
} from '../history.interface';
import { Context } from '../../core/context/context';

/**
 * 创建模拟的 Context
 * Create mock Context for testing
 */
function createMockContext(): Context {
    return {
        ioc: {} as never,
        drawContext: {} as never,
        eventManager: undefined,
        historyManager: undefined
    } as unknown as Context;
}

/**
 * 创建模拟的命令
 * Create mock command for testing
 */
function createMockCommand(options?: {
    id?: string;
    type?: HistoryCommandType;
    description?: string;
    executeCallback?: () => void;
    undoCallback?: () => void;
}): HistoryCommand {
    const id = options?.id ?? `cmd_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    return {
        id,
        type: options?.type ?? HistoryCommandType.NODE_DRAG,
        timestamp: Date.now(),
        description: options?.description ?? 'Test command',
        execute: options?.executeCallback ?? vi.fn(),
        undo: options?.undoCallback ?? vi.fn(),
        toJSON: () => ({
            id,
            type: options?.type ?? HistoryCommandType.NODE_DRAG,
            timestamp: Date.now(),
            beforeState: { x: 0 },
            afterState: { x: 100 }
        })
    };
}

describe('HistoryManager', () => {
    let context: Context;
    let manager: HistoryManager;

    beforeEach(() => {
        context = createMockContext();
        manager = new HistoryManager(context, { enableKeyboardShortcuts: false });
    });

    afterEach(() => {
        manager.destroy();
    });

    describe('初始化 / Initialization', () => {
        it('应该默认启用 / should be enabled by default', () => {
            expect(manager.enabled).toBe(true);
        });

        it('应该初始化空栈 / should initialize with empty stacks', () => {
            expect(manager.getUndoStack()).toHaveLength(0);
            expect(manager.getRedoStack()).toHaveLength(0);
        });

        it('应该尊重 enabled 选项 / should respect enabled option', () => {
            const disabledManager = new HistoryManager(context, { 
                enabled: false,
                enableKeyboardShortcuts: false 
            });
            expect(disabledManager.enabled).toBe(false);
            disabledManager.destroy();
        });

        it('初始时不能撤销或重做 / should not be able to undo or redo initially', () => {
            expect(manager.canUndo()).toBe(false);
            expect(manager.canRedo()).toBe(false);
        });
    });

    describe('execute() - 执行并记录', () => {
        it('应该执行命令 / should execute the command', () => {
            const executeFn = vi.fn();
            const command = createMockCommand({ executeCallback: executeFn });
            
            manager.execute(command);
            
            expect(executeFn).toHaveBeenCalledTimes(1);
        });

        it('应该添加命令到撤销栈 / should add command to undo stack', () => {
            const command = createMockCommand();
            
            manager.execute(command);
            
            expect(manager.getUndoStack()).toHaveLength(1);
            expect(manager.canUndo()).toBe(true);
        });

        it('执行后应该清空重做栈 / should clear redo stack after execute', () => {
            const cmd1 = createMockCommand({ id: 'cmd1' });
            const cmd2 = createMockCommand({ id: 'cmd2' });
            
            manager.execute(cmd1);
            manager.undo();
            expect(manager.canRedo()).toBe(true);
            
            manager.execute(cmd2);
            expect(manager.canRedo()).toBe(false);
            expect(manager.getRedoStack()).toHaveLength(0);
        });

        it('禁用时不应执行 / should not execute when disabled', () => {
            const disabledManager = new HistoryManager(context, { 
                enabled: false,
                enableKeyboardShortcuts: false 
            });
            const executeFn = vi.fn();
            const command = createMockCommand({ executeCallback: executeFn });
            
            disabledManager.execute(command);
            
            expect(executeFn).not.toHaveBeenCalled();
            expect(disabledManager.getUndoStack()).toHaveLength(0);
            disabledManager.destroy();
        });
    });

    describe('push() - 仅记录不执行', () => {
        it('不应该执行命令 / should not execute the command', () => {
            const executeFn = vi.fn();
            const command = createMockCommand({ executeCallback: executeFn });
            
            manager.push(command);
            
            expect(executeFn).not.toHaveBeenCalled();
        });

        it('应该添加命令到撤销栈 / should add command to undo stack', () => {
            const command = createMockCommand();
            
            manager.push(command);
            
            expect(manager.getUndoStack()).toHaveLength(1);
            expect(manager.canUndo()).toBe(true);
        });

        it('push 后应该清空重做栈 / should clear redo stack after push', () => {
            const cmd1 = createMockCommand({ id: 'cmd1' });
            const cmd2 = createMockCommand({ id: 'cmd2' });
            
            manager.push(cmd1);
            manager.undo();
            expect(manager.canRedo()).toBe(true);
            
            manager.push(cmd2);
            expect(manager.canRedo()).toBe(false);
        });

        it('禁用时不应记录 / should not push when disabled', () => {
            const disabledManager = new HistoryManager(context, { 
                enabled: false,
                enableKeyboardShortcuts: false 
            });
            const command = createMockCommand();
            
            disabledManager.push(command);
            
            expect(disabledManager.getUndoStack()).toHaveLength(0);
            disabledManager.destroy();
        });
    });

    describe('undo() - 撤销', () => {
        it('应该调用命令的 undo 方法 / should call command undo method', () => {
            const undoFn = vi.fn();
            const command = createMockCommand({ undoCallback: undoFn });
            
            manager.push(command);
            const result = manager.undo();
            
            expect(result).toBe(true);
            expect(undoFn).toHaveBeenCalledTimes(1);
        });

        it('应该将命令移动到重做栈 / should move command to redo stack', () => {
            const command = createMockCommand();
            
            manager.push(command);
            manager.undo();
            
            expect(manager.getUndoStack()).toHaveLength(0);
            expect(manager.getRedoStack()).toHaveLength(1);
            expect(manager.canRedo()).toBe(true);
        });

        it('空栈时撤销应返回 false / should return false when stack is empty', () => {
            const result = manager.undo();
            expect(result).toBe(false);
        });

        it('应该支持多次撤销 / should support multiple undos', () => {
            const cmd1 = createMockCommand({ id: 'cmd1' });
            const cmd2 = createMockCommand({ id: 'cmd2' });
            const cmd3 = createMockCommand({ id: 'cmd3' });
            
            manager.push(cmd1);
            manager.push(cmd2);
            manager.push(cmd3);
            
            expect(manager.getUndoStack()).toHaveLength(3);
            
            manager.undo();
            expect(manager.getUndoStack()).toHaveLength(2);
            expect(manager.getRedoStack()).toHaveLength(1);
            
            manager.undo();
            expect(manager.getUndoStack()).toHaveLength(1);
            expect(manager.getRedoStack()).toHaveLength(2);
            
            manager.undo();
            expect(manager.getUndoStack()).toHaveLength(0);
            expect(manager.getRedoStack()).toHaveLength(3);
        });
    });

    describe('redo() - 重做', () => {
        it('应该调用命令的 execute 方法 / should call command execute method', () => {
            const executeFn = vi.fn();
            const command = createMockCommand({ executeCallback: executeFn });
            
            manager.push(command);
            manager.undo();
            executeFn.mockClear();
            
            const result = manager.redo();
            
            expect(result).toBe(true);
            expect(executeFn).toHaveBeenCalledTimes(1);
        });

        it('应该将命令移回撤销栈 / should move command back to undo stack', () => {
            const command = createMockCommand();
            
            manager.push(command);
            manager.undo();
            manager.redo();
            
            expect(manager.getUndoStack()).toHaveLength(1);
            expect(manager.getRedoStack()).toHaveLength(0);
        });

        it('重做栈为空时应返回 false / should return false when redo stack is empty', () => {
            const result = manager.redo();
            expect(result).toBe(false);
        });

        it('应该支持多次重做 / should support multiple redos', () => {
            const cmd1 = createMockCommand({ id: 'cmd1' });
            const cmd2 = createMockCommand({ id: 'cmd2' });
            
            manager.push(cmd1);
            manager.push(cmd2);
            manager.undo();
            manager.undo();
            
            expect(manager.getRedoStack()).toHaveLength(2);
            
            manager.redo();
            expect(manager.getUndoStack()).toHaveLength(1);
            expect(manager.getRedoStack()).toHaveLength(1);
            
            manager.redo();
            expect(manager.getUndoStack()).toHaveLength(2);
            expect(manager.getRedoStack()).toHaveLength(0);
        });
    });

    describe('maxSize - 栈大小限制', () => {
        it('应该限制撤销栈大小 / should enforce max stack size', () => {
            const smallManager = new HistoryManager(context, { 
                maxSize: 3,
                enableKeyboardShortcuts: false 
            });
            
            for (let i = 0; i < 5; i++) {
                smallManager.push(createMockCommand({ id: `cmd${i}` }));
            }
            
            expect(smallManager.getUndoStack()).toHaveLength(3);
            smallManager.destroy();
        });

        it('应该移除最早的命令 / should remove oldest commands', () => {
            const smallManager = new HistoryManager(context, { 
                maxSize: 2,
                enableKeyboardShortcuts: false 
            });
            
            const cmd1 = createMockCommand({ id: 'cmd1', description: 'First' });
            const cmd2 = createMockCommand({ id: 'cmd2', description: 'Second' });
            const cmd3 = createMockCommand({ id: 'cmd3', description: 'Third' });
            
            smallManager.push(cmd1);
            smallManager.push(cmd2);
            smallManager.push(cmd3);
            
            const stack = smallManager.getUndoStack();
            expect(stack).toHaveLength(2);
            expect(stack[0]?.description).toBe('Second');
            expect(stack[1]?.description).toBe('Third');
            
            smallManager.destroy();
        });
    });

    describe('clear() - 清空历史', () => {
        it('应该清空所有栈 / should clear all stacks', () => {
            manager.push(createMockCommand({ id: 'cmd1' }));
            manager.push(createMockCommand({ id: 'cmd2' }));
            manager.undo();
            
            expect(manager.getUndoStack()).toHaveLength(1);
            expect(manager.getRedoStack()).toHaveLength(1);
            
            manager.clear();
            
            expect(manager.getUndoStack()).toHaveLength(0);
            expect(manager.getRedoStack()).toHaveLength(0);
        });
    });

    describe('onChange / offChange - 变更监听', () => {
        it('应该在 execute 时触发事件 / should emit event on execute', () => {
            const listener = vi.fn();
            manager.onChange(listener);
            
            const command = createMockCommand();
            manager.execute(command);
            
            expect(listener).toHaveBeenCalledTimes(1);
            expect(listener).toHaveBeenCalledWith(expect.objectContaining({
                action: 'execute',
                command,
                undoStackSize: 1,
                redoStackSize: 0
            }));
        });

        it('应该在 push 时触发事件 / should emit event on push', () => {
            const listener = vi.fn();
            manager.onChange(listener);
            
            const command = createMockCommand();
            manager.push(command);
            
            expect(listener).toHaveBeenCalledTimes(1);
            expect(listener).toHaveBeenCalledWith(expect.objectContaining({
                action: 'execute',
                undoStackSize: 1
            }));
        });

        it('应该在 undo 时触发事件 / should emit event on undo', () => {
            const listener = vi.fn();
            manager.onChange(listener);
            
            manager.push(createMockCommand());
            listener.mockClear();
            
            manager.undo();
            
            expect(listener).toHaveBeenCalledWith(expect.objectContaining({
                action: 'undo',
                undoStackSize: 0,
                redoStackSize: 1
            }));
        });

        it('应该在 redo 时触发事件 / should emit event on redo', () => {
            const listener = vi.fn();
            manager.onChange(listener);
            
            manager.push(createMockCommand());
            manager.undo();
            listener.mockClear();
            
            manager.redo();
            
            expect(listener).toHaveBeenCalledWith(expect.objectContaining({
                action: 'redo',
                undoStackSize: 1,
                redoStackSize: 0
            }));
        });

        it('应该在 clear 时触发事件 / should emit event on clear', () => {
            const listener = vi.fn();
            manager.onChange(listener);
            
            manager.push(createMockCommand());
            listener.mockClear();
            
            manager.clear();
            
            expect(listener).toHaveBeenCalledWith(expect.objectContaining({
                action: 'clear',
                undoStackSize: 0,
                redoStackSize: 0
            }));
        });

        it('应该能移除监听器 / should be able to remove listener', () => {
            const listener = vi.fn();
            manager.onChange(listener);
            manager.offChange(listener);
            
            manager.push(createMockCommand());
            
            expect(listener).not.toHaveBeenCalled();
        });
    });

    describe('exportHistory / importHistory - 导入导出', () => {
        it('应该导出有效的 JSON / should export valid JSON', () => {
            manager.push(createMockCommand({ id: 'cmd1' }));
            manager.push(createMockCommand({ id: 'cmd2' }));
            manager.undo();
            
            const exported = manager.exportHistory();
            const parsed = JSON.parse(exported);
            
            expect(parsed.version).toBe('1.0.0');
            expect(parsed.exportedAt).toBeDefined();
            expect(parsed.undoStack).toHaveLength(1);
            expect(parsed.redoStack).toHaveLength(1);
        });

        it('应该导出空历史 / should export empty history', () => {
            const exported = manager.exportHistory();
            const parsed = JSON.parse(exported);
            
            expect(parsed.undoStack).toHaveLength(0);
            expect(parsed.redoStack).toHaveLength(0);
        });

        it('导入无效 JSON 应抛出错误 / should throw on invalid JSON', () => {
            expect(() => manager.importHistory('invalid json')).toThrow();
        });

        it('导入无效格式应抛出错误 / should throw on invalid format', () => {
            expect(() => manager.importHistory('{}')).toThrow('无效的历史记录格式');
        });

        it('导入时没有工厂应该跳过命令 / should skip commands without factory', () => {
            const exported = JSON.stringify({
                version: '1.0.0',
                exportedAt: new Date().toISOString(),
                undoStack: [{ 
                    id: 'cmd1', 
                    type: HistoryCommandType.NODE_DRAG,
                    timestamp: Date.now(),
                    beforeState: {},
                    afterState: {}
                }],
                redoStack: []
            });
            
            // 没有注册工厂，导入后应该为空
            manager.importHistory(exported);
            expect(manager.getUndoStack()).toHaveLength(0);
        });

        it('有工厂时应该正确导入 / should import correctly with factory', () => {
            const mockFactory: CommandFactory = {
                supportedTypes: [HistoryCommandType.NODE_DRAG],
                fromJSON: (data: SerializedCommand, _ctx: Context) => {
                    return createMockCommand({ 
                        id: data.id, 
                        type: data.type,
                        description: 'Imported command'
                    });
                }
            };
            
            manager.registerCommandFactory(mockFactory);
            
            const exported = JSON.stringify({
                version: '1.0.0',
                exportedAt: new Date().toISOString(),
                undoStack: [{ 
                    id: 'imported_cmd', 
                    type: HistoryCommandType.NODE_DRAG,
                    timestamp: Date.now(),
                    beforeState: { x: 0 },
                    afterState: { x: 100 }
                }],
                redoStack: []
            });
            
            manager.importHistory(exported);
            
            expect(manager.getUndoStack()).toHaveLength(1);
            expect(manager.getUndoStack()[0]?.id).toBe('imported_cmd');
        });

        it('导入应该清空现有历史 / should clear existing history on import', () => {
            manager.push(createMockCommand({ id: 'existing' }));
            expect(manager.getUndoStack()).toHaveLength(1);
            
            const exported = JSON.stringify({
                version: '1.0.0',
                exportedAt: new Date().toISOString(),
                undoStack: [],
                redoStack: []
            });
            
            manager.importHistory(exported);
            expect(manager.getUndoStack()).toHaveLength(0);
        });
    });

    describe('registerCommandFactory - 注册命令工厂', () => {
        it('应该注册工厂用于反序列化 / should register factory for deserialization', () => {
            const factory: CommandFactory = {
                supportedTypes: [HistoryCommandType.NODE_ADD, HistoryCommandType.NODE_DELETE],
                fromJSON: vi.fn().mockReturnValue(createMockCommand())
            };
            
            manager.registerCommandFactory(factory);
            
            const exported = JSON.stringify({
                version: '1.0.0',
                exportedAt: new Date().toISOString(),
                undoStack: [{ 
                    id: 'cmd1', 
                    type: HistoryCommandType.NODE_ADD,
                    timestamp: Date.now(),
                    beforeState: {},
                    afterState: {}
                }],
                redoStack: []
            });
            
            manager.importHistory(exported);
            
            expect(factory.fromJSON).toHaveBeenCalled();
        });
    });

    describe('destroy() - 销毁', () => {
        it('应该清空所有状态 / should clear all state', () => {
            manager.push(createMockCommand());
            manager.push(createMockCommand());
            manager.undo();
            
            const listener = vi.fn();
            manager.onChange(listener);
            
            manager.destroy();
            
            expect(manager.getUndoStack()).toHaveLength(0);
            expect(manager.getRedoStack()).toHaveLength(0);
        });
    });

    describe('防止递归 / Prevent recursion', () => {
        it('undo 期间不应记录新命令 / should not record commands during undo', () => {
            // 创建一个在 undo 时尝试 push 新命令的命令
            const managerRef = manager;
            const command = createMockCommand({
                undoCallback: () => {
                    // 尝试在 undo 期间 push
                    managerRef.push(createMockCommand({ id: 'nested' }));
                }
            });
            
            manager.push(command);
            manager.undo();
            
            // 嵌套的 push 应该被忽略
            expect(manager.getUndoStack()).toHaveLength(0);
        });

        it('redo 期间不应记录新命令 / should not record commands during redo', () => {
            const managerRef = manager;
            const command = createMockCommand({
                executeCallback: () => {
                    // 尝试在 redo (execute) 期间 push
                    managerRef.push(createMockCommand({ id: 'nested' }));
                }
            });
            
            manager.push(command);
            manager.undo();
            manager.redo();
            
            // 只应该有原始命令
            expect(manager.getUndoStack()).toHaveLength(1);
        });
    });
});

describe('HistoryCommand Interface', () => {
    it('命令应该实现所有必需的属性和方法 / command should implement all required properties and methods', () => {
        const command = createMockCommand({
            id: 'test_cmd',
            type: HistoryCommandType.LANE_ADD,
            description: 'Add lane'
        });
        
        // 验证属性
        expect(command.id).toBe('test_cmd');
        expect(command.type).toBe(HistoryCommandType.LANE_ADD);
        expect(command.description).toBe('Add lane');
        expect(typeof command.timestamp).toBe('number');
        
        // 验证方法
        expect(typeof command.execute).toBe('function');
        expect(typeof command.undo).toBe('function');
        expect(typeof command.toJSON).toBe('function');
    });

    it('toJSON 应该返回有效的序列化数据 / toJSON should return valid serialized data', () => {
        const command = createMockCommand({
            id: 'serialize_test',
            type: HistoryCommandType.NODE_TRANSFORM
        });
        
        const serialized = command.toJSON();
        
        expect(serialized.id).toBe('serialize_test');
        expect(serialized.type).toBe(HistoryCommandType.NODE_TRANSFORM);
        expect(typeof serialized.timestamp).toBe('number');
        expect(serialized.beforeState).toBeDefined();
        expect(serialized.afterState).toBeDefined();
    });
});
