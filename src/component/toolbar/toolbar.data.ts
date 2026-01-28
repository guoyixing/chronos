import {ComponentData} from "../component-data.interface";
import {Context} from "../../core/context/context";
import {ChronosToolPlug} from "./toolbar-plug.component";
import {injectable} from "inversify";
import Konva from "konva";
import {ChronosWindowComponent} from "../window/window.component";
import {TYPES} from "../../config/inversify.config";
import {ButtonConfigType, ButtonType} from "../../core/common/type/button.type";

/**
 * 工具栏-组件数据
 */
@injectable()
export class ChronosToolbarData extends ComponentData {

    /**
     * 图形
     */
    graphics: Konva.Group | undefined

    /**
     * 工具组
     */
    toolPlugs: Array<ChronosToolPlug> = []

    /**
     * 渲染起始坐标
     */
    startOffSet: { x: number, y: number }

    /**
     * 宽度
     */
    width: number

    /**
     * 高度
     */
    height: number

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
     * 按钮
     */
    button: ButtonType


    constructor(context: Context, data?: ChronosToolbarDataType) {
        super(context);
        this.width = data?.width ?? 275
        this.height = data?.height ?? 35
        this.backgroundColor = data?.backgroundColor ?? "#ECECF4"
        this.border = data?.border ?? 1
        this.borderColor = data?.borderColor ?? "#ECECF4"
        this.radius = data?.radius ?? 10
        this.button = {
            stroke: {
                length: data?.button?.stroke?.length ?? 10,
                width: data?.button?.stroke?.width ?? 2,
                color: data?.button?.stroke?.color ?? "#4F4F54",
                hoverColor: data?.button?.stroke?.hoverColor ?? "#359EE8",
                disabledColor: data?.button?.stroke?.disabledColor ?? "#FFF",
                margin: {
                    left: data?.button?.stroke?.margin?.left ?? 10,
                    right: data?.button?.stroke?.margin?.right ?? 10
                }
            },
            background: {
                color: data?.button?.background?.color ?? "#ECECF4",
                hoverColor: data?.button?.background?.hoverColor ?? "#E0DFFF",
            }
        }
        const window = context.ioc.get<ChronosWindowComponent>(TYPES.ChronosWindowComponent);
        if (data?.startOffSetPct) {
            this.startOffSet = {
                x: window.data?.width * data?.startOffSetPct.xPct - this.width / 2,
                y: window.data?.height * data?.startOffSetPct.yPct - this.height / 2
            }
        } else {
            this.startOffSet = {
                x: window.data?.width * 0.5 - this.width / 2,
                y: window.data?.height * 0.95 - this.height / 2
            }
        }
    }
}

/**
 * 工具栏-组件数据类型
 */
export type ChronosToolbarDataType = {
    startOffSetPct?: { xPct: number, yPct: number }
    width?: number
    height?: number
    backgroundColor?: string
    border?: number
    borderColor?: string
    radius?: number
    button?: ButtonConfigType
}
