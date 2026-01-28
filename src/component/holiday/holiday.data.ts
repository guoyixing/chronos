import {injectable} from "inversify";
import {ComponentData} from "../component-data.interface";
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
    holiday: { startTime: Date, endTime: Date, hide: boolean }[]

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
    hide: boolean

    /**
     * 文字设置
     */
    text: {
        /**
         * 密度
         */
        density: number
        /**
         * 颜色
         */
        color: string
        /**
         * 字体
         */
        font: string
        /**
         * 大小
         */
        size: number
        /**
         * 内容
         */
        content: string

        /**
         * 旋转角度
         */
        rotation: number
    }

    constructor(context: Context, data?: ChronosHolidayDataType) {
        super(context);
        this.holiday = [];
        if (data?.holiday) {
            data?.holiday.forEach((item) => {
                this.holiday.push({
                    startTime: new Date(item.startTime),
                    endTime: new Date(item.endTime),
                    hide: item.hide ?? false
                });
            })
        }
        this.color = data?.color ?? "#FFFF00";
        this.border = data?.border ?? 1;
        this.borderColor = data?.borderColor ?? "#FF0000";
        this.opacity = data?.opacity ?? 0.2;
        this.hide = data?.hide ?? false;
        this.text = {
            density: data?.text?.density ?? 40,
            color: data?.text?.color ?? "#ffcc19",
            font: data?.text?.font ?? "Calibri",
            size: data?.text?.size ?? 12,
            content: data?.text?.content ?? "休息日",
            rotation: data?.text?.rotation ?? 45
        }
    }
}

export type ChronosHolidayDataType = {
    holiday?: {
        startTime: string,
        endTime: string,
        hide?: boolean
    }[],
    color?: string,
    border?: number,
    borderColor?: string,
    opacity?: number,
    hide?: boolean,
    text?: {
        density?: number
        color?: string
        font?: string
        size?: number
        content?: string
        rotation?: number
    }
}
