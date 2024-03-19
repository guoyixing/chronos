import {Container} from "inversify";
import "reflect-metadata";

import {DrawContext} from "../core/context/draw.context";
import {Context} from "../core/context/context";
import {TYPES} from "./inversify.config";


export class ContextConfig {
    constructor(chronosContainer: Container, divElement: HTMLDivElement) {
        const drawContext = new DrawContext({rootElement: divElement, draggable: true});
        const context = new Context({ioc: chronosContainer, drawContext: drawContext})

        chronosContainer.bind<DrawContext>(TYPES.DrawContext).toConstantValue(drawContext);
        chronosContainer.bind<Context>(TYPES.Context).toConstantValue(context);
    }
}