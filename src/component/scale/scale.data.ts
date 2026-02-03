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

    // ===== 运行时属性 =====

    /**
     * 图形
     */
    graphics: Konva.Group | undefined

    /**
     * 渲染起始坐标
     */
    startOffSet: { x: number, y: number }

    // ===== 业务属性 =====

    /**
     * 比例尺百分比
     */
    scaleX: number

    /**
     * 比例尺跳跃值
     */
    scaleJump: number

    // ===== 样式属性 =====

    /**
     * 定位百分比（用于 resize 时重新计算位置）
     */
    startOffSetPct: { xPct: number, yPct: number }

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
        // 保存定位百分比
        this.startOffSetPct = data?.startOffSetPct ?? { xPct: 0.91, yPct: 0.95 }
        const window = context.ioc.get<ChronosWindowComponent>(TYPES.ChronosWindowComponent);
        this.startOffSet = {
            x: window.data?.width * this.startOffSetPct.xPct - this.width / 2,
            y: window.data?.height * this.startOffSetPct.yPct - this.height / 2
        }
    }

    /**
     * 根据新的窗口尺寸重新计算位置
     */
    recalculatePosition(windowWidth: number, windowHeight: number): void {
        this.startOffSet = {
            x: windowWidth * this.startOffSetPct.xPct - this.width / 2,
            y: windowHeight * this.startOffSetPct.yPct - this.height / 2
        }
    }
}

/**
 * 比例尺-业务数据类型
 * Business properties: zoom levels
 */
export type ChronosScaleBusinessType = {
    scaleX?: number
    scaleJump?: number
}

/**
 * 比例尺-样式数据类型
 * Style properties: positioning, appearance, and button styling
 */
export type ChronosScaleStyleType = {
    /**
     * 百分比定位
     */
    startOffSetPct?: { xPct: number, yPct: number }
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

/**
 * 比例尺-组件数据类型 (向后兼容)
 * Combined type for backward compatibility
 */
export type ChronosScaleDataType = ChronosScaleBusinessType & ChronosScaleStyleType
