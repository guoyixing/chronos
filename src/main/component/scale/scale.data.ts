import {ComponentData} from "../component-data.interface";
import {injectable} from "inversify";
import {Context} from "../../core/context/context";
import Konva from "konva";
import {ChronosWindowComponent} from "../window/window.component";
import {TYPES} from "../../config/inversify.config";
import {ButtonConfigType, ButtonType} from "../../core/common/type/button.type";

/**
 * 比例尺-组件数据
 */
@injectable()
export class ChronosScaleData extends ComponentData {

    /**
     * 图形
     */
    graphics: Konva.Group | undefined

    /**
     * 渲染起始坐标
     */
    startOffSet: { x: number, y: number }

    /**
     * 比例尺百分比
     */
    scaleX: number

    /**
     * 比例尺跳跃值
     */
    scaleJump: number

    /**
     * 宽度
     */
    width: number

    /**
     * 高度
     */
    height: number

    /**
     * 背景颜色
     */
    backgroundColor: string

    /**
     * 背景圆角
     */
    radius: number

    /**
     * 背景边框大小
     */
    border: number

    /**
     * 背景边框颜色
     */
    borderColor: string

    /**
     * 字体颜色
     */
    textColor: string

    /**
     * 字体大小
     */
    fontSize: number

    /**
     * 按钮
     */
    button: ButtonType

    constructor(context: Context, data?: ChronosScaleDataType) {
        super(context);
        this.scaleX = data?.scaleX ?? 1
        this.scaleJump = data?.scaleJump ?? 0.1
        this.width = data?.width ?? 160
        this.height = data?.height ?? 40
        this.backgroundColor = data?.backgroundColor ?? "#ECECF4"
        this.radius = data?.radius ?? 10
        this.border = data?.border ?? 1
        this.borderColor = data?.borderColor ?? "#ECECF4"
        this.textColor = data?.textColor ?? "#4F4F54"
        this.fontSize = data?.fontSize ?? 16
        this.button = {
            stroke: {
                length: data?.button?.stroke?.length ?? 10,
                width: data?.button?.stroke?.width ?? 2,
                color: data?.button?.stroke?.color ?? "#4F4F54",
                hoverColor: data?.button?.stroke?.hoverColor ?? "#359EE8",
                disabledColor: data?.button?.stroke?.disabledColor ?? "#ECECF4",
                margin: {
                    left: data?.button?.stroke?.margin?.left ?? 15,
                    right: data?.button?.stroke?.margin?.right ?? 15
                }
            },
            background: {
                color: data?.button?.background?.color ?? "#ECECF4",
                hoverColor: data?.button?.background?.hoverColor ?? "#E0DFFF",
            }
        }
        const window = context.ioc.get<ChronosWindowComponent>(TYPES.ChronosWindowComponent);
        if (data?.startOffSetPct) {
            this.startOffSet = {
                x: window.data?.width * data?.startOffSetPct.xPct - this.width / 2,
                y: window.data?.height * data?.startOffSetPct.yPct - this.height / 2
            }
        } else {
            this.startOffSet = {
                x: window.data?.width * 0.91 - this.width / 2,
                y: window.data?.height * 0.95 - this.height / 2
            }
        }
    }
}

/**
 * 比例尺-组件数据类型
 */
export type ChronosScaleDataType = {
    /**
     * 百分比定位
     */
    startOffSetPct?: { xPct: number, yPct: number }
    scaleX?: number
    scaleJump?: number
    width?: number
    height?: number
    backgroundColor?: string
    radius?: number
    border?: number
    borderColor?: string
    textColor?: string
    fontSize?: number
    button?: ButtonConfigType
}
