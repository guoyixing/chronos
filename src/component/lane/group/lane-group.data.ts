import {ComponentData} from "../../component-data.interface";
import {injectable} from "inversify";
import {ChronosLaneEntryComponent} from "../entry/lane-entry.component";
import {Context} from "../../../core/context/context";
import {ChronosLaneEntryData, ChronosLaneEntryDataType} from "../entry/lane-entry.data";
import {ShadowConfigType, ShadowType} from "../../../core/common/type/shadow.type";
import Konva from "konva";

/**
 * 泳道组-组件数据
 */
@injectable()
export class ChronosLaneGroupData extends ComponentData {

    // ===== 运行时属性 =====

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
     * 泳道左侧宽度
     */
    laneLeftWidth: number

    /**
     * 渲染起始坐标
     */
    startOffSet: { x: number, y: number }

    // ===== 业务属性 =====

    /**
     * 泳道条目
     */
    entry: ChronosLaneEntryDataType[]

    // ===== 样式属性 =====

    /**
     * 元素行高
     */
    rowHeight: number

    /**
     * 泳道左侧最小宽度
     */
    minLeftWidth: number

    /**
     * 泳道左侧最大宽度
     */
    maxLeftWidth: number

    /**
     * 泳道线颜色
     */
    lineColor: string

    /**
     * 泳道线宽度
     */
    lineSize: number

    /**
     * 底部边距
     */
    bottomMargin: number

    /**
     * 分隔线颜色
     */
    dividerColor: string

    /**
     * 背景颜色
     */
    backgroundColor: string

    /**
     * 圆角
     */
    radius: number[] | number

    /**
     * 阴影
     */
    shadow: ShadowType

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


    constructor(context: Context, data?: ChronosLaneGroupDataType) {
        super(context);
        data?.entry?.forEach((entry) => {
            this.originalLaneEntryData.push(new ChronosLaneEntryData(context, entry));
        })
        this.entry = data?.entry ?? [];
        this.rowHeight = data?.rowHeight ?? 40;
        this.laneLeftWidth = data?.laneLeftWidth ?? 60;
        this.startOffSet = data?.startOffSet ?? {x: 0, y: 60};
        this.minLeftWidth = data?.minLeftWidth ?? 50;
        this.maxLeftWidth = data?.maxLeftWidth ?? 200;
        this.lineColor = data?.lineColor ?? "#E0DFFF";
        this.lineSize = data?.lineSize ?? 1.5;
        this.bottomMargin = data?.bottomMargin ?? 0;
        this.dividerColor = data?.dividerColor ?? "#E0DFFF";
        this.backgroundColor = data?.backgroundColor ?? "#FFFFFF";
        this.radius = data?.radius ?? 0;
        this.leftBackgroundColor = data?.leftBackgroundColor ?? "#ECECF4";
        this.hoverLeftBackgroundColor = data?.hoverLeftBackgroundColor ?? "#E0DFFF";
        this.borderColor = data?.borderColor ?? "#E0DFFF";
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
 * 泳道组-业务数据类型
 * Business properties: domain logic, identifiers, relationships
 */
export type ChronosLaneGroupBusinessType = {
    entry?: ChronosLaneEntryDataType[]
}

/**
 * 泳道组-样式数据类型
 * Style properties: colors, fonts, margins, visual appearance
 */
export type ChronosLaneGroupStyleType = {
    rowHeight?: number
    minLeftWidth?: number
    maxLeftWidth?: number
    lineColor?: string
    lineSize?: number
    bottomMargin?: number
    dividerColor?: string
    backgroundColor?: string
    leftBackgroundColor?: string
    hoverLeftBackgroundColor?: string
    borderColor?: string
    radius?: number[] | number
    shadow?: ShadowConfigType
    startOffSet?: { x: number, y: number }
    laneLeftWidth?: number
}

/**
 * 泳道组-组件数据类型 (向后兼容)
 * Combined type for backward compatibility
 */
export type ChronosLaneGroupDataType = ChronosLaneGroupBusinessType & ChronosLaneGroupStyleType
