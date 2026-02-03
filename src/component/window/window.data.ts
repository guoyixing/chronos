import "reflect-metadata";
import {injectable} from "inversify";
import {ComponentData} from "../component-data.interface";
import {Context} from "../../core/context/context";
import Konva from "konva";

/**
 * 窗体-组件数据
 */
@injectable()
export class ChronosWindowData extends ComponentData {

    // ===== 运行时属性 =====

    /**
     * 图形
     */
    graphics: Konva.Group | undefined

    /**
     * 图层
     */
    declare layer: Konva.Layer | undefined

    // ===== 样式属性 =====

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
    borderColor: string


    constructor(context: Context, data?: ChronosWindowDataType) {
        super(context);
        this.width = data?.width ?? 0;
        this.height = data?.height ?? 0;
        this.border = data?.border ?? 1;
        this.borderColor = data?.borderColor ?? "#E0DFFF";
    }
}

/**
 * 窗体-样式数据类型
 * Style properties: dimensions and border styling
 */
export type ChronosWindowStyleType = {
    width?: number,
    height?: number,
    border?: number,
    borderColor?: string
}

/**
 * 窗体-组件数据类型 (向后兼容)
 * Combined type for backward compatibility
 */
export type ChronosWindowDataType = ChronosWindowStyleType
