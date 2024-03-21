import "reflect-metadata";
import {injectable} from "inversify";
import {ComponentData} from "../data.component";
import {Context} from "../../core/context/context";
import Konva from "konva";

/**
 * 窗体-组件数据
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

    /**
     * 边框颜色
     */
    borderColor: string = "black"


    constructor(context: Context, width: number, height: number, border: number) {
        super(context);
        this.width = width;
        this.height = height;
        this.border = border;
    }
}