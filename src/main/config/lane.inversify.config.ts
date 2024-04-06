import {Container} from "inversify";
import {bindComponent, bindLifecycle, TYPES} from "./inversify.config";
import {ChronosLaneGroupComponent} from "../component/lane/group/group.lane.component";
import {ChronosLaneGroupService} from "../component/lane/group/service.group.lane.component";
import {ChronosLaneGroupData} from "../component/lane/group/data.group.lane.component";
import {StageDragListener} from "../core/event/event";
import {Context} from "../core/context/context";
import {DataType} from "./data.type";

/**
 * 泳道配置
 */
export class LaneConfig {
    constructor(chronosContainer: Container, divElement: HTMLDivElement, data: DataType) {

        const context = chronosContainer.get<Context>(TYPES.Context);
        const lane = data.lane;

        chronosContainer.bind<ChronosLaneGroupData>(TYPES.ChronosLaneGroupData).toConstantValue(new ChronosLaneGroupData(context, lane));
        chronosContainer.bind<ChronosLaneGroupService>(TYPES.ChronosLaneGroupService).to(ChronosLaneGroupService);
        chronosContainer.bind<ChronosLaneGroupComponent>(TYPES.ChronosLaneGroupComponent).to(ChronosLaneGroupComponent);

        chronosContainer.bind<StageDragListener>(TYPES.StageDragListener).to(ChronosLaneGroupComponent);
        // chronosContainer.bind<ToolbarPlugRegister>(TYPES.ToolbarPlugRegister).to(ChronosLaneGroupComponent);

        bindComponent(chronosContainer, ChronosLaneGroupComponent)
        bindLifecycle(chronosContainer, ChronosLaneGroupComponent)
    }
}
