import {ComponentData} from "../../../data.component";
import {injectable} from "inversify";
import {Context} from "../../../../core/context/context";
import {ChronosNodeEntryComponent} from "../entry/entry.node.component";
import Konva from "konva";

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

    constructor(context: Context, data: ChronosNodeTransformerDataType) {
        super(context);
        this.pointRadius = data.pointRadius ?? 5
        this.pointColor = data.pointColor ?? "#ddd"
        this.pointBorder = data.pointBorder ?? 1
        this.pointBorderColor = data.pointBorderColor ?? "black"
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
}