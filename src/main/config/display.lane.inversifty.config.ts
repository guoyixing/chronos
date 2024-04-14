import {Container} from "inversify";
import {DataType} from "./data.type";
import {Context} from "../core/context/context";
import {bindComponent, bindLifecycle, TYPES} from "./inversify.config";
import {StageDragListener} from "../core/event/event";
import {ToolbarPlugRegister} from "../component/toolbar/plug.toolbar.component";
import {ChronosLaneDisplayData} from "../component/lane/display/data.display.lane.component";
import {ChronosLaneDisplayService} from "../component/lane/display/service.display.lane.component";
import {ChronosLaneDisplayComponent} from "../component/lane/display/display.lane.component";

export class LaneDisplayConfig {
    constructor(chronosContainer: Container, divElement: HTMLDivElement, data: DataType) {
        const display = data.laneDisplay;

        const displayData: ChronosLaneDisplayData = new ChronosLaneDisplayData(chronosContainer.get<Context>(TYPES.Context), display);

        chronosContainer.bind<ChronosLaneDisplayData>(TYPES.ChronosLaneDisplayData).toConstantValue(displayData);
        chronosContainer.bind<ChronosLaneDisplayService>(TYPES.ChronosLaneDisplayService).to(ChronosLaneDisplayService);
        chronosContainer.bind<ChronosLaneDisplayComponent>(TYPES.ChronosLaneDisplayComponent).to(ChronosLaneDisplayComponent);

        chronosContainer.bind<StageDragListener>(TYPES.StageDragListener).to(ChronosLaneDisplayComponent);
        chronosContainer.bind<ToolbarPlugRegister>(TYPES.ToolbarPlugRegister).to(ChronosLaneDisplayComponent);

        bindComponent(chronosContainer, ChronosLaneDisplayComponent)
        bindLifecycle(chronosContainer, ChronosLaneDisplayComponent)
    }
}
