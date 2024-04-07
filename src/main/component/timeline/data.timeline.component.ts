import {ComponentData} from "../data.component";
import {Context} from "../../core/context/context";
import {injectable} from "inversify";

/**
 * 时间轴-组件数据
 */
@injectable()
export class ChronosTimelineData extends ComponentData {

    /**
     * 初始化时间
     */
    initTime: Date;

    /**
     * 渲染起始坐标
     */
    startOffSet: { x: number, y: number }

    /**
     * 天的宽度
     */
    dayWidth: number

    /**
     * 文字显示最小宽度
     */
    textMinWidth: number

    /**
     * 每行的高度
     */
    rowHeight: number

    /**
     * 头部宽度
     */
    headWidth: number

    /**
     * 边框大小
     */
    border: number

    /**
     * 边框颜色
     */
    borderColor: string

    /**
     * 背景颜色
     */
    backgroundColor: string[]

    /**
     * 字体颜色
     */
    textColor: string

    /**
     * 字体大小
     */
    fontSize: number

    /**
     * 字的边距
     */
    textMargin: number

    /**
     * 字体
     */
    fontFamily: string


    constructor(context: Context, data: ChronosTimelineDataType) {
        super(context);
        this.initTime = new Date(data.initTime);
        this.startOffSet = data.startOffSet;
        this.dayWidth = data.dayWidth ?? 20
        this.textMinWidth = data.textMinWidth ?? 15
        this.rowHeight = data.rowHeight ?? 20
        this.headWidth = data.headWidth ?? 60
        this.border = data.border ?? 1
        this.borderColor = data.borderColor ?? "black"
        this.backgroundColor = data.backgroundColor ?? ["#f0f0f0", "#e0e0e0"]
        this.textColor = data.textColor ?? "black"
        this.fontSize = data.fontSize ?? 12
        this.textMargin = data.textMargin ?? 10
        this.fontFamily = data.fontFamily ?? "Calibre"
    }
}

/**
 * 时间轴-组件数据类型
 */
export type ChronosTimelineDataType = {
    initTime: string;
    startOffSet: { x: number, y: number }
    dayWidth?: number
    textMinWidth?: number
    rowHeight?: number
    headWidth?: number
    border?: number
    borderColor?: string
    backgroundColor?: string[]
    textColor?: string
    fontSize?: number
    textMargin?: number
    fontFamily?: string
}
