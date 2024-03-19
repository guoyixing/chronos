import "reflect-metadata";
import {Container} from "inversify";
import {TYPES} from "./config/inversify.config";
import {WindowConfig} from "./config/window.inversify.config";
import {ContextConfig} from "./config/context.inversify.config";
import {Component} from "./component/component";
import {LifecycleManager} from "./core/lifecycle/manager.lifecycle";
import {EventManager} from "./core/event/manager.event";
import {GridConfig} from "./config/grid.inversify.config";


export class Chronos {

    constructor(rootHtml: HTMLDivElement,data:{}) {
        if (!rootHtml) {
            throw Error("div 还没有被渲染")
        }
        rootHtml.style.overflow = 'hidden'

        const chronosContainer = new Container()
        //TODO 感觉这里写的不对
        new ContextConfig(chronosContainer, rootHtml)
        new WindowConfig(chronosContainer, rootHtml)
        new GridConfig(chronosContainer, rootHtml)

        //生命周期管理器
        const lifecycleManager = new LifecycleManager(chronosContainer);
        lifecycleManager.init()
        lifecycleManager.start()
        lifecycleManager.destroy()

        //事件监听
        new EventManager(chronosContainer)
    }

}
