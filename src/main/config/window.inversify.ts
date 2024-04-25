import {Container} from "inversify";
import "reflect-metadata";

import {ChronosWindowData, ChronosWindowDataType} from "../component/window/window.data";
import {ChronosWindowService} from "../component/window/window.service";
import {bindComponent, bindLifecycle, TYPES} from "./inversify.config";
import {Context} from "../core/context/context";
import {ChronosWindowComponent} from "../component/window/window.component";
import {StageDragListener} from "../core/event/event";
import {DataType} from "./data.type";

/**
 * 窗口配置
 */
export class WindowConfig {

    constructor(chronosContainer: Container, divElement: HTMLDivElement, data: DataType) {
        const size = divElement.getBoundingClientRect();
        const chronosWindowData = data.window ?? {} as ChronosWindowDataType;
        chronosWindowData.width = size.width;
        chronosWindowData.height = size.height;

        chronosContainer.bind<ChronosWindowData>(TYPES.ChronosWindowData).toConstantValue(new ChronosWindowData(
            chronosContainer.get<Context>(TYPES.Context),
            chronosWindowData
        ));
        chronosContainer.bind<ChronosWindowService>(TYPES.ChronosWindowService).to(ChronosWindowService);
        chronosContainer.bind<ChronosWindowComponent>(TYPES.ChronosWindowComponent).to(ChronosWindowComponent);

        chronosContainer.bind<StageDragListener>(TYPES.StageDragListener).to(ChronosWindowComponent);

        bindComponent(chronosContainer, ChronosWindowComponent)
        bindLifecycle(chronosContainer, ChronosWindowComponent)
    }
}
