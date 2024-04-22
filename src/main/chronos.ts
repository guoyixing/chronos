import "reflect-metadata";
import {Container} from "inversify";
import {WindowConfig} from "./config/window.inversify.config";
import {ContextConfig} from "./config/context.inversify.config";
import {LifecycleManager} from "./core/lifecycle/manager.lifecycle";
import {EventManager} from "./core/event/manager.event";
import {GridConfig} from "./config/grid.inversify.config";
import {LaneConfig} from "./config/lane.inversify.config";
import {ToolbarConfig} from "./config/toolbar.inversify.config";
import {TimelineConfig} from "./config/timeline.inversify.config";
import {NodeBarConfig} from "./config/bar.node.inversify.config";
import {NodeConfig} from "./config/node.inversify.config";
import {NodeTransformerConfig} from "./config/transformer.node.inversify.config";
import {NodeDetailConfig} from "./config/detail.node.inversifty.config";
import {ScaleConfig} from "./config/scale.inversify.config";
import {DataType} from "./config/data.type";
import {Context} from "./core/context/context";
import {TYPES} from "./config/inversify.config";
import {NodeReviseConfig} from "./config/node.revise.inversify.config";
import {CallbackConfig} from "./config/callback.inversify.config";
import {Callback} from "./core/event/callback/callback";
import {LaneReviseConfig} from "./config/lane.revise.inversify.config";
import {LaneDisplayConfig} from "./config/display.lane.inversifty.config";
import {JumpTimelineConfig} from "./config/jump.timeline.inversify.config";
import {HolidayConfig} from "./config/holiday.inversify.config";


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
