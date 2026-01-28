import {BaseComponent} from "../../../component.interface";
import {ChronosNodeEntryData} from "./node-entry.data";
import {ChronosNodeEntryService} from "./node-entry.service";

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
