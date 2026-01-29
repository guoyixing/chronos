import {Container} from "inversify";
import {DataType} from "./data.type";
import {Context} from "../core/context/context";
import {bindComponent, bindLifecycle, TYPES} from "./inversify.config";
import {StageDragListener} from "../core/event/event";
import {ToolbarPlugRegister} from "../component/toolbar/toolbar-plug.component";
import {ChronosTimelineControlData} from "../component/timeline/control/timeline-control.data";
import {ChronosTimelineControlService} from "../component/timeline/control/timeline-control.service";
import {ChronosTimelineControlComponent} from "../component/timeline/control/timeline-control.component";

export class TimelineControlConfig {
    constructor(chronosContainer: Container, divElement: HTMLDivElement, data: DataType) {
        const context = chronosContainer.get<Context>(TYPES.Context);
        const controlData = new ChronosTimelineControlData(context, data.timelineControl);
        
        chronosContainer.bind<ChronosTimelineControlData>(TYPES.ChronosTimelineControlData)
            .toConstantValue(controlData);
        chronosContainer.bind<ChronosTimelineControlService>(TYPES.ChronosTimelineControlService)
            .to(ChronosTimelineControlService);
        chronosContainer.bind<ChronosTimelineControlComponent>(TYPES.ChronosTimelineControlComponent)
            .to(ChronosTimelineControlComponent);
        
        chronosContainer.bind<StageDragListener>(TYPES.StageDragListener)
            .to(ChronosTimelineControlComponent);
        chronosContainer.bind<ToolbarPlugRegister>(TYPES.ToolbarPlugRegister)
            .to(ChronosTimelineControlComponent);
        
        bindComponent(chronosContainer, ChronosTimelineControlComponent);
        bindLifecycle(chronosContainer, ChronosTimelineControlComponent);
    }
}
