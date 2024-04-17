import {ComponentData} from "../../../data.component";
import {injectable} from "inversify";
import {ChronosNodeEntryComponent} from "../entry/entry.node.component";
import Konva from "konva";
import {Context} from "../../../../core/context/context";
import {ShadowConfigType, ShadowType} from "../../../../common/type/shadow.type";

/**
 * 节点详情-组件数据
 */
@injectable()
export class ChronosNodeDetailData extends ComponentData {
    /**
     * 绑定的节点
     */
    bindNodeId: string | undefined

    /**
     * 绑定的节点
     */
    bindNode: ChronosNodeEntryComponent | undefined

    /**
     * 图形
     */
    graphics: Konva.Group | undefined

    /**
     * 宽度
     */
    width: number

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
     * 标题高度
     */
    titleHeight: number

    /**
     * 标题背景色
     */
    titleBackgroundColor: string

    /**
     * 标题文字内容
     */
    titleText: string

    /**
     * 标题字体颜色
     */
    titleFontColor: string

    /**
     * 标题字体大小
     */
    titleFontSize: number

    /**
     * 标题字体
     */
    titleFontFamily: string

    /**
     * 文字左边距
     */
    textLeftMargin: number

    /**
     * 文字上边距
     */
    textTopMargin: number

    /**
     * 文字字体颜色
     */
    textFontColor: string

    /**
     * 文字字体大小
     */
    textFontSize: number

    /**
     * 文字字体
     */
    textFontFamily: string

    /**
     * 文字行号
     */
    textLineHeight: number

    /**
     * 距离鼠标的偏移量
     */
    mouseOffset: { x: number, y: number }

    /**
     * 阴影
     */
    shadow: ShadowType


    constructor(context: Context, data?: ChronosNodeDetailDataType) {
        super(context);
        this.width = data?.width ?? 250
        this.backgroundColor = data?.backgroundColor ?? "white"
        this.borderColor = data?.borderColor ?? "#F1F0FF"
        this.border = data?.border ?? 1
        this.radius = data?.radius ?? 5
        this.titleHeight = data?.titleHeight ?? 25
        this.titleBackgroundColor = data?.titleBackgroundColor ?? "#ECECF4"
        this.titleText = data?.titleText ?? "详细信息"
        this.titleFontColor = data?.titleFontColor ?? "#4F4F54"
        this.titleFontSize = data?.titleFontSize ?? 15
        this.titleFontFamily = data?.titleFontFamily ?? "Calibri"
        this.textLeftMargin = data?.textLeftMargin ?? 10
        this.textTopMargin = data?.textTopMargin ?? 10
        this.textFontColor = data?.textFontColor ?? "#4F4F54"
        this.textFontSize = data?.textFontSize ?? 15
        this.textFontFamily = data?.textFontFamily ?? "Calibri"
        this.textLineHeight = data?.textLineHeight ?? 1.5
        this.mouseOffset = {
            x: data?.mouseOffset?.x ?? 25,
            y: data?.mouseOffset?.y ?? 25
        }
        this.shadow = {
            color: data?.shadow?.color ?? 'black',
            blur: data?.shadow?.blur ?? 10,
            offset: {
                x: data?.shadow?.offset?.x ?? 0,
                y: data?.shadow?.offset?.y ?? 0
            },
            opacity: data?.shadow?.opacity ?? 0.5
        }
    }
}

/**
 * 节点详情-组件数据类型
 */
export type ChronosNodeDetailDataType = {
    width?: number
    backgroundColor?: string
    borderColor?: string
    border?: number
    radius?: number
    titleHeight?: number
    titleBackgroundColor?: string
    titleText?: string
    titleFontColor?: string
    titleFontSize?: number
    titleFontFamily?: string
    textLeftMargin?: number
    textTopMargin?: number
    textFontColor?: string
    textFontSize?: number
    textFontFamily?: string
    textLineHeight?: number
    mouseOffset?: { x?: number, y?: number }
    shadow?: ShadowConfigType
}