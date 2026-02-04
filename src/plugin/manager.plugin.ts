import { Container } from "inversify";
import { Context } from "../core/context/context";
import { ChronosPlugin, PluginContext, ComponentRegistration } from "./plugin.interface";
import { bindComponent, bindLifecycle, TYPES } from "../config/inversify.config";
import { StageDragListener, MouseMoveListener, ResizeListener } from "../core/event/event";

/**
 * 插件管理器
 * Manages plugin registration, lifecycle hooks, and component registration
 */
export class PluginManager {
    /** 已安装的插件 */
    private plugins: Map<string, ChronosPlugin> = new Map();
    
    /** DI 容器 */
    private container?: Container;
    
    /** Chronos 上下文 */
    private context?: Context;
    
    /** 插件上下文缓存 */
    private pluginContext?: PluginContext;
    
    /** 当前正在调用钩子的插件名 (用于 registerComponent) */
    private currentPluginName?: string;

    /**
     * 安装单个插件
     * Install a single plugin with name uniqueness check
     */
    install(plugin: ChronosPlugin): void {
        if (this.plugins.has(plugin.name)) {
            throw new Error(`插件 "${plugin.name}" 已安装 / Plugin already installed`);
        }
        this.plugins.set(plugin.name, plugin);
    }

    /**
     * 批量安装插件（带拓扑排序）
     * Install multiple plugins with dependency resolution
     */
    installAll(plugins: ChronosPlugin[]): void {
        const sorted = this.topologicalSort(plugins);
        sorted.forEach(p => this.install(p));
    }

    /**
     * 设置容器和上下文
     * Set container and context for plugin operations
     */
    setContext(container: Container, context: Context): void {
        this.container = container;
        this.context = context;
        this.pluginContext = this.createPluginContext();
    }

    /**
     * 调用生命周期钩子
     * Invoke lifecycle hook on all installed plugins
     */
    invokeHook(hookName: 'onInstall' | 'onBeforeInit' | 'onAfterInit' | 'onAfterStart' | 'onDestroy'): void {
        if (!this.pluginContext) {
            console.warn('[PluginManager] Context not set, skipping hook:', hookName);
            return;
        }

        for (const [name, plugin] of this.plugins) {
            const hook = plugin[hookName];
            if (typeof hook === 'function') {
                try {
                    this.currentPluginName = name;
                    hook.call(plugin, this.pluginContext);
                } catch (err) {
                    const error = err as Error;
                    console.error(`[Plugin "${name}"] ${hookName} 错误: ${error.message}`);
                } finally {
                    this.currentPluginName = undefined;
                }
            }
        }
    }

    /**
     * 创建插件上下文
     * Create PluginContext instance for plugins to use
     */
    private createPluginContext(): PluginContext {
        if (!this.context || !this.container) {
            throw new Error('Context and Container must be set before creating PluginContext');
        }

        const context = this.context;
        const container = this.container;

        return {
            context,
            
            registerComponent: (registration: ComponentRegistration): void => {
                this.registerComponent(registration, container, context);
            },
            
            on: (event: symbol, handler: (data?: unknown) => void): void => {
                // 使用 EventManager 的 listen 方法
                // 需要创建一个伪 EventPublisher
                const publisher = {
                    id: `plugin:${this.currentPluginName ?? 'unknown'}`,
                    on: () => {},
                    publishAndPop: () => {}
                };
                context.eventManager?.listen(publisher, event, handler);
            },
            
            emit: (event: symbol, data?: unknown): void => {
                const publisher = {
                    id: `plugin:${this.currentPluginName ?? 'unknown'}`,
                    on: () => {},
                    publishAndPop: () => {}
                };
                context.eventManager?.publish(publisher, event, data);
            },
            
            getPlugin: <T extends ChronosPlugin>(name: string): T | undefined => {
                return this.plugins.get(name) as T | undefined;
            },
            
            log: (level: 'debug' | 'info' | 'warn' | 'error', message: string): void => {
                const prefix = `[Plugin${this.currentPluginName ? `:${this.currentPluginName}` : ''}]`;
                console[level](`${prefix} ${message}`);
            }
        };
    }

    /**
     * 注册插件组件
     * Register a plugin component to the DI container
     */
    private registerComponent(
        registration: ComponentRegistration,
        container: Container,
        context: Context
    ): void {
        const pluginName = this.currentPluginName ?? 'unknown';
        
        // 使用动态 Symbol 防止命名冲突
        const dataSymbol = Symbol.for(`plugin:${pluginName}:${registration.id}:Data`);
        const serviceSymbol = Symbol.for(`plugin:${pluginName}:${registration.id}:Service`);
        const componentSymbol = Symbol.for(`plugin:${pluginName}:${registration.id}:Component`);

        // 绑定 Data (toConstantValue - singleton)
        const dataInstance = new registration.dataClass(context, registration.config);
        container.bind(dataSymbol).toConstantValue(dataInstance);

        // 绑定 Service
        container.bind(serviceSymbol).to(registration.serviceClass);

        // 绑定 Component
        container.bind(componentSymbol).to(registration.componentClass);

        // 绑定事件监听器 - 使用类型转换确保类型安全
        if (registration.listeners?.stageDrag) {
            container.bind<StageDragListener>(TYPES.StageDragListener)
                .to(registration.componentClass as never);
        }
        if (registration.listeners?.mouseMove) {
            container.bind<MouseMoveListener>(TYPES.MouseMoveListener)
                .to(registration.componentClass as never);
        }
        if (registration.listeners?.resize) {
            container.bind<ResizeListener>(TYPES.ResizeListener)
                .to(registration.componentClass as never);
        }

        // 注册到 Component 和 Lifecycle 集合 - 使用类型转换
        bindComponent(container, registration.componentClass as never);
        bindLifecycle(container, registration.componentClass as never);
    }

    /**
     * 拓扑排序 + 循环依赖检测
     * Topological sort with circular dependency detection (Kahn's algorithm)
     */
    private topologicalSort(plugins: ChronosPlugin[]): ChronosPlugin[] {
        const pluginMap = new Map<string, ChronosPlugin>();
        const inDegree = new Map<string, number>();
        const graph = new Map<string, string[]>();

        // 初始化
        for (const plugin of plugins) {
            pluginMap.set(plugin.name, plugin);
            inDegree.set(plugin.name, 0);
            graph.set(plugin.name, []);
        }

        // 构建图
        for (const plugin of plugins) {
            if (plugin.dependencies) {
                for (const dep of plugin.dependencies) {
                    if (!pluginMap.has(dep)) {
                        throw new Error(
                            `插件 "${plugin.name}" 依赖 "${dep}"，但该依赖未提供 / ` +
                            `Plugin "${plugin.name}" depends on "${dep}" which is not provided`
                        );
                    }
                    const edges = graph.get(dep);
                    if (edges) {
                        edges.push(plugin.name);
                    }
                    inDegree.set(plugin.name, (inDegree.get(plugin.name) ?? 0) + 1);
                }
            }
        }

        // Kahn's algorithm
        const queue: string[] = [];
        const result: ChronosPlugin[] = [];

        // 找出所有入度为 0 的节点
        for (const [name, degree] of inDegree) {
            if (degree === 0) {
                queue.push(name);
            }
        }

        while (queue.length > 0) {
            const name = queue.shift();
            if (!name) {
                continue;
            }
            const plugin = pluginMap.get(name);
            if (plugin) {
                result.push(plugin);
            }

            for (const dependent of graph.get(name) ?? []) {
                const newDegree = (inDegree.get(dependent) ?? 1) - 1;
                inDegree.set(dependent, newDegree);
                if (newDegree === 0) {
                    queue.push(dependent);
                }
            }
        }

        // 检测循环依赖
        if (result.length !== plugins.length) {
            const remaining = plugins
                .filter(p => !result.includes(p))
                .map(p => p.name)
                .join(', ');
            throw new Error(
                `检测到循环依赖，涉及插件: ${remaining} / ` +
                `Circular dependency detected involving plugins: ${remaining}`
            );
        }

        return result;
    }
}
