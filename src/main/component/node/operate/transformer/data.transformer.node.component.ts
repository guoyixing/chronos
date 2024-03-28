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
    pointRadius: number = 5

    /**
     * 控制点颜色
     */
    pointColor: string = "#ddd"

    /**
     * 控制点边框大小
     */
    pointBorder: number = 1

    /**
     * 控制点边框颜色
     */
    pointBorderColor: string = "black"

    constructor(context: Context) {
        super(context);
    }
}