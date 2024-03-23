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


export class Chronos {

    constructor(rootHtml: HTMLDivElement, data: {}) {
        if (!rootHtml) {
            throw Error("div 还没有被渲染")
        }
        rootHtml.style.overflow = 'hidden'

        const chronosContainer = new Container()
        //TODO 感觉这里写的不对
        new ContextConfig(chronosContainer, rootHtml)
        new WindowConfig(chronosContainer, rootHtml)
        new GridConfig(chronosContainer, rootHtml)
        new LaneConfig(chronosContainer, rootHtml)
        new ToolbarConfig(chronosContainer, rootHtml)
        new TimelineConfig(chronosContainer, rootHtml)
        new NodeBarConfig(chronosContainer, rootHtml)
        new NodeConfig(chronosContainer, rootHtml)

        //生命周期管理器
        const lifecycleManager = new LifecycleManager(chronosContainer);
        lifecycleManager.init()
        lifecycleManager.start()
        lifecycleManager.destroy()

        //事件监听
        new EventManager(chronosContainer)
    }

}
