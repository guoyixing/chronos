import {Container} from "inversify";
import {DataType} from "./data.type";
import {Context} from "../core/context/context";
import {bindComponent, bindLifecycle, TYPES} from "./inversify.config";
import {StageDragListener} from "../core/event/event";
import {ToolbarPlugRegister} from "../component/toolbar/toolbar-plug.component";
import {ChronosJumpTimelineData} from "../component/timeline/jump/timeline-jump.data";
import {ChronosJumpTimelineService} from "../component/timeline/jump/timeline-jump.service";
import {ChronosJumpTimelineComponent} from "../component/timeline/jump/timeline-jump.component";

export class JumpTimelineConfig {
    constructor(chronosContainer: Container, divElement: HTMLDivElement, data: DataType) {

        const jumpTimeline = data.jumpTimeline;
        const context = chronosContainer.get<Context>(TYPES.Context);


        chronosContainer.bind<ChronosJumpTimelineData>(TYPES.ChronosJumpTimelineData).toConstantValue(
            new ChronosJumpTimelineData(context, jumpTimeline));
        chronosContainer.bind<ChronosJumpTimelineService>(TYPES.ChronosJumpTimelineService).to(ChronosJumpTimelineService);
        chronosContainer.bind<ChronosJumpTimelineComponent>(TYPES.ChronosJumpTimelineComponent).to(ChronosJumpTimelineComponent);

        chronosContainer.bind<StageDragListener>(TYPES.StageDragListener).to(ChronosJumpTimelineComponent);
        chronosContainer.bind<ToolbarPlugRegister>(TYPES.ToolbarPlugRegister).to(ChronosJumpTimelineComponent);

        bindComponent(chronosContainer, ChronosJumpTimelineComponent)
        bindLifecycle(chronosContainer, ChronosJumpTimelineComponent)
    }
}
