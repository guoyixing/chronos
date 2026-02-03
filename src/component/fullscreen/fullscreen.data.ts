import {ComponentData} from "../component-data.interface";
import {Context} from "../../core/context/context";
import {injectable} from "inversify";

/**
 * 全屏-组件数据
 */
@injectable()
export class ChronosFullscreenData extends ComponentData {

    // ===== 运行时属性 =====

    /**
     * 是否处于全屏状态
     */
    isFullscreen: boolean = false

    /**
     * 全屏前的容器样式备份
     */
    originalStyles: {
        width: string
        height: string
        position: string
        top: string
        left: string
        zIndex: string
        background: string
    } | undefined

    /**
     * 根元素
     */
    rootElement: HTMLDivElement | undefined

    constructor(context: Context, _data?: ChronosFullscreenDataType) {
        super(context);
    }
}

/**
 * 全屏-组件数据类型
 */
export type ChronosFullscreenDataType = {
    // 预留扩展配置
}
