import {Container} from "inversify";
import {Context} from "../core/context/context";
import {bindComponent, bindLifecycle, TYPES} from "./inversify.config";
import {StageDragListener} from "../core/event/event";
import {ChronosScaleData} from "../component/scale/data.scale.component";
import {ChronosScaleService} from "../component/scale/serivice.scale.component";
import {ChronosScaleComponent} from "../component/scale/scale.component";
import {ChronosWindowComponent} from "../component/window/window.component";
import {DataType} from "./data.type";

/**
 * 比例尺配置
 */
export class ScaleConfig {
    constructor(chronosContainer: Container, divElement: HTMLDivElement, data: DataType) {
        const scale = data.scale;


        chronosContainer.bind<ChronosScaleData>(TYPES.ChronosScaleData).toConstantValue(
            new ChronosScaleData(chronosContainer.get<Context>(TYPES.Context), scale));
        chronosContainer.bind<ChronosScaleService>(TYPES.ChronosScaleService).to(ChronosScaleService);
        chronosContainer.bind<ChronosScaleComponent>(TYPES.ChronosScaleComponent).to(ChronosScaleComponent);

        chronosContainer.bind<StageDragListener>(TYPES.StageDragListener).to(ChronosScaleComponent);

        bindComponent(chronosContainer, ChronosScaleComponent)
        bindLifecycle(chronosContainer, ChronosScaleComponent)
    }
}