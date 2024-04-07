import {ComponentData} from "../data.component";
import {injectable} from "inversify";
import {Context} from "../../core/context/context";
import Konva from "konva";

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
    scaleX: number = 1

    /**
     * 比例尺跳跃值
     */
    scaleJump: number = 0.1

    /**
     * 宽度
     */
    width: number = 90

    /**
     * 高度
     */
    height: number = 20

    /**
     * 背景颜色
     */
    backgroundColor: string = "#f0f0f0"

    /**
     * 背景边框大小
     */
    border: number = 1

    /**
     * 背景边框颜色
     */
    borderColor: string = "black"

    /**
     * 按钮文字颜色
     */
    buttonTextColor: string = "black"

    /**
     * 按钮悬浮文字颜色
     */
    buttonHoverTextColor: string = "#359EE8"

    /**
     * 按钮文字大小
     */
    buttonFontSize: number = 25

    /**
     * 按钮字体
     */
    buttonFontFamily: string = "Calibre"

    /**
     * 按钮左边距
     */
    buttonLeftMargin: number = 5

    /**
     * 按钮右边距
     */
    buttonRightMargin: number = 5


    /**
     * 字体颜色
     */
    textColor: string = "black"

    /**
     * 字体大小
     */
    fontSize: number = 16


    constructor(context: Context, data: ChronosScaleDataType) {
        super(context);
        this.startOffSet = data.startOffSet ?? {x: 0, y: 0}
        this.scaleX = data.scaleX ?? 1
        this.scaleJump = data.scaleJump ?? 0.1
        this.width = data.width ?? 90
        this.height = data.height ?? 20
        this.backgroundColor = data.backgroundColor ?? "#f0f0f0"
        this.border = data.border ?? 1
        this.borderColor = data.borderColor ?? "black"
        this.buttonTextColor = data.buttonTextColor ?? "black"
        this.buttonHoverTextColor = data.buttonHoverTextColor ?? "#359EE8"
        this.buttonFontSize = data.buttonFontSize ?? 25
        this.buttonFontFamily = data.buttonFontFamily ?? "Calibre"
        this.buttonLeftMargin = data.buttonLeftMargin ?? 5
        this.buttonRightMargin = data.buttonRightMargin ?? 5
        this.textColor = data.textColor ?? "black"
        this.fontSize = data.fontSize ?? 16
    }
}

/**
 * 比例尺-组件数据类型
 */
export type ChronosScaleDataType = {
    startOffSet?: { x: number, y: number }
    scaleX?: number
    scaleJump?: number
    width?: number
    height?: number
    backgroundColor?: string
    border?: number
    borderColor?: string
    buttonTextColor?: string
    buttonHoverTextColor?: string
    buttonFontSize?: number
    buttonFontFamily?: string
    buttonLeftMargin?: number
    buttonRightMargin?: number
    textColor?: string
    fontSize?: number
}