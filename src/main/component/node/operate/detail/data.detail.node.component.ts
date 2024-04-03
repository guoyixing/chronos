import {ComponentData} from "../../../data.component";
import {injectable} from "inversify";
import {ChronosNodeEntryComponent} from "../entry/entry.node.component";
import Konva from "konva";
import {Context} from "../../../../core/context/context";

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
    width: number = 250

    /**
     * 背景颜色
     */
    backgroundColor: string = "white"

    /**
     * 边框颜色
     */
    borderColor: string = "black"

    /**
     * 边框大小
     */
    border: number = 1

    /**
     * 标题高度
     */
    titleHeight: number = 25

    /**
     * 标题背景色
     */
    titleBackgroundColor: string = "#f0f0f0"

    /**
     * 标题文字内容
     */
    titleText: string = "详细信息"

    /**
     * 标题字体颜色
     */
    titleFontColor: string = "black"

    /**
     * 标题字体大小
     */
    titleFontSize: number = 15

    /**
     * 标题字体
     */
    titleFontFamily: string = "Calibri"

    /**
     * 文字左边距
     */
    textLeftMargin: number = 10

    /**
     * 文字上边距
     */
    textTopMargin: number = 10

    /**
     * 文字字体颜色
     */
    textFontColor: string = "black"

    /**
     * 文字字体大小
     */
    textFontSize: number = 15

    /**
     * 文字字体
     */
    textFontFamily: string = "Calibri"

    /**
     * 文字行号
     */
    textLineHeight: number = 1.5

    /**
     * 距离鼠标的偏移量
     */
    mouseOffset: { x: number, y: number } = {x: 25, y: 25}


    constructor(context: Context) {
        super(context);
    }
}