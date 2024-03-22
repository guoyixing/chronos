import {ComponentData} from "../data.component";
import {Context} from "../../core/context/context";
import {ChronosToolPlug} from "./plug.toolbar.component";
import {injectable} from "inversify";

/**
 * 工具栏-组件数据
 */
@injectable()
export class ChronosToolbarData extends ComponentData {

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
    width: number = 40

    /**
     * 背景颜色
     */
    backgroundColor: string = "lightgray"

    /**
     * 背景边框宽度
     */
    backgroundBorder: number = 1

    /**
     * 背景边框颜色
     */
    backgroundBorderColor: string = "black"

    /**
     * 文字大小
     */
    fontSize: number = 16

    /**
     * 文字颜色
     */
    textColor: string = "black"

    /**
     * 鼠标悬浮文字颜色
     */
    hoverTextColor: string = "#359EE8"

    /**
     * 文字走向
     */
    textDirection: string = "M0 0 L0 200"

    /**
     * 间隔距离
     */
    plugMargin: number = 10


    constructor(context: Context, startOffSet: {
        x: number;
        y: number
    }) {
        super(context);
        this.startOffSet = startOffSet;
    }
}
