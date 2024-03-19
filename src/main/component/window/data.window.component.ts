import "reflect-metadata";
import {injectable} from "inversify";
import {ComponentData} from "../data.component";
import {Context} from "../../core/context/context";
import Konva from "konva";

/**
 * 窗体组件数据
 */
@injectable()
export class ChronosWindowData extends ComponentData {

    /**
     * 宽度
     */
    width: number

    /**
     * 高度
     */
    height: number

    /**
     * 边框宽度
     */
    border: number


    constructor(context: Context, layer: Konva.Layer, width: number, height: number, border: number) {
        super(context, layer);
        this.width = width;
        this.height = height;
        this.border = border;
    }
}