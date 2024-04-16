import {Container} from "inversify";
import {Context} from "../core/context/context";
import {bindComponent, bindLifecycle, TYPES} from "./inversify.config";
import {ChronosTimelineData} from "../component/timeline/data.timeline.component";
import {ChronosTimelineComponent} from "../component/timeline/timeline.component";
import {StageDragListener} from "../core/event/event";
import {ChronosTimelineService} from "../component/timeline/service.timeline.component";
import {DataType} from "./data.type";
import {ToolbarPlugRegister} from "../component/toolbar/plug.toolbar.component";
import {ChronosNodeBarComponent} from "../component/node/operate/bar/bar.node.component";

/**
 * 时间轴配置
 */
export class TimelineConfig {
    constructor(chronosContainer: Container, divElement: HTMLDivElement, data: DataType) {

        const timeline = data.timeline;
        const context = chronosContainer.get<Context>(TYPES.Context);
        // new Date("2023-12-01 00:00:00"),
        // {x: 40, y: 1},


        chronosContainer.bind<ChronosTimelineData>(TYPES.ChronosTimelineData).toConstantValue(
            new ChronosTimelineData(context, timeline));
        chronosContainer.bind<ChronosTimelineService>(TYPES.ChronosTimelineService).to(ChronosTimelineService);
        chronosContainer.bind<ChronosTimelineComponent>(TYPES.ChronosTimelineComponent).to(ChronosTimelineComponent);

        chronosContainer.bind<StageDragListener>(TYPES.StageDragListener).to(ChronosTimelineComponent);

        bindComponent(chronosContainer, ChronosTimelineComponent)
        bindLifecycle(chronosContainer, ChronosTimelineComponent)
    }
}
