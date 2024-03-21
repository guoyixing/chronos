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
     * 鼠标点时候的回调方法
     */
    callback: () => void

    constructor(name: string, callback: () => void) {
        this.name = name;
        this.callback = callback;
    }
}