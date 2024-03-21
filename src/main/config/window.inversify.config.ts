import {Container} from "inversify";
import "reflect-metadata";

import {ChronosWindowData} from "../component/window/data.window.component";
import {ChronosWindowService} from "../component/window/service.window.component";
import {bindComponent, bindLifecycle, TYPES} from "./inversify.config";
import {Context} from "../core/context/context";
import {ChronosWindowComponent} from "../component/window/window.component";
import {StageDragListener} from "../core/event/event";

/**
 * 窗口配置
 */
export class WindowConfig {

    constructor(chronosContainer: Container, divElement: HTMLDivElement) {
        const size = divElement.getBoundingClientRect();
        const data= new ChronosWindowData(
            chronosContainer.get<Context>(TYPES.Context),
            size.width,
            size.height,
            1,
    )

        chronosContainer.bind<ChronosWindowData>(TYPES.ChronosWindowData).toConstantValue(data);
        chronosContainer.bind<ChronosWindowService>(TYPES.ChronosWindowService).to(ChronosWindowService);
        chronosContainer.bind<ChronosWindowComponent>(TYPES.ChronosWindowComponent).to(ChronosWindowComponent);

        chronosContainer.bind<StageDragListener>(TYPES.StageDragListener).to(ChronosWindowComponent);

        bindComponent(chronosContainer, ChronosWindowComponent)
        bindLifecycle(chronosContainer, ChronosWindowComponent)
    }
}
