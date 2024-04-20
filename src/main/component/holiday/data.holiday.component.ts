import {injectable} from "inversify";
import {ComponentData} from "../data.component";
import Konva from "konva";
import {Context} from "../../core/context/context";

/**
 * 假期-组件数据
 */
@injectable()
export class ChronosHolidayData extends ComponentData {

    /**
     * 图形
     */
    graphics: Konva.Group | undefined

    /**
     * 休假日
     */
    holiday: {startTime:Date,endTime:Date}[]

    /**
     * 颜色
     */
    color: string

    /**
     * 边框
     */
    border: number

    /**
     * 边框颜色
     */
    borderColor: string

    /**
     * 不透明度
     */
    opacity: number

    /**
     * 是否显示
     */
    hide : boolean

    constructor(context: Context, data?: ChronosHolidayDataType) {
        super(context);
        this.holiday = data?.holiday ?? [];
        this.color = data?.color ?? "#FFFF00";
        this.border = data?.border ?? 1;
        this.borderColor = data?.borderColor ?? "#FF0000";
        this.opacity = data?.opacity ?? 0.2;
        this.hide = data?.hide ?? false;
    }

}

export type ChronosHolidayDataType = {
    holiday: {startTime:Date,endTime:Date}[],
    color: string,
    border: number,
    borderColor: string,
    opacity: number,
    hide : boolean
}
