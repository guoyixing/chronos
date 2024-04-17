import {ComponentData} from "../../data.component";
import {injectable} from "inversify";
import {ChronosLaneEntryComponent} from "../entry/entry.lane.component";
import {Context} from "../../../core/context/context";
import {ChronosLaneEntryData, ChronosLaneEntryDataType} from "../entry/data.entry.lane.component";
import {ShadowType} from "../../../common/type/shadow.type";
import Konva from "konva";

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
     * 图形
     */
    graphics: Konva.Group | undefined

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

    /**
     * 泳道左侧背景颜色
     */
    leftBackgroundColor: string

    /**
     * 泳道左侧悬浮背景颜色
     */
    hoverLeftBackgroundColor: string

    /**
     * 泳道边框颜色
     */
    borderColor: string

    /**
     * 圆角
     */
    radius: number[] | number

    /**
     * 阴影
     */
    shadow: ShadowType


    constructor(context: Context, data?: ChronosLaneGroupDataType) {
        super(context);
        data?.entry?.forEach((entry) => {
            this.originalLaneEntryData.push(new ChronosLaneEntryData(context, entry));
        })
        this.rowHeight = data?.rowHeight ?? 40;
        this.laneLeftWidth = data?.laneLeftWidth ?? 60;
        this.startOffSet = data?.startOffSet??{x: 0, y: 60};
        this.leftBackgroundColor = data?.leftBackgroundColor ?? "#ECECF4";
        this.hoverLeftBackgroundColor = data?.hoverLeftBackgroundColor ?? "#E0DFFF";
        this.borderColor = data?.borderColor ?? "#E0DFFF";
        this.radius = data?.radius ?? 0;
        this.shadow = {
            color: data?.shadow?.color ?? 'black',
            blur: data?.shadow?.blur ?? 0,
            offset: {
                x: data?.shadow?.offset?.x ?? 0,
                y: data?.shadow?.offset?.y ?? 0
            },
            opacity: data?.shadow?.opacity ?? 0.2
        }
    }
}

/**
 * 泳道组-组件数据类型
 */
export type ChronosLaneGroupDataType = {
    startOffSet?: { x: number, y: number }
    entry?: ChronosLaneEntryDataType[]
    rowHeight?: number
    laneLeftWidth?: number
    leftBackgroundColor?: string
    hoverLeftBackgroundColor?: string
    borderColor?: string
    radius?: number[] | number
    shadow?: ShadowType
}
