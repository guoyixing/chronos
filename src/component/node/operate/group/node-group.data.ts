import {ComponentData} from "../../../component-data.interface";
import {ChronosNodeEntryData, ChronosNodeEntryDataType} from "../entry/node-entry.data";
import {ChronosNodeEntryComponent} from "../entry/node-entry.component";
import {Context} from "../../../../core/context/context";
import {injectable} from "inversify";

/**
 * 节点组-组件数据
 */
@injectable()
export class ChronosNodeGroupData extends ComponentData {
    // ===== 运行时属性 =====

    /**
     * 节点组
     */
    nodeGroup: Array<ChronosNodeEntryComponent> = []

    /**
     * 原始节点条目数据
     */
    originalNodeEntryData: Array<ChronosNodeEntryData> = []

    // ===== 业务属性 =====

    /**
     * 进度是否隐藏
     */
    hideProgress: boolean

    // ===== 样式属性 =====

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
     * 进度
     */
    progress: {
        offset: { x: number, y: number }
        background: {
            height: number
            //左右边距
            lrMargin: number
            color: string
            stroke: number
            strokeColor: string
            radius: number | number[]
        },
        text: {
            color: string
            fontSize: number
            fontFamily: string
        }
    }


    constructor(context: Context, data?: ChronosNodeGroupDataType) {
        super(context);
        data?.entry?.forEach((entry) => {
            this.originalNodeEntryData.push(new ChronosNodeEntryData(context, entry))
        })
        this.moveRangeColor = data?.moveRangeColor ?? 'rgba(0,255,0,0.3)'
        this.moveRangeBorderColor = data?.moveRangeBorderColor ?? 'rgba(0,0,0,0)'
        this.moveRangeBorder = data?.moveRangeBorder ?? 0
        this.hideProgress = data?.hideProgress ?? false
        this.progress = {
            offset: data?.progress?.offset ?? {x: -5, y: -8},
            background: {
                height: data?.progress?.background?.height ?? 16,
                lrMargin: data?.progress?.background?.lrMargin ?? 5,
                color: data?.progress?.background?.color ?? '#359EE8',
                stroke: data?.progress?.background?.stroke ?? 0,
                strokeColor: data?.progress?.background?.strokeColor ?? '#359EE8',
                radius: data?.progress?.background?.radius ?? 10
            },
            text: {
                color: data?.progress?.text?.color ?? '#FFF',
                fontSize: data?.progress?.text?.fontSize ?? 10,
                fontFamily: data?.progress?.text?.fontFamily ?? 'Calibri'
            }
        }
    }
}

/**
 * 节点组-业务数据类型
 * Business properties: domain logic and node visibility settings
 */
export type ChronosNodeGroupBusinessType = {
    entry?: ChronosNodeEntryDataType[]
    hideProgress?: boolean
}

/**
 * 节点组-样式数据类型
 * Style properties: colors, spacing, and progress visual appearance
 */
export type ChronosNodeGroupStyleType = {
    moveRangeColor?: string
    moveRangeBorderColor?: string
    moveRangeBorder?: number
    progress?: {
        offset?: { x: number, y: number }
        background?: {
            height?: number
            lrMargin?: number
            color?: string
            stroke?: number
            strokeColor?: string
            radius?: number | number[]
        },
        text?: {
            color?: string
            fontSize?: number
            fontFamily?: string
        }
    }
}

/**
 * 节点组-组件数据类型 (向后兼容)
 * Combined type for backward compatibility
 */
export type ChronosNodeGroupDataType = ChronosNodeGroupBusinessType & ChronosNodeGroupStyleType
