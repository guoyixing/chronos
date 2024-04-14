import {injectable} from "inversify";
import {ComponentData} from "../../data.component";
import {ShadowConfigType, ShadowType} from "../../../common/type/shadow.type";
import Konva from "konva";
import {Context} from "../../../core/context/context";
import {ChronosWindowComponent} from "../../window/window.component";
import {TYPES} from "../../../config/inversify.config";

/**
 * 泳道显示控制器-组件数据
 */
@injectable()
export class ChronosLaneDisplayData extends ComponentData {
    /**
     * 图形
     */
    graphics: Konva.Group | undefined


    /**
     * 渲染起始坐标
     */
    startOffSet: { x: number, y: number }

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
     * 阴影
     */
    shadow: ShadowType

    /**
     * 文字
     */
    text: {
        fontSize: number,
        fontFamily: string,
        color: string,
        hoverColor: string,
        marginBottom: number,
        offSetY: number
    }

    /**
     * 边距
     */
    margin: number


    constructor(context: Context, data: ChronosLaneDisplayDataType) {
        super(context);
        this.width = data.width ?? 200;
        this.height = data.height ?? 400;
        this.hide = data.hide ?? false;
        this.backgroundColor = data.backgroundColor ?? 'white';
        this.borderColor = data.borderColor ?? '#EBEBEB';
        this.radius = data.radius ?? 10;
        this.border = data.border ?? 1;
        this.margin = data.margin ?? 30;
        this.shadow = {
            color: data.shadow?.color ?? 'black',
            blur: data.shadow?.blur ?? 10,
            offset: {
                x: data.shadow?.offset?.x ?? 0,
                y: data.shadow?.offset?.y ?? 0
            },
            opacity: data.shadow?.opacity ?? 0.2
        }
        this.text = {
            fontSize: data.text?.fontSize ?? 18,
            fontFamily: data.text?.fontFamily ?? 'Calibri',
            color: data.text?.color ?? '#4F4F54',
            hoverColor: data.text?.hoverColor ?? '#359EE8',
            marginBottom: data.text?.marginBottom ?? 10,
            offSetY: data.text?.offSetY ?? 0
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

export type ChronosLaneDisplayDataType = {
    startOffSetPct?: { xPct: number, yPct: number }
    width?: number
    height?: number
    hide?: boolean
    backgroundColor?: string
    borderColor?: string
    border?: number
    margin?: number
    radius?: number
    shadow?: ShadowConfigType
    text?: {
        fontSize?: number,
        fontFamily?: string,
        color?: string,
        hoverColor?: string,
        marginBottom?: number,
        offSetY?: number
    }
}
