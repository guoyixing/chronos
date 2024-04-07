import {ComponentData} from "../../../data.component";
import {injectable} from "inversify";
import {Context} from "../../../../core/context/context";
import Konva from "konva";
import {NodeShape} from "../../board/shape/NodeShape";

/**
 * 节点导航窗-组件数据
 */
@injectable()
export class ChronosNodeBarData extends ComponentData {

    /**
     * 图形
     */
    graphics: Konva.Group | undefined


    /**
     * 渲染起始坐标
     */
    startOffSet: { x: number, y: number } | undefined


    /**
     * 候选的变形节点
     */
    candidateTransformableNode: Map<String, new () => NodeShape> = new Map<string, new () => any>();

    /**
     * 候选的节点
     */
    candidateNode: Map<String, new () => NodeShape> = new Map<string, new () => any>();

    /**
     * 宽度
     */
    width: number

    /**
     * 高度
     */
    height: number | undefined

    /**
     * 是否隐藏
     */
    hide: boolean

    /**
     * 背景颜色
     */
    backgroundColor: string

    /**
     * 边框颜色
     */
    borderColor: string

    /**
     * 边框大小
     */
    border: number

    /**
     * 分线颜色
     */
    middleLineColor: string

    /**
     * 分线大小
     */
    middleLineWidth: number


    constructor(context: Context, data: ChronosNodeBarDataType) {
        super(context);
        this.width = data.width ?? 200;
        this.height = data.height ?? 200;
        this.hide = data.hide ?? true;
        this.backgroundColor = data.backgroundColor ?? 'white';
        this.borderColor = data.borderColor ?? 'black';
        this.border = data.border ?? 1;
        this.middleLineColor = data.middleLineColor ?? '#ddd';
        this.middleLineWidth = data.middleLineWidth ?? 1;
    }
}

/**
 * 节点导航窗-组件数据类型
 */
export type ChronosNodeBarDataType = {
    width?: number
    height?: number
    hide?: boolean
    backgroundColor?: string
    borderColor?: string
    border?: number
    middleLineColor?: string
    middleLineWidth?: number
}
