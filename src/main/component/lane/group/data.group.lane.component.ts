import {ComponentData} from "../../data.component";
import {injectable} from "inversify";
import {ChronosLaneEntryComponent} from "../entry/entry.lane.component";
import {Context} from "../../../core/context/context";
import {ChronosLaneEntryData} from "../entry/data.entry.lane.component";

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
     * 元素行高
     */
    rowHeight: number = 40

    /**
     * 泳道左侧宽度
     */
    laneLeftWidth: number = 80

    /**
     * 渲染起始坐标
     */
    startOffSet: { x: number, y: number }

    /**
     * 高度
     */
    height: number = 0


    constructor(context: Context, originalLaneEntryData: Array<ChronosLaneEntryData>,
                rowHeight: number, laneLeftWidth: number, startOffSet: {
            x: number;
            y: number
        }) {
        super(context);
        this.originalLaneEntryData = originalLaneEntryData;
        this.rowHeight = rowHeight;
        this.laneLeftWidth = laneLeftWidth;
        this.startOffSet = startOffSet;
    }
}