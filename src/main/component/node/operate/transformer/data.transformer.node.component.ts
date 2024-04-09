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
    leftControlPoint: Konva.Circle | undefined

    /**
     * 右控制点
     */
    rightControlPoint: Konva.Circle | undefined

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
     * 阴影
     */
    shadow: ShadowType

    constructor(context: Context, data: ChronosNodeTransformerDataType) {
        super(context);
        this.pointRadius = data.pointRadius ?? 5
        this.pointColor = data.pointColor ?? "#FFF"
        this.pointBorder = data.pointBorder ?? 2
        this.pointBorderColor = data.pointBorderColor ?? "#359EE8"
        this.shadow = {
            color: data.shadow?.color ?? '#359EE8',
            blur: data.shadow?.blur ?? 5,
            offset: {
                x: data.shadow?.offset?.x ?? 0,
                y: data.shadow?.offset?.y ?? 0
            },
            opacity: data.shadow?.opacity ?? 0.7
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
}