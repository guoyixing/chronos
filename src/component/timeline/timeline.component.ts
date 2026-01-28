import {Lifecycle} from "../../core/lifecycle/lifecycle";
import {StageDragListener} from "../../core/event/event";
import {BaseComponent} from "../component.interface";
import {ChronosTimelineService} from "./timeline.service";
import {ChronosTimelineData} from "./timeline.data";
import {inject, injectable} from "inversify";
import {TYPES} from "../../config/inversify.config";

/**
 * 时间轴组件
 */
@injectable()
export class ChronosTimelineComponent extends BaseComponent<ChronosTimelineData, ChronosTimelineService>
    implements StageDragListener, Lifecycle {

    /**
     * 组件名称
     */
    name = () => "timeline"

    constructor(@inject(TYPES.ChronosTimelineData) data: ChronosTimelineData,
                @inject(TYPES.ChronosTimelineService) service: ChronosTimelineService) {
        super(data, service);
    }

    init() {
        super.init();
        this.service.listenScale()
    }

    stageDragListen(): void {
        this.data.layer?.destroyChildren()
        this.service.draw()
    }
}
