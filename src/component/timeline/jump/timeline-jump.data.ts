import {ComponentData} from "../../component-data.interface";
import {injectable} from "inversify";
import Konva from "konva";
import {Context} from "../../../core/context/context";
import {ShadowConfigType, ShadowType} from "../../../core/common/type/shadow.type";

/**
 * 时间轴跳转-组件数据
 */
@injectable()
export class ChronosJumpTimelineData extends ComponentData {

    // ===== 运行时属性 =====

    /**
     * 图形
     */
    graphics?: Konva.Group | undefined

    /**
     * 起始坐标
     */
    startOffSet?: { x: number, y: number }

    // ===== 业务属性 =====

    /**
     * 是否隐藏
     */
    hide: boolean

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

    /**
     * 阴影
     */
    shadow: ShadowType

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
        this.shadow = {
            color: data?.shadow?.color ?? 'black',
            blur: data?.shadow?.blur ?? 5,
            offset: {
                x: data?.shadow?.offset?.x ?? 0,
                y: data?.shadow?.offset?.y ?? 2
            },
            opacity: data?.shadow?.opacity ?? 0.1
        }
    }
}

export type ChronosJumpTimelineBusinessType = {
    hide?: boolean
}

export type ChronosJumpTimelineStyleType = {
    startOffSet?: { x: number, y: number }
    width?: number
    height?: number
    bottomMargin?: number
    backgroundColor?: string
    border?: number
    borderColor?: string
    radius?: number
    shadow?: ShadowConfigType
}

export type ChronosJumpTimelineDataType = ChronosJumpTimelineBusinessType & ChronosJumpTimelineStyleType
