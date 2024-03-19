import "reflect-metadata";
import {Container} from "inversify";
import {TYPES} from "./config/inversify.config";
import {WindowConfig} from "./config/window.inversify.config";
import {ContextConfig} from "./config/context.inversify.config";
import {Component} from "./component/component";


export class Chronos {

    constructor(rootHtml: HTMLDivElement,data:{}) {
        if (!rootHtml) {
            throw Error("div 还没有被渲染")
        }
        rootHtml.style.overflow = 'hidden'

        const chronosContainer = new Container();
        //TODO 感觉这里写的不对
        new ContextConfig(chronosContainer, rootHtml)
        new WindowConfig(chronosContainer, rootHtml);

        //TODO 移动到生命周期中
        const window = chronosContainer.get<Component<any,any>>(TYPES.ChronosComponent);
        window.service.draw()

        console.log(1)
    }

}
