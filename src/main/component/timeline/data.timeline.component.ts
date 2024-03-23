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
    dayWidth: number = 20;

    /**
     * 每行的高度
     */
    rowHeight: number = 20;

    /**
     * 头部宽度
     */
    headWidth: number = 60;

    /**
     * 边框大小
     */
    border: number = 1;

    /**
     * 边框颜色
     */
    borderColor: string = "black";

    /**
     * 背景颜色
     */
    backgroundColor: string[] = ["#f0f0f0", "#e0e0e0"];

    /**
     * 字体颜色
     */
    textColor: string = "black";

    /**
     * 字体大小
     */
    fontSize: number = 12;

    /**
     * 字的边距
     */
    textMargin: number = 10

    /**
     * 字体
     */
    fontFamily: string = "Calibre";


    constructor(context: Context, initTime: Date, startOffSet: { x: number; y: number }) {
        super(context);
        this.initTime = initTime;
        this.startOffSet = startOffSet;
    }
}
