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
import {DataType, ChronosInputType, ChronosSeparatedDataType} from "./config/data.type";
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
     * 创建Chronos实例
     * 支持两种输入格式:
     * 1. 旧API: new Chronos(div, { timeline: {...}, lane: {...} })
     * 2. 新API: new Chronos(div, { business: {...}, style: {...} })
     * 
     * @param rootHtml 容器DOM元素
     * @param input 配置数据 (DataType 或 ChronosSeparatedDataType)
     */
    constructor(rootHtml: HTMLDivElement, input: ChronosInputType) {
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

        //生命周期管理器
        const lifecycleManager = new LifecycleManager(this.chronosContainer);
        lifecycleManager.init()
        lifecycleManager.start()
    }

    /**
     * 销毁
     */
    destroy() {
        const context = this.chronosContainer.get<Context>(TYPES.Context);
        context.drawContext.stage.destroy()
    }

}
