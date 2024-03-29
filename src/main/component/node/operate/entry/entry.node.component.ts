import {BaseComponent} from "../../../component";
import {ChronosNodeEntryData} from "./data.entry.node.component";
import {ChronosNodeEntryService} from "./service.entry.node.component";
import {EventPublisher} from "../../../../core/event/event";

/**
 * 节点条目-组件
 */
export class ChronosNodeEntryComponent extends BaseComponent<ChronosNodeEntryData, ChronosNodeEntryService> {
    /**
     * 组件名称
     */
    name = () => "node-entry"

    constructor(data: ChronosNodeEntryData,
                service: ChronosNodeEntryService) {
        super(data, service);
    }

}
