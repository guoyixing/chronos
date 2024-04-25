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
import {NodeDetailConfig} from "./config/node-detail.inversifty";
import {ScaleConfig} from "./config/scale.inversify";
import {DataType} from "./config/data.type";
import {Context} from "./core/context/context";
import {TYPES} from "./config/inversify.config";
import {NodeReviseConfig} from "./config/node-revise.inversify";
import {CallbackConfig} from "./config/callback.inversify";
import {Callback} from "./core/event/callback/callback";
import {LaneReviseConfig} from "./config/lane-revise.inversify";
import {LaneDisplayConfig} from "./config/lane-display.inversifty";
import {JumpTimelineConfig} from "./config/timeline-jump.inversify";
import {HolidayConfig} from "./config/holiday.inversify";
import {WatermarkConfig} from "./config/watermark.inversify";


export class Chronos {

    chronosContainer = new Container()

    callback: Callback

    constructor(rootHtml: HTMLDivElement, data: DataType) {
        if (!rootHtml) {
            throw Error("div 还没有被渲染")
        }
        rootHtml.style.overflow = 'hidden'

        this.chronosContainer = new Container()
        //TODO 感觉这里写的不对
        //上下文
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
