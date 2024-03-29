import {BaseComponent} from "../../component";
import {ChronosLaneEntryData} from "./data.entry.lane.component";
import {ChronosLaneEntryService} from "./service.entry.lane.component";
import {EventPublisher} from "../../../core/event/event";

/**
 * 泳道条目组件
 */
export class ChronosLaneEntryComponent extends BaseComponent<ChronosLaneEntryData, ChronosLaneEntryService> {
    /**
     * 组件名称
     */
    name = () => "lane-entry"

    constructor(data: ChronosLaneEntryData,
                service: ChronosLaneEntryService) {
        super(data, service);
    }
}