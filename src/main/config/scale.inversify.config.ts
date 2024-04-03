import {Container} from "inversify";
import {Context} from "../core/context/context";
import {bindComponent, bindLifecycle, TYPES} from "./inversify.config";
import {StageDragListener} from "../core/event/event";
import {ChronosScaleData} from "../component/scale/data.scale.component";
import {ChronosScaleService} from "../component/scale/serivice.scale.component";
import {ChronosScaleComponent} from "../component/scale/scale.component";
import {ChronosWindowComponent} from "../component/window/window.component";

/**
 * 比例尺配置
 */
export class ScaleConfig {
    constructor(chronosContainer: Container, divElement: HTMLDivElement) {
        const window = chronosContainer.get<ChronosWindowComponent>(TYPES.ChronosWindowComponent);

        const data: ChronosScaleData = new ChronosScaleData(
            chronosContainer.get<Context>(TYPES.Context),
            {y: window.data.height - 30, x: 110}
        );

        chronosContainer.bind<ChronosScaleData>(TYPES.ChronosScaleData).toConstantValue(data);
        chronosContainer.bind<ChronosScaleService>(TYPES.ChronosScaleService).to(ChronosScaleService);
        chronosContainer.bind<ChronosScaleComponent>(TYPES.ChronosScaleComponent).to(ChronosScaleComponent);

        chronosContainer.bind<StageDragListener>(TYPES.StageDragListener).to(ChronosScaleComponent);

        bindComponent(chronosContainer, ChronosScaleComponent)
        bindLifecycle(chronosContainer, ChronosScaleComponent)
    }
}