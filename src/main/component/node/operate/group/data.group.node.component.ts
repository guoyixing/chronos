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

    /**
     * 移动范围的颜色
     */
    moveRangeColor: string = 'rgba(0,255,0,0.3)'

    /**
     * 移动范围的边框颜色
     */
    moveRangeBorderColor: string = 'rgba(0,0,0,0)'

    /**
     * 移动范围的边框大小
     */
    moveRangeBorder: number = 0


    constructor(context: Context, originalNodeEntryData: Array<ChronosNodeEntryData>) {
        super(context);
        this.originalNodeEntryData = originalNodeEntryData;
    }
}
