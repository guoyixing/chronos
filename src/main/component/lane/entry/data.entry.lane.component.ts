import {ComponentData} from "../../data.component";
import {Context} from "../../../core/context/context";
import Konva from "konva";

/**
 * 泳道条目-组件数据
 */
export class ChronosLaneEntryData extends ComponentData {

    /**
     * 图形
     */
    graphics: Konva.Group | undefined

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
     * 按钮参数
     */
    button: {
        /**
         * 底边距
         */
        bottomMargin: number,
        /**
         * 左边距
         */
        leftMargin: number,
        /**
         * 宽度
         */
        width: number,
        /**
         * 高度
         */
        height: number,
        /**
         * 圆角
         */
        cornerRadius: number,
        /**
         * 背景颜色
         */
        backgroundColor: string,
        /**
         * 边框颜色
         */
        borderColor: string,
        /**
         * 边框大小
         */
        border: number,
        /**
         * 文字颜色
         */
        textColor: string,
        /**
         * 文字大小
         */
        fontSize: number,
        /**
         * 文字字体
         */
        fontFamily: string,
        /**
         * 提示文字颜色
         */
        hoverTextColor: string,
        /**
         * 提示文字大小
         */
        hoverFontSize: number,
        /**
         * 提示文字字体
         */
        hoverFontFamily: string
        /**
         * 悬浮背景颜色
         */
        hoverBackgroundColor: string
    }


    constructor(context: Context, data: ChronosLaneEntryDataType) {
        super(context);
        this.id = data.id;
        this.name = data.name;
        this.rowNum = data.rowNum ?? 1;
        this.leftBackgroundColor = data.leftBackgroundColor ?? "#f0f0f0";
        this.borderColor = data.borderColor ?? "black";
        this.border = data.border ?? 1;
        this.textColor = data.textColor ?? "#555";
        this.fontSize = data.fontSize ?? 16;
        this.fontFamily = data.fontFamily ?? "Calibri";
        this.textLeftMargin = data.textLeftMargin ?? 10;
        this.textTopMargin = data.textTopMargin ?? 10;
        this.textBottomMargin = data.textBottomMargin ?? 10;
        this.button = {
            bottomMargin: data.button?.bottomMargin ?? 20,
            leftMargin: data.button?.leftMargin ?? 4,
            width: data.button?.width ?? 15,
            height: data.button?.height ?? 15,
            cornerRadius: data.button?.cornerRadius ?? 3,
            backgroundColor: data.button?.backgroundColor ?? "#aaa",
            borderColor: data.button?.borderColor ?? "black",
            border: data.button?.border ?? 0,
            textColor: data.button?.textColor ?? "#fff",
            fontSize: data.button?.fontSize ?? 20,
            fontFamily: data.button?.fontFamily ?? "Calibri",
            hoverTextColor: data.button?.hoverTextColor ?? "#fff",
            hoverFontSize: data.button?.hoverFontSize ?? 12,
            hoverFontFamily: data.button?.hoverFontFamily ?? "Calibri",
            hoverBackgroundColor: data.button?.hoverTextColor ?? "#555"
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
    borderColor?: string
    border?: number
    textColor?: string
    fontSize?: number
    fontFamily?: string
    textLeftMargin?: number
    textTopMargin?: number
    textBottomMargin?: number
    button?: {
        bottomMargin?: number,
        leftMargin?: number,
        width?: number,
        height?: number,
        cornerRadius?: number,
        backgroundColor?: string,
        borderColor?: string,
        border?: number,
        textColor?: string,
        fontSize?: number,
        fontFamily?: string,
        hoverTextColor?: string,
        hoverFontSize?: number,
        hoverFontFamily?: string,
        hoverBackgroundColor?: string
    }
}
