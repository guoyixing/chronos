import {ComponentData} from "../../../data.component";
import {ChronosNodeEntryData} from "../entry/data.entry.node.component";
import {ChronosNodeEntryComponent} from "../entry/entry.node.component";
import {Context} from "../../../../core/context/context";
import {injectable} from "inversify";

/**
 * 节点组-组件数据
 */
@injectable()
export class ChronosNodeGroupData extends ComponentData {
    /**
     * 节点组
     */
    nodeGroup: Array<ChronosNodeEntryComponent> = []

    /**
     * 原始节点条目数据
     */
    originalNodeEntryData: Array<ChronosNodeEntryData> = []


    constructor(context: Context, originalNodeEntryData: Array<ChronosNodeEntryData>) {
        super(context);
        this.originalNodeEntryData = originalNodeEntryData;
    }
}
