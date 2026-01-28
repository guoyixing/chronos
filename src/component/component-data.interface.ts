import {Context} from "../core/context/context";
import Konva from "konva";

/**
 * 组件数据接口
 */
export class ComponentData {
    /**
     * 上下文
     */
    readonly context: Context

    /**
     * 组件图层
     */
    layer?: Konva.Layer

    constructor(context: Context) {
        this.context = context
    }
}