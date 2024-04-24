import {injectable, interfaces} from "inversify";
import {ComponentData} from "../data.component";
import Konva from "konva";
import {Context} from "../../core/context/context";

/**
 * 水印-组件数据
 */
@injectable()
export class ChronosWatermarkData extends ComponentData {

    /**
     * 图形
     */
    graphics: Konva.Group | undefined

    /**
     * 是否隐藏
     */
    hide: boolean

    /**
     * 上下间隙
     */
    tbSize: number;

    /**
     * 左右间隙
     */
    lrSize: number

    /**
     * 旋转
     */
    rotation: number

    /**
     * 文字
     */
    text: {
        /**
         * 大小
         */
        size: number

        /**
         * 字体
         */
        font: string

        /**
         * 颜色
         */
        color: string

        /**
         * 不透明度
         */
        opacity: number

        /**
         * 内容
         */
        content: string
    }

    constructor(context:Context, data?: ChronosWatermarkDataType) {
        super(context);
        this.hide = data?.hide ?? true;
        this.tbSize = data?.tbSize ?? 300;
        this.lrSize = data?.lrSize ?? 500;
        this.rotation = data?.rotation ?? 45;
        this.text = {
            size: data?.text?.size ?? 50,
            font: data?.text?.font ?? "Calibri",
            color: data?.text?.color ?? "#888",
            opacity: data?.text?.opacity ?? 0.2,
            content: data?.text?.content ?? "Chronos"
        }
    }
}

export type ChronosWatermarkDataType = {
    hide: boolean,
    tbSize: number,
    lrSize: number,
    rotation?: number,
    text?: {
        size?: number,
        font?: string,
        color?: string,
        opacity?: number,
        content?: string
    }
}