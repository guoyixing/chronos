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


export class Chronos {

    constructor(rootHtml: HTMLDivElement, data: {}) {
        if (!rootHtml) {
            throw Error("div 还没有被渲染")
        }
        rootHtml.style.overflow = 'hidden'

        const chronosContainer = new Container()
        //TODO 感觉这里写的不对
        //上下文
        new ContextConfig(chronosContainer, rootHtml)
        //窗口外框
        new WindowConfig(chronosContainer, rootHtml)
        //网格
        new GridConfig(chronosContainer, rootHtml)
        //泳道
        new LaneConfig(chronosContainer, rootHtml)
        //工具栏
        new ToolbarConfig(chronosContainer, rootHtml)
        //比例尺
        new ScaleConfig(chronosContainer, rootHtml)
        //节点变形器
        new NodeTransformerConfig(chronosContainer, rootHtml)
        //时间轴
        new TimelineConfig(chronosContainer, rootHtml)
        //节点导航栏
        new NodeBarConfig(chronosContainer, rootHtml)
        //节点
        new NodeConfig(chronosContainer, rootHtml)
        //节点详情
        new NodeDetailConfig(chronosContainer, rootHtml)

        //事件监听
        new EventManager(chronosContainer)

        //生命周期管理器
        const lifecycleManager = new LifecycleManager(chronosContainer);
        lifecycleManager.init()
        lifecycleManager.start()
        lifecycleManager.destroy()


    }

}
