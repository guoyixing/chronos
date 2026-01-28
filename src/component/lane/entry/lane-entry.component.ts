import {BaseComponent} from "../../component.interface";
import {ChronosLaneEntryData} from "./lane-entry.data";
import {ChronosLaneEntryService} from "./lane-entry.service";

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
