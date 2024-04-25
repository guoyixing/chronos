import {ComponentData} from "../../../data.component";
import {ChronosNodeEntryData, ChronosNodeEntryDataType} from "../entry/data.entry.node.component";
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
    moveRangeColor: string

    /**
     * 移动范围的边框颜色
     */
    moveRangeBorderColor: string

    /**
     * 移动范围的边框大小
     */
    moveRangeBorder: number

    /**
     * 进度是否隐藏
     */
    hideProgress: boolean


    constructor(context: Context, data?: ChronosNodeGroupDataType) {
        super(context);
        data?.entry?.forEach((entry) => {
            this.originalNodeEntryData.push(new ChronosNodeEntryData(context, entry))
        })
        this.moveRangeColor = data?.moveRangeColor ?? 'rgba(0,255,0,0.3)'
        this.moveRangeBorderColor = data?.moveRangeBorderColor ?? 'rgba(0,0,0,0)'
        this.moveRangeBorder = data?.moveRangeBorder ?? 0
        this.hideProgress = data?.hideProgress ?? false
    }
}

export type ChronosNodeGroupDataType = {
    entry?: ChronosNodeEntryDataType[]
    moveRangeColor?: string
    moveRangeBorderColor?: string
    moveRangeBorder?: number
    hideProgress?: boolean
}