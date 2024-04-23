import {ComponentData} from "../../data.component";
import {Context} from "../../../core/context/context";
import Konva from "konva";
import {ShadowConfigType, ShadowType} from "../../../common/type/shadow.type";
import {ButtonLaneConfigType, ButtonLaneType} from "../../../common/type/button.type";

/**
 * 泳道条目-组件数据
 */
export class ChronosLaneEntryData extends ComponentData {

    /**
     * 图形
     */
    graphics: Konva.Group | undefined


    /**
     * 泳道线
     */
    laneLineGraphics: Konva.Group | undefined

    /**
     * 泳道id
     */
    id: string

    /**
     * 泳道名称
     */
    name: string

    /**
     * 泳道行数
     */
    rowNum: number

    /**
     * 泳道行高度
     */
    height: number = 0

    /**
     * 渲染起始坐标
     */
    startCoordinate: { x: number, y: number } = {x: 0, y: 0}

    /**
     * 索引
     * 当前泳道在泳道组中的索引
     */
    index: number = 0

    /**
     * 泳道行
     * 可以存放节点的行对应的y坐标
     * 均为单数行
     */
    row: number[] = []

    /**
     * 隐藏泳道左侧
     */
    hideLeft: boolean = false

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
     * 泳道边框宽度
     */
    border: number

    /**
     * 泳道文字颜色
     */
    textColor: string

    /**
     * 泳道文字大小
     */
    fontSize: number

    /**
     * 泳道文字字体
     */
    fontFamily: string

    /**
     * 泳道文字左边距
     */
    textLeftMargin: number

    /**
     * 泳道文字上边距
     */
    textTopMargin: number

    /**
     * 泳道文字下边距
     */
    textBottomMargin: number

    /**
     * 圆角
     */
    radius: number[] | number

    /**
     * 阴影
     */
    shadow: ShadowType

    /**
     * 按钮参数
     */
    button: ButtonLaneType

    /**
     * 隐藏
     */
    hide: boolean = false

    /**
     * 扩展字段
     */
    extendField: {}


    constructor(context: Context, data: ChronosLaneEntryDataType) {
        super(context);
        this.id = data.id;
        this.name = data.name;
        this.rowNum = data.rowNum ?? 1;
        this.leftBackgroundColor = data.leftBackgroundColor ?? "#ECECF4";
        this.hoverLeftBackgroundColor = data.hoverLeftBackgroundColor ?? "#E0DFFF";
        this.borderColor = data.borderColor ?? "#E0DFFF";
        this.border = data.border ?? 1.5;
        this.textColor = data.textColor ?? "#4F4F54";
        this.fontSize = data.fontSize ?? 14;
        this.fontFamily = data.fontFamily ?? "Calibri";
        this.textLeftMargin = data.textLeftMargin ?? 10;
        this.textTopMargin = data.textTopMargin ?? 10;
        this.textBottomMargin = data.textBottomMargin ?? 10;
        this.radius = data.radius ?? [0, 5, 5, 0];
        this.hide = data.hide ?? false;
        this.extendField = data.extendField ?? {};
        this.shadow = {
            color: data.shadow?.color ?? 'black',
            blur: data.shadow?.blur ?? 10,
            offset: {
                x: data.shadow?.offset?.x ?? 0,
                y: data.shadow?.offset?.y ?? -5
            },
            opacity: data.shadow?.opacity ?? 0.2
        }
        this.button = {
            stroke: {
                length: data.button?.stroke?.length ?? 10,
                width: data.button?.stroke?.width ?? 2,
                color: data.button?.stroke?.color ?? "#FFF",
                margin: {
                    left: data.button?.stroke?.margin?.left ?? 4,
                    bottom: data.button?.stroke?.margin?.bottom ?? 20
                }
            },
            background: {
                height: data.button?.background?.height ?? 15,
                width: data.button?.background?.width ?? 15,
                color: data.button?.background?.color ?? "#D0CEEE",
                hoverColor: data.button?.background?.hoverColor ?? "#359EE8",
                stroke: data.button?.background?.stroke ?? 0,
                strokeColor: data.button?.background?.strokeColor ?? "#D0CEEE",
                radius: data.button?.background?.radius ?? 3
            },
            text: {
                color: data.button?.text?.color ?? "#fff",
                fontSize: data.button?.text?.fontSize ?? 12,
                fontFamily: data.button?.text?.fontFamily ?? "Calibri"
            }
        }
    }
}

/**
 * 泳道条目-组件数据类型
 */
export type ChronosLaneEntryDataType = {
    id: string
    name: string
    rowNum?: number
    leftBackgroundColor?: string
    hoverLeftBackgroundColor?: string
    borderColor?: string
    border?: number
    textColor?: string
    fontSize?: number
    fontFamily?: string
    textLeftMargin?: number
    textTopMargin?: number
    textBottomMargin?: number
    radius?: number[] | number
    hide?: boolean
    shadow?: ShadowConfigType
    button?: ButtonLaneConfigType
    extendField?: {}
}
