import { Context } from "../core/context/context";
import { ComponentData } from "../component/component-data.interface";
import { ComponentService } from "../component/component-service.interface";
import { Lifecycle } from "../core/lifecycle/lifecycle";

/**
 * 插件接口
 * Plugin interface with lifecycle hooks
 */
export interface ChronosPlugin {
	/** 插件名称 (必须唯一) */
	name: string;

	/** 插件版本 */
	version?: string;

	/** 依赖的其他插件名称 */
	dependencies?: string[];

	/**
	 * 安装钩子 - Context 创建后，组件绑定前调用
	 * Called after Context is created, before component bindings
	 */
	onInstall?(ctx: PluginContext): void;

	/**
	 * 初始化前钩子 - 所有组件 init() 调用前
	 * Called before lifecycle.init()
	 */
	onBeforeInit?(ctx: PluginContext): void;

	/**
	 * 初始化后钩子 - 所有组件 init() 调用后
	 * Called after lifecycle.init()
	 */
	onAfterInit?(ctx: PluginContext): void;

	/**
	 * 启动后钩子 - 所有组件 start() 调用后
	 * Called after lifecycle.start()
	 */
	onAfterStart?(ctx: PluginContext): void;

	/**
	 * 销毁钩子 - destroy() 时调用
	 * Called during destroy()
	 */
	onDestroy?(ctx: PluginContext): void;
}

/**
 * 插件上下文
 * Safe API for plugins to interact with Chronos
 */
export interface PluginContext {
	/** 只读 Context 访问 */
	readonly context: Context;

	/** 注册自定义组件 */
	registerComponent(registration: ComponentRegistration): void;

	/** 订阅事件 */
	on(event: symbol, handler: (data?: unknown) => void): void;

	/** 发布事件 */
	emit(event: symbol, data?: unknown): void;

	/** 获取其他插件 */
	getPlugin<T extends ChronosPlugin>(name: string): T | undefined;

	/** 日志输出 */
	log(level: "debug" | "info" | "warn" | "error", message: string): void;
}

/**
 * 组件注册配置
 * Configuration for registering plugin components
 */
export interface ComponentRegistration {
	/** 组件唯一标识 */
	id: string;

	/** Data 类构造函数 */
	dataClass: new (context: Context, config?: unknown) => ComponentData;

	/** Service 类构造函数 */
	serviceClass: new (...args: unknown[]) => ComponentService;

	/** Component 类构造函数 */
	componentClass: new (...args: unknown[]) => Lifecycle;

	/** 组件配置数据 */
	config?: unknown;

	/** 事件监听器配置 */
	listeners?: {
		stageDrag?: boolean;
		mouseMove?: boolean;
		resize?: boolean;
	};
}
