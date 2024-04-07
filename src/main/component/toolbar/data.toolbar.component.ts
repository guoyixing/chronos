import {ComponentData} from "../data.component";
import {Context} from "../../core/context/context";
import {ChronosToolPlug} from "./plug.toolbar.component";
import {injectable} from "inversify";
import Konva from "konva";

/**
 * 工具栏-组件数据
 */
@injectable()
export class ChronosToolbarData extends ComponentData {

    /**
     * 图形
     */
    graphics: Konva.Group | undefined

    /**
     * 工具组
     */
    toolPlugs: Array<ChronosToolPlug> = []

    /**
     * 渲染起始坐标
     */
    startOffSet: { x: number, y: number }

    /**
     * 宽度
     */
    width: number

    /**
     * 背景颜色
     */
    backgroundColor: string

    /**
     * 背景边框宽度
     */
    backgroundBorder: number

    /**
     * 背景边框颜色
     */
    backgroundBorderColor: string

    /**
     * 文字大小
     */
    fontSize: number

    /**
     * 文字颜色
     */
    textColor: string

    /**
     * 鼠标悬浮文字颜色
     */
    hoverTextColor: string

    /**
     * 文字走向
     */
    textDirection: string

    /**
     * 间隔距离
     */
    plugMargin: number


    constructor(context: Context, data: ChronosToolbarDataType) {
        super(context);
        this.startOffSet = data.startOffSet
        this.width = data.width ?? 39
        this.backgroundColor = data.backgroundColor ?? "lightgray"
        this.backgroundBorder = data.backgroundBorder ?? 1
        this.backgroundBorderColor = data.backgroundBorderColor ?? "black"
        this.fontSize = data.fontSize ?? 16
        this.textColor = data.textColor ?? "black"
        this.hoverTextColor = data.hoverTextColor ?? "#359EE8"
        this.textDirection = data.textDirection ?? "M0 0 L0 200"
        this.plugMargin = data.plugMargin ?? 10
    }
}

/**
 * 工具栏-组件数据类型
 */
export type ChronosToolbarDataType = {
    startOffSet: { x: number, y: number }
    width?: number
    backgroundColor?: string
    backgroundBorder?: number
    backgroundBorderColor?: string
    fontSize?: number
    textColor?: string
    hoverTextColor?: string
    textDirection?: string
    plugMargin?: number
}