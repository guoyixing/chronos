import {ComponentData} from "../component-data.interface";
import {Context} from "../../core/context/context";
import {injectable} from "inversify";
import {ShadowConfigType, ShadowType} from "../../core/common/type/shadow.type";

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
     * 圆角
     */
    radius: number

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

    /**
     * 阴影
     */
    shadow: ShadowType


    constructor(context: Context, data: ChronosTimelineDataType) {
        super(context);
        this.initTime = new Date(data.initTime);
        this.startOffSet = data.startOffSet ?? {x: 0, y: 1}
        this.dayWidth = data.dayWidth ?? 40
        this.textMinWidth = data.textMinWidth ?? 15
        this.rowHeight = data.rowHeight ?? 20
        this.headWidth = data.headWidth ?? 60
        this.border = data.border ?? 1
        this.borderColor = data.borderColor ?? "#DADADA"
        this.backgroundColor = data.backgroundColor ?? ["#FFF", "#ECECF4"]
        this.radius = data.radius ?? 5
        this.textColor = data.textColor ?? "#4F4F54"
        this.fontSize = data.fontSize ?? 12
        this.textMargin = data.textMargin ?? 10
        this.fontFamily = data.fontFamily ?? "Calibre"
        this.shadow = {
            color: data.shadow?.color ?? 'black',
            blur: data.shadow?.blur ?? 10,
            offset: {
                x: data.shadow?.offset?.x ?? 0,
                y: data.shadow?.offset?.y ?? 0
            },
            opacity: data.shadow?.opacity ?? 0.2
        }
    }
}

/**
 * 时间轴-组件数据类型
 */
export type ChronosTimelineDataType = {
    initTime: string;
    startOffSet?: { x: number, y: number }
    dayWidth?: number
    textMinWidth?: number
    rowHeight?: number
    headWidth?: number
    border?: number
    borderColor?: string
    backgroundColor?: string[]
    radius?: number
    textColor?: string
    fontSize?: number
    textMargin?: number
    fontFamily?: string
    shadow?: ShadowConfigType
}
