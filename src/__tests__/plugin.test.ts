import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PluginManager } from '../plugin/manager.plugin';
import type { ChronosPlugin, PluginContext } from '../plugin/plugin.interface';

/**
 * 插件系统测试
 * Plugin system unit tests
 * 
 * 注意：这些测试验证 PluginManager 的核心逻辑，
 * 不需要完整的 Chronos 实例（需要 DOM 环境）
 */
describe('Plugin System', () => {

    describe('Plugin Installation', () => {
        let manager: PluginManager;

        beforeEach(() => {
            manager = new PluginManager();
        });

        it('should install a single plugin', () => {
            const plugin: ChronosPlugin = { name: 'test-plugin' };
            
            expect(() => manager.install(plugin)).not.toThrow();
        });

        it('should reject duplicate plugin names', () => {
            const plugin1: ChronosPlugin = { name: 'duplicate' };
            const plugin2: ChronosPlugin = { name: 'duplicate' };

            manager.install(plugin1);
            
            expect(() => manager.install(plugin2)).toThrow(/已安装|already installed/i);
        });

        it('should install multiple plugins with unique names', () => {
            const plugins: ChronosPlugin[] = [
                { name: 'plugin-a' },
                { name: 'plugin-b' },
                { name: 'plugin-c' }
            ];

            expect(() => manager.installAll(plugins)).not.toThrow();
        });
    });

    describe('Dependency Resolution', () => {
        let manager: PluginManager;

        beforeEach(() => {
            manager = new PluginManager();
        });

        it('should install plugins in dependency order', () => {
            const installOrder: string[] = [];
            
            const pluginA: ChronosPlugin = { 
                name: 'plugin-a',
                dependencies: ['plugin-b']
            };
            const pluginB: ChronosPlugin = { 
                name: 'plugin-b' 
            };
            const pluginC: ChronosPlugin = { 
                name: 'plugin-c',
                dependencies: ['plugin-a']
            };

            // 创建监视器来跟踪安装顺序
            const originalInstall = manager.install.bind(manager);
            manager.install = (plugin: ChronosPlugin) => {
                installOrder.push(plugin.name);
                originalInstall(plugin);
            };

            // pluginC -> pluginA -> pluginB (依赖链)
            // 正确顺序应该是: pluginB, pluginA, pluginC
            manager.installAll([pluginC, pluginA, pluginB]);

            expect(installOrder).toEqual(['plugin-b', 'plugin-a', 'plugin-c']);
        });

        it('should detect circular dependencies', () => {
            const pluginA: ChronosPlugin = { 
                name: 'plugin-a',
                dependencies: ['plugin-b']
            };
            const pluginB: ChronosPlugin = { 
                name: 'plugin-b',
                dependencies: ['plugin-a']
            };

            expect(() => manager.installAll([pluginA, pluginB]))
                .toThrow(/循环依赖|circular/i);
        });

        it('should detect missing dependencies', () => {
            const plugin: ChronosPlugin = { 
                name: 'plugin-a',
                dependencies: ['non-existent']
            };

            expect(() => manager.installAll([plugin]))
                .toThrow(/non-existent/);
        });

        it('should handle complex dependency graph', () => {
            const installOrder: string[] = [];
            
            // 复杂依赖图:
            // D -> A, B
            // C -> A
            // A -> (none)
            // B -> (none)
            const pluginA: ChronosPlugin = { name: 'A' };
            const pluginB: ChronosPlugin = { name: 'B' };
            const pluginC: ChronosPlugin = { name: 'C', dependencies: ['A'] };
            const pluginD: ChronosPlugin = { name: 'D', dependencies: ['A', 'B'] };

            const originalInstall = manager.install.bind(manager);
            manager.install = (plugin: ChronosPlugin) => {
                installOrder.push(plugin.name);
                originalInstall(plugin);
            };

            manager.installAll([pluginD, pluginC, pluginB, pluginA]);

            // A 和 B 必须在 D 之前
            // A 必须在 C 之前
            const indexA = installOrder.indexOf('A');
            const indexB = installOrder.indexOf('B');
            const indexC = installOrder.indexOf('C');
            const indexD = installOrder.indexOf('D');

            expect(indexA).toBeLessThan(indexC);
            expect(indexA).toBeLessThan(indexD);
            expect(indexB).toBeLessThan(indexD);
        });
    });

    describe('Lifecycle Hooks', () => {
        let manager: PluginManager;

        beforeEach(() => {
            manager = new PluginManager();
        });

        it('should warn when invoking hooks without context', () => {
            const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
            const plugin: ChronosPlugin = { 
                name: 'test',
                onInstall: vi.fn()
            };

            manager.install(plugin);
            manager.invokeHook('onInstall');

            expect(warnSpy).toHaveBeenCalledWith(
                expect.stringContaining('Context not set'),
                'onInstall'
            );
            expect(plugin.onInstall).not.toHaveBeenCalled();

            warnSpy.mockRestore();
        });

        it('should call hooks in installation order', () => {
            const callOrder: string[] = [];
            
            const pluginA: ChronosPlugin = { 
                name: 'A',
                onInstall: () => callOrder.push('A')
            };
            const pluginB: ChronosPlugin = { 
                name: 'B',
                dependencies: ['A'],
                onInstall: () => callOrder.push('B')
            };

            manager.installAll([pluginB, pluginA]);
            
            // 创建模拟的 PluginContext
            const mockContext = createMockPluginContext();
            // 使用 any 绕过 private 方法访问限制进行测试
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (manager as any).pluginContext = mockContext;

            manager.invokeHook('onInstall');

            expect(callOrder).toEqual(['A', 'B']);
        });

        it('should isolate plugin errors and continue with other plugins', () => {
            const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            const callOrder: string[] = [];

            const pluginA: ChronosPlugin = { 
                name: 'A',
                onInstall: () => { throw new Error('Plugin A failed'); }
            };
            const pluginB: ChronosPlugin = { 
                name: 'B',
                onInstall: () => callOrder.push('B')
            };

            manager.installAll([pluginA, pluginB]);
            
            const mockContext = createMockPluginContext();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (manager as any).pluginContext = mockContext;

            manager.invokeHook('onInstall');

            // B 应该仍然被调用
            expect(callOrder).toContain('B');
            // 错误应该被记录
            expect(errorSpy).toHaveBeenCalledWith(
                expect.stringContaining('Plugin "A"')
            );

            errorSpy.mockRestore();
        });

        it('should call all lifecycle hooks in correct sequence', () => {
            const lifecycle: string[] = [];

            const plugin: ChronosPlugin = { 
                name: 'lifecycle-test',
                onInstall: () => lifecycle.push('onInstall'),
                onBeforeInit: () => lifecycle.push('onBeforeInit'),
                onAfterInit: () => lifecycle.push('onAfterInit'),
                onAfterStart: () => lifecycle.push('onAfterStart'),
                onDestroy: () => lifecycle.push('onDestroy')
            };

            manager.install(plugin);
            
            const mockContext = createMockPluginContext();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (manager as any).pluginContext = mockContext;

            // 模拟 Chronos 生命周期顺序
            manager.invokeHook('onInstall');
            manager.invokeHook('onBeforeInit');
            manager.invokeHook('onAfterInit');
            manager.invokeHook('onAfterStart');
            manager.invokeHook('onDestroy');

            expect(lifecycle).toEqual([
                'onInstall',
                'onBeforeInit',
                'onAfterInit',
                'onAfterStart',
                'onDestroy'
            ]);
        });

        it('should skip plugins without the specified hook', () => {
            const callOrder: string[] = [];

            const pluginA: ChronosPlugin = { 
                name: 'A',
                onInstall: () => callOrder.push('A-install'),
                // no onBeforeInit
            };
            const pluginB: ChronosPlugin = { 
                name: 'B',
                onBeforeInit: () => callOrder.push('B-beforeInit'),
                // no onInstall
            };

            manager.installAll([pluginA, pluginB]);
            
            const mockContext = createMockPluginContext();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (manager as any).pluginContext = mockContext;

            manager.invokeHook('onInstall');
            manager.invokeHook('onBeforeInit');

            expect(callOrder).toEqual(['A-install', 'B-beforeInit']);
        });
    });

    describe('PluginContext API', () => {
        let manager: PluginManager;
        let receivedContext: PluginContext | undefined;

        beforeEach(() => {
            manager = new PluginManager();
            receivedContext = undefined;
        });

        it('should provide getPlugin method to access other plugins', () => {
            const pluginA: ChronosPlugin = { 
                name: 'A',
                version: '1.0.0'
            };
            const pluginB: ChronosPlugin = { 
                name: 'B',
                onInstall: (ctx) => {
                    receivedContext = ctx;
                }
            };

            manager.installAll([pluginA, pluginB]);
            
            const mockContext = createMockPluginContext();
            // 覆盖 getPlugin 使用真实逻辑
            mockContext.getPlugin = <T extends ChronosPlugin>(name: string): T | undefined => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                return (manager as any).plugins.get(name) as T | undefined;
            };
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (manager as any).pluginContext = mockContext;

            manager.invokeHook('onInstall');

            expect(receivedContext).toBeDefined();
            if (!receivedContext) return; // Type guard for TS
            const foundPlugin = receivedContext.getPlugin<ChronosPlugin>('A');
            expect(foundPlugin).toBeDefined();
            expect(foundPlugin?.name).toBe('A');
            expect(foundPlugin?.version).toBe('1.0.0');
        });

        it('should provide log method for plugin logging', () => {
            const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
            
            const plugin: ChronosPlugin = { 
                name: 'logger-test',
                onInstall: (ctx) => {
                    ctx.log('info', 'Plugin initialized');
                }
            };

            manager.install(plugin);
            
            const mockContext = createMockPluginContext();
            mockContext.log = (level, message) => {
                console[level](`[Plugin:logger-test] ${message}`);
            };
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (manager as any).pluginContext = mockContext;

            manager.invokeHook('onInstall');

            expect(infoSpy).toHaveBeenCalledWith(
                expect.stringContaining('Plugin initialized')
            );

            infoSpy.mockRestore();
        });
    });

    describe('Edge Cases', () => {
        let manager: PluginManager;

        beforeEach(() => {
            manager = new PluginManager();
        });

        it('should handle empty plugin list', () => {
            expect(() => manager.installAll([])).not.toThrow();
        });

        it('should handle plugin with empty dependencies array', () => {
            const plugin: ChronosPlugin = { 
                name: 'test',
                dependencies: []
            };

            expect(() => manager.install(plugin)).not.toThrow();
        });

        it('should handle plugin with undefined hooks', () => {
            const plugin: ChronosPlugin = { 
                name: 'minimal',
                // 没有任何钩子
            };

            manager.install(plugin);
            
            const mockContext = createMockPluginContext();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (manager as any).pluginContext = mockContext;

            // 不应该抛出错误
            expect(() => {
                manager.invokeHook('onInstall');
                manager.invokeHook('onBeforeInit');
                manager.invokeHook('onAfterInit');
                manager.invokeHook('onAfterStart');
                manager.invokeHook('onDestroy');
            }).not.toThrow();
        });

        it('should detect three-way circular dependency', () => {
            const pluginA: ChronosPlugin = { 
                name: 'A',
                dependencies: ['C']
            };
            const pluginB: ChronosPlugin = { 
                name: 'B',
                dependencies: ['A']
            };
            const pluginC: ChronosPlugin = { 
                name: 'C',
                dependencies: ['B']
            };

            expect(() => manager.installAll([pluginA, pluginB, pluginC]))
                .toThrow(/循环依赖|circular/i);
        });
    });
});

/**
 * 创建模拟的 PluginContext
 * Create a mock PluginContext for testing
 */
function createMockPluginContext(): PluginContext {
    return {
        context: {} as PluginContext['context'],
        registerComponent: vi.fn(),
        on: vi.fn(),
        emit: vi.fn(),
        getPlugin: vi.fn(),
        log: vi.fn()
    };
}
