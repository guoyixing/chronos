import {BaseComponent} from "../../component";
import {ChronosLaneEntryData} from "./data.entry.lane.component";
import {ChronosLaneEntryService} from "./service.entry.lane.component";
import {EventPublisher} from "../../../core/event/event";

/**
 * 泳道条目组件
 */
export class ChronosLaneEntryComponent extends BaseComponent<ChronosLaneEntryData, ChronosLaneEntryService>
    implements EventPublisher {
    /**
     * 组件名称
     */
    name = () => "lane-entry"

    id = this.data.id

    constructor(data: ChronosLaneEntryData,
                service: ChronosLaneEntryService) {
        super(data, service);
    }

    /**
     * 事件绑定
     * @param event 事件名称
     * @param callback 回调
     */
    on(event: symbol, callback: (data?: any) => void): void {
        const eventManager = this.data.context.eventManager;
        eventManager?.listen(this, event, callback)
    }

    /**
     * 发布事件
     * @param event 事件名称
     */
    publish(event: symbol): void {
        const eventManager = this.data.context.eventManager;
        eventManager?.publish(this, event)
    }

}