import Konva from "konva";
import {ButtonType} from "../../core/common/type/button.type";
import {ChronosToolbarData} from "./toolbar.data";

/**
 * 工具栏注册接口
 */
export interface ToolbarPlugRegister {
    toolbar(): ChronosToolPlug
}

/**
 * 工具栏插件
 */
export class ChronosToolPlug {

    /**
     * 名称
     */
    name: string

    /**
     * 排序
     */
    order: number = 0

    /**
     * 图标
     */
    graphics: (button: ButtonType) => Konva.Path

    /**
     * 鼠标点时候的回调方法
     */
    callback: (graphics: Konva.Path, button: ButtonType, toolbar: ChronosToolbarData) => void

    constructor(name: string,
                graphics: (button: ButtonType) => Konva.Path,
                callback: (graphics: Konva.Path, button: ButtonType, toolbar: ChronosToolbarData) => void) {
        this.name = name;
        this.graphics = graphics;
        this.callback = callback;
    }
}
