import {ComponentData} from "../../../data.component";
import {injectable} from "inversify";
import {Context} from "../../../../core/context/context";
import {ChronosNodeEntryComponent} from "../entry/entry.node.component";
import Konva from "konva";
import {ShadowConfigType, ShadowType} from "../../../../common/type/shadow.type";

/**
 * 节点变形器-组件数据
 */
@injectable()
export class ChronosNodeTransformerData extends ComponentData {
    /**
     * 绑定的节点
     */
    bindNodeId: string | undefined

    /**
     * 绑定的节点
     */
    bindNode: ChronosNodeEntryComponent | undefined

    /**
     * 左控制点
     */
    leftControlPoint: Konva.Group | undefined

    /**
     * 右控制点
     */
    rightControlPoint: Konva.Group | undefined

    /**
     * 控制点半径
     */
    pointRadius: number

    /**
     * 控制点颜色
     */
    pointColor: string

    /**
     * 控制点边框大小
     */
    pointBorder: number

    /**
     * 控制点边框颜色
     */
    pointBorderColor: string

    /**
     * 时间显示器
     */
    time: {
        background: {
            color: string
            opacity: number
            width: number,
            height: number,
            borderColor: string,
            border: number,
            radius: number | number[],
        },
        text: {
            fontSize: number
            fontFamily: string
            fill: string,
        },
        offset: {
            x: number
            y: number
        }
    }

    /**
     * 阴影
     */
    shadow: ShadowType

    constructor(context: Context, data?: ChronosNodeTransformerDataType) {
        super(context);
        this.pointRadius = data?.pointRadius ?? 5
        this.pointColor = data?.pointColor ?? "#FFF"
        this.pointBorder = data?.pointBorder ?? 2
        this.pointBorderColor = data?.pointBorderColor ?? "#359EE8"
        this.time = {
            background: {
                color: data?.time?.background?.color ?? '#359EE8',
                opacity: data?.time?.background?.opacity ?? 1,
                radius: data?.time?.background?.radius ?? 5,
                width: data?.time?.background?.width ?? 150,
                height: data?.time?.background?.height ?? 20,
                borderColor: data?.time?.background?.borderColor ?? '#EBEBEB',
                border: data?.time?.background?.border ?? 1,
            },
            text: {
                fontSize: data?.time?.text?.fontSize ?? 14,
                fontFamily: data?.time?.text?.fontFamily ?? 'Calibri',
                fill: data?.time?.text?.fill ?? '#FFF'
            },
            offset: {
                x: data?.time?.offset?.x ?? 0,
                y: data?.time?.offset?.y ?? 10
            }
        }
        this.shadow = {
            color: data?.shadow?.color ?? '#359EE8',
            blur: data?.shadow?.blur ?? 5,
            offset: {
                x: data?.shadow?.offset?.x ?? 0,
                y: data?.shadow?.offset?.y ?? 0
            },
            opacity: data?.shadow?.opacity ?? 0.7
        }
    }
}

/**
 * 节点变形器-组件数据类型
 */
export type ChronosNodeTransformerDataType = {
    pointRadius?: number
    pointColor?: string
    pointBorder?: number
    pointBorderColor?: string
    shadow?: ShadowConfigType
    time?: {
        background?: {
            color?: string
            opacity?: number
            radius?: number
            width?: number,
            height?: number,
            borderColor?: string,
            border?: number,
        },
        text?: {
            fontSize?: number
            fontFamily?: string
            fill?: string
        },
        offset?: {
            x?: number
            y?: number
        }
    }
}