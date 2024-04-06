import {ComponentData} from "../../data.component";
import {injectable} from "inversify";
import {ChronosLaneEntryComponent} from "../entry/entry.lane.component";
import {Context} from "../../../core/context/context";
import {ChronosLaneEntryData, ChronosLaneEntryDataType} from "../entry/data.entry.lane.component";

/**
 * 泳道组-组件数据
 */
@injectable()
export class ChronosLaneGroupData extends ComponentData {

    /**
     * 泳道组
     */
    laneGroup: Array<ChronosLaneEntryComponent> = []

    /**
     * 原始泳道条目数据
     */
    originalLaneEntryData: Array<ChronosLaneEntryData> = []

    /**
     * 高度
     */
    height: number = 0

    /**
     * 元素行高
     */
    rowHeight: number

    /**
     * 泳道左侧宽度
     */
    laneLeftWidth: number

    /**
     * 渲染起始坐标
     */
    startOffSet: { x: number, y: number }


    constructor(context: Context, data: ChronosLaneGroupDataType) {
        super(context);
        data.entry?.forEach((entry) => {
            this.originalLaneEntryData.push(new ChronosLaneEntryData(context, entry));
        })
        this.rowHeight = data.rowHeight ?? 40;
        this.laneLeftWidth = data.laneLeftWidth ?? 60;
        this.startOffSet = data.startOffSet;
    }
}

/**
 * 泳道组-组件数据类型
 */
export type ChronosLaneGroupDataType = {
    startOffSet: { x: number, y: number }
    entry?: ChronosLaneEntryDataType[]
    rowHeight?: number
    laneLeftWidth?: number
}
