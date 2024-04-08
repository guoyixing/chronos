import {ComponentData} from "../../../data.component";
import {injectable} from "inversify";
import {Context} from "../../../../core/context/context";
import Konva from "konva";
import {NodeShape} from "../../board/shape/NodeShape";
import {ChronosWindowComponent} from "../../../window/window.component";
import {TYPES} from "../../../../config/inversify.config";
import {ShadowConfigType, ShadowType} from "../../../../common/type/shadow.type";

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
    startOffSet: { x: number, y: number }


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
    height: number

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
     * 圆角
     */
    radius: number

    /**
     * 分线颜色
     */
    middleLineColor: string

    /**
     * 分线大小
     */
    middleLineWidth: number

    /**
     * 阴影
     */
    shadow: ShadowType

    constructor(context: Context, data: ChronosNodeBarDataType) {
        super(context);
        this.width = data.width ?? 200;
        this.height = data.height ?? 400;
        this.hide = data.hide ?? false;
        this.backgroundColor = data.backgroundColor ?? 'white';
        this.borderColor = data.borderColor ?? '#EBEBEB';
        this.radius = data.radius ?? 10;
        this.border = data.border ?? 1;
        this.middleLineColor = data.middleLineColor ?? '#F1F0FF';
        this.middleLineWidth = data.middleLineWidth ?? 1;
        this.shadow = {
            color: data.shadow?.color ?? 'black',
            blur: data.shadow?.blur ?? 10,
            offset: {
                x: data.shadow?.offset?.x ?? 0,
                y: data.shadow?.offset?.y ?? 0
            },
            opacity: data.shadow?.opacity ?? 0.2
        }
        const window = context.ioc.get<ChronosWindowComponent>(TYPES.ChronosWindowComponent);
        if (data.startOffSetPct) {
            this.startOffSet = {
                x: window.data.width * data.startOffSetPct.xPct,
                y: window.data.height * data.startOffSetPct.yPct
            }
        } else {
            this.startOffSet = {
                x: window.data.width * 0.8,
                y: window.data.height * 0.2
            }
        }
    }
}

/**
 * 节点导航窗-组件数据类型
 */
export type ChronosNodeBarDataType = {
    startOffSetPct: { xPct: number, yPct: number }
    width?: number
    height?: number
    hide?: boolean
    radius?: number
    backgroundColor?: string
    borderColor?: string
    border?: number
    middleLineColor?: string
    middleLineWidth?: number
    shadow?: ShadowConfigType
}
