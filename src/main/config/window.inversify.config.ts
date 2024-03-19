import {Container} from "inversify";
import "reflect-metadata";

import {ChronosWindowData} from "../component/window/data.window.component";
import {ChronosWindowService} from "../component/window/service.window.component";
import {TYPES} from "./inversify.config";
import {Context} from "../core/context/context";
import {ChronosWindowComponent} from "../component/window/window.component";
import {Component} from "../component/component";


export class WindowConfig {

    constructor(chronosContainer: Container, divElement: HTMLDivElement) {
        const size = divElement.getBoundingClientRect();
        const data: ChronosWindowData = {
            width: size.width,
            height: size.height,
            border: 1,
            context: chronosContainer.get<Context>(TYPES.Context),
            layer: chronosContainer.get<Context>(TYPES.Context).drawContext.applyLayer("window")
        }
        chronosContainer.bind<ChronosWindowData>(TYPES.ChronosWindowData).toConstantValue(data);
        chronosContainer.bind<ChronosWindowService>(TYPES.ChronosWindowService).to(ChronosWindowService);

        chronosContainer.bind<Component<ChronosWindowData,ChronosWindowService>>(TYPES.ChronosComponent).to(ChronosWindowComponent);
        chronosContainer.bind<ChronosWindowComponent>(TYPES.ChronosWindowComponent).to(ChronosWindowComponent);

    }
}