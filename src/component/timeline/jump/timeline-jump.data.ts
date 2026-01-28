import {ComponentData} from "../../component-data.interface";
import {injectable} from "inversify";
import Konva from "konva";
import {Context} from "../../../core/context/context";

/**
 * 时间轴跳转-组件数据
 */
@injectable()
export class ChronosJumpTimelineData extends ComponentData {

    /**
     * 图形
     */
    graphics?: Konva.Group | undefined

    /**
     * 起始坐标
     */
    startOffSet?: { x: number, y: number }

    /**
     * 是否隐藏
     */
    hide: boolean

    /**
     * 宽度
     */
    width: number

    /**
     * 高度
     */
    height: number

    /**
     * 底边距
     */
    bottomMargin: number

    /**
     * 背景颜色
     */
    backgroundColor: string

    /**
     * 边框宽度
     */
    border: number

    /**
     * 边框颜色
     */
    borderColor: string

    /**
     * 圆角
     */
    radius: number

    constructor(context: Context, data?: ChronosJumpTimelineDataType) {
        super(context);
        this.hide = data?.hide ?? true
        this.startOffSet = data?.startOffSet
        this.width = data?.width ?? 240
        this.height = data?.height ?? 30
        this.bottomMargin = data?.bottomMargin ?? 10
        this.backgroundColor = data?.backgroundColor ?? "#ECECF4"
        this.border = data?.border ?? 1
        this.borderColor = data?.borderColor ?? "#ECECF4"
        this.radius = data?.radius ?? 10
    }
}

export type ChronosJumpTimelineDataType = {
    hide?: boolean
    startOffSet?: { x: number, y: number }
    width?: number
    height?: number
    bottomMargin?: number
    backgroundColor?: string
    border?: number
    borderColor?: string
    radius?: number
}
