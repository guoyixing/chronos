import "reflect-metadata";
import {Container} from "inversify";
import {WindowConfig} from "./config/window.inversify";
import {ContextConfig} from "./config/context.inversify";
import {LifecycleManager} from "./core/lifecycle/manager.lifecycle";
import {EventManager} from "./core/event/manager.event";
import {GridConfig} from "./config/grid.inversify";
import {LaneConfig} from "./config/lane.inversify";
import {ToolbarConfig} from "./config/toolbar.inversify";
import {TimelineConfig} from "./config/timeline.inversify";
import {NodeBarConfig} from "./config/node-bar.inversify";
import {NodeConfig} from "./config/node.inversify";
import {NodeTransformerConfig} from "./config/node-transformer.inversify";
import {NodeDetailConfig} from "./config/node-detail.inversify";
import {ScaleConfig} from "./config/scale.inversify";
import {DataType, ChronosInputType, ChronosSeparatedDataType, ChronosOptions} from "./config/data.type";
import {PluginManager} from "./plugin/manager.plugin";
import {deepMerge} from "./core/common/utils/merge.utils";
import {Context} from "./core/context/context";
import {TYPES} from "./config/inversify.config";
import {NodeReviseConfig} from "./config/node-revise.inversify";
import {CallbackConfig} from "./config/callback.inversify";
import {Callback} from "./core/event/callback/callback";
import {LaneReviseConfig} from "./config/lane-revise.inversify";
import {LaneDisplayConfig} from "./config/lane-display.inversify";
import {JumpTimelineConfig} from "./config/timeline-jump.inversify";
import {TimelineControlConfig} from "./config/timeline-control.inversify";
import {HolidayConfig} from "./config/holiday.inversify";
import {WatermarkConfig} from "./config/watermark.inversify";
import {FullscreenConfig} from "./config/fullscreen.inversify";
import {HistoryManager} from "./history/manager.history";
import {IHistoryManager, HistoryCommand, HistoryChangeEvent} from "./history/history.interface";
import {NodeCommandFactory} from "./history/commands/node.command";
import {LaneCommandFactory} from "./history/commands/lane.command";

/**
 * 判断输入是否为分离格式
 * Check if input is separated format with business and style keys
 */
function isSeparatedDataType(input: ChronosInputType): input is ChronosSeparatedDataType {
    return 'business' in input && 'style' in input;
}

/**
 * 将分离格式合并为DataType
 * Merge separated format into unified DataType
 * Business data wins for conflicting keys
 */
function mergeToDataType(separated: ChronosSeparatedDataType): DataType {
    const { business, style } = separated;
    // Style as base, business overwrites - deepMerge(target, source) where source wins
    return deepMerge(
        style as Record<string, unknown>,
        business as Record<string, unknown>
    ) as DataType;
}


export class Chronos {

    chronosContainer = new Container()

    callback: Callback

    /**
     * 生命周期管理器
     * Lifecycle manager for component cleanup
     */
    private lifecycleManager: LifecycleManager

    /**
     * 插件管理器
     * Plugin manager for plugin lifecycle hooks
     */
    private pluginManager?: PluginManager

    /**
     * 历史管理器
     * History manager for undo/redo operations
     */
    private _historyManager?: HistoryManager

    /**
     * 创建Chronos实例
     * 支持两种输入格式:
     * 1. 旧API: new Chronos(div, { timeline: {...}, lane: {...} })
     * 2. 新API: new Chronos(div, { business: {...}, style: {...} })
     * 
     * @param rootHtml 容器DOM元素
     * @param input 配置数据 (DataType 或 ChronosSeparatedDataType)
     * @param options 可选配置（插件等）
     */
    constructor(rootHtml: HTMLDivElement, input: ChronosInputType, options?: ChronosOptions) {
        if (!rootHtml) {
            throw Error("div 还没有被渲染")
        }
        rootHtml.style.overflow = 'hidden'

        // 检测输入格式并合并为统一的DataType
        const data: DataType = isSeparatedDataType(input)
            ? mergeToDataType(input)
            : input;

        this.chronosContainer = new Container()
        // 上下文
        new ContextConfig(this.chronosContainer, rootHtml, data)

        // 初始化插件管理器（如果有插件）
        if (options?.plugins?.length) {
            this.pluginManager = new PluginManager();
            this.pluginManager.installAll(options.plugins);
            const context = this.chronosContainer.get<Context>(TYPES.Context);
            this.pluginManager.setContext(this.chronosContainer, context);
            this.pluginManager.invokeHook('onInstall');
        }

        //回调
        this.callback = new CallbackConfig(this.chronosContainer).callback
        //窗口外框
        new WindowConfig(this.chronosContainer, rootHtml, data)
        //网格
        new GridConfig(this.chronosContainer, rootHtml, data)
        //水印
        new WatermarkConfig(this.chronosContainer, rootHtml, data)
        //泳道
        new LaneConfig(this.chronosContainer, rootHtml, data)
        //假期
        new HolidayConfig(this.chronosContainer, rootHtml, data)
        //工具栏
        new ToolbarConfig(this.chronosContainer, rootHtml, data)
        //比例尺
        new ScaleConfig(this.chronosContainer, rootHtml, data)
        //节点变形器
        new NodeTransformerConfig(this.chronosContainer, rootHtml, data)
        //时间轴
        new TimelineConfig(this.chronosContainer, rootHtml, data)
        //时间轴控制面板
        new TimelineControlConfig(this.chronosContainer, rootHtml, data)
        //时间轴跳转
        new JumpTimelineConfig(this.chronosContainer, rootHtml, data)
        //节点导航栏
        new NodeBarConfig(this.chronosContainer, rootHtml, data)
        //节点
        new NodeConfig(this.chronosContainer, rootHtml, data)
        //节点详情
        new NodeDetailConfig(this.chronosContainer, rootHtml, data)
        //节点修订
        new NodeReviseConfig(this.chronosContainer, rootHtml, data)
        //泳道修订
        new LaneReviseConfig(this.chronosContainer, rootHtml, data)
        //泳道显示控制器
        new LaneDisplayConfig(this.chronosContainer, rootHtml, data)
        //全屏
        new FullscreenConfig(this.chronosContainer, rootHtml, data)

        //事件监听
        new EventManager(this.chronosContainer)

        // 插件钩子：初始化前
        this.pluginManager?.invokeHook('onBeforeInit');

        //生命周期管理器
        this.lifecycleManager = new LifecycleManager(this.chronosContainer);
        this.lifecycleManager.init()

        // 插件钩子：初始化后
        this.pluginManager?.invokeHook('onAfterInit');

        this.lifecycleManager.start()

        // 插件钩子：启动后
        this.pluginManager?.invokeHook('onAfterStart');

        // 初始化历史管理器
        const context = this.chronosContainer.get<Context>(TYPES.Context);
        this._historyManager = new HistoryManager(context, options?.history);
        
        // 注册命令工厂（用于历史记录导入）
        this._historyManager.registerCommandFactory(new NodeCommandFactory());
        this._historyManager.registerCommandFactory(new LaneCommandFactory());
        
        // 将历史管理器绑定到上下文，供组件使用
        context.historyManager = this._historyManager;
    }

/**
     * 销毁
     */
    destroy() {
        // 销毁历史管理器
        this._historyManager?.destroy();
        // 插件钩子：销毁
        this.pluginManager?.invokeHook('onDestroy');
        this.lifecycleManager.destroy();
        const context = this.chronosContainer.get<Context>(TYPES.Context);
        context.drawContext.stage.destroy();
    }

    // ========== 历史管理器 API ==========

    /**
     * 获取历史管理器
     * Get the history manager instance
     */
    get historyManager(): IHistoryManager | undefined {
        return this._historyManager;
    }

    /**
     * 撤销上一个操作
     * Undo the last operation
     * @returns 是否成功撤销
     */
    undo(): boolean {
        return this._historyManager?.undo() ?? false;
    }

    /**
     * 重做上一个撤销的操作
     * Redo the last undone operation
     * @returns 是否成功重做
     */
    redo(): boolean {
        return this._historyManager?.redo() ?? false;
    }

    /**
     * 是否可以撤销
     * Check if undo is available
     */
    canUndo(): boolean {
        return this._historyManager?.canUndo() ?? false;
    }

    /**
     * 是否可以重做
     * Check if redo is available
     */
    canRedo(): boolean {
        return this._historyManager?.canRedo() ?? false;
    }

    /**
     * 导出历史记录
     * Export history to JSON string
     */
    exportHistory(): string {
        return this._historyManager?.exportHistory() ?? '{"version":"1.0.0","undoStack":[],"redoStack":[]}';
    }

    /**
     * 导入历史记录
     * Import history from JSON string
     */
    importHistory(json: string): void {
        this._historyManager?.importHistory(json);
    }

    /**
     * 清空历史记录
     * Clear all history
     */
    clearHistory(): void {
        this._historyManager?.clear();
    }

    /**
     * 监听历史变更
     * Listen for history changes
     */
    onHistoryChange(callback: (event: HistoryChangeEvent) => void): void {
        this._historyManager?.onChange(callback);
    }

    /**
     * 移除历史变更监听
     * Remove history change listener
     */
    offHistoryChange(callback: (event: HistoryChangeEvent) => void): void {
        this._historyManager?.offChange(callback);
    }

    /**
     * 执行命令（用于外部创建命令）
     * Execute a command (for externally created commands)
     */
    executeCommand(command: HistoryCommand): void {
        this._historyManager?.execute(command);
    }

}
