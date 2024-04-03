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
     * 是否隐藏X轴
     */
    hideScaleX: boolean = false

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
     * 按钮背景颜色
     */
    buttonBackgroundColor: string = "#f0f0f0"

    /**
     * 按钮边框大小
     */
    buttonBorder: number = 1

    /**
     * 按钮边框颜色
     */
    buttonBorderColor: string = "black"

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



    constructor(context: Context, startOffSet: { x: number; y: number }) {
        super(context);
        this.startOffSet = startOffSet;
    }
}