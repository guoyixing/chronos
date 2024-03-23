import {Container} from "inversify";
import {bindComponent, bindLifecycle, TYPES} from "./inversify.config";
import {ChronosLaneGroupComponent} from "../component/lane/group/group.lane.component";
import {ChronosLaneGroupService} from "../component/lane/group/service.group.lane.component";
import {ChronosLaneGroupData} from "../component/lane/group/data.group.lane.component";
import {StageDragListener} from "../core/event/event";
import {Context} from "../core/context/context";
import {ChronosLaneEntryData} from "../component/lane/entry/data.entry.lane.component";
import {ToolbarPlugRegister} from "../component/toolbar/plug.toolbar.component";

/**
 * 泳道配置
 */
export class LaneConfig {
    constructor(chronosContainer: Container, divElement: HTMLDivElement) {

        const context = chronosContainer.get<Context>(TYPES.Context);

        const entry = [
            new ChronosLaneEntryData(context, '1', '泳道1', 3),
            new ChronosLaneEntryData(context, '2', '泳道2', 3),
            new ChronosLaneEntryData(context, '3', '泳道3', 3),
            new ChronosLaneEntryData(context, '4', '泳道4', 3),
            new ChronosLaneEntryData(context, '5', '泳道5', 3),
            new ChronosLaneEntryData(context, '6', '泳道6', 3),
            new ChronosLaneEntryData(context, '7', '泳道7', 3),
            new ChronosLaneEntryData(context, '8', '泳道8', 3),
        ]


        const data = new ChronosLaneGroupData(
            context,
            entry,
            40,
            60,
            {x: 40, y: 60}
        )

        chronosContainer.bind<ChronosLaneGroupData>(TYPES.ChronosLaneGroupData).toConstantValue(data);
        chronosContainer.bind<ChronosLaneGroupService>(TYPES.ChronosLaneGroupService).to(ChronosLaneGroupService);
        chronosContainer.bind<ChronosLaneGroupComponent>(TYPES.ChronosLaneGroupComponent).to(ChronosLaneGroupComponent);

        chronosContainer.bind<StageDragListener>(TYPES.StageDragListener).to(ChronosLaneGroupComponent);
        chronosContainer.bind<ToolbarPlugRegister>(TYPES.ToolbarPlugRegister).to(ChronosLaneGroupComponent);

        bindComponent(chronosContainer, ChronosLaneGroupComponent)
        bindLifecycle(chronosContainer, ChronosLaneGroupComponent)
    }
}
