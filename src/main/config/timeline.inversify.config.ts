import {Container} from "inversify";
import {Context} from "../core/context/context";
import {bindComponent, bindLifecycle, TYPES} from "./inversify.config";
import {ChronosTimelineData} from "../component/timeline/data.timeline.component";
import {ChronosTimelineComponent} from "../component/timeline/timeline.component";
import {StageDragListener} from "../core/event/event";
import {ChronosTimelineService} from "../component/timeline/service.timeline.component";

/**
 * 时间轴配置
 */
export class TimelineConfig {
    constructor(chronosContainer: Container, divElement: HTMLDivElement) {

        const context = chronosContainer.get<Context>(TYPES.Context);


        const data = new ChronosTimelineData(
            context,
            new Date("2023-12-01 00:00:00"),
            {x: 40, y: 1},
        )

        chronosContainer.bind<ChronosTimelineData>(TYPES.ChronosTimelineData).toConstantValue(data);
        chronosContainer.bind<ChronosTimelineService>(TYPES.ChronosTimelineService).to(ChronosTimelineService);
        chronosContainer.bind<ChronosTimelineComponent>(TYPES.ChronosTimelineComponent).to(ChronosTimelineComponent);

        chronosContainer.bind<StageDragListener>(TYPES.StageDragListener).to(ChronosTimelineComponent);

        bindComponent(chronosContainer, ChronosTimelineComponent)
        bindLifecycle(chronosContainer, ChronosTimelineComponent)
    }
}
