import {Container} from "inversify";
import {DataType} from "./data.type";
import {bindComponent, bindLifecycle, TYPES} from "./inversify.config";
import {Context} from "../core/context/context";
import {StageDragListener} from "../core/event/event";
import {ChronosLaneReviseData} from "../component/revise/lane/lane-revise.data";
import {ChronosLaneReviseService} from "../component/revise/lane/lane-revise.service";
import {ChronosLaneReviseComponent} from "../component/revise/lane/lane-revise.component";

/**
 * 泳道修订窗配置
 */
export class LaneReviseConfig {
    constructor(chronosContainer: Container, divElement: HTMLDivElement, data: DataType) {
        const revise = data.laneRevise;

        chronosContainer.bind<ChronosLaneReviseData>(TYPES.ChronosLaneReviseData).toConstantValue(
            new ChronosLaneReviseData(chronosContainer.get<Context>(TYPES.Context), revise)
        );
        chronosContainer.bind<ChronosLaneReviseService>(TYPES.ChronosLaneReviseService).to(ChronosLaneReviseService);
        chronosContainer.bind<ChronosLaneReviseComponent>(TYPES.ChronosLaneReviseComponent).to(ChronosLaneReviseComponent);

        chronosContainer.bind<StageDragListener>(TYPES.StageDragListener).to(ChronosLaneReviseComponent);

        bindComponent(chronosContainer, ChronosLaneReviseComponent)
        bindLifecycle(chronosContainer, ChronosLaneReviseComponent)
    }
}
