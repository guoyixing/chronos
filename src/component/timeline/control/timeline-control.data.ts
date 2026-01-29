import {injectable} from "inversify";
import {ComponentData} from "../../component-data.interface";
import {ShadowConfigType, ShadowType} from "../../../core/common/type/shadow.type";
import Konva from "konva";
import {Context} from "../../../core/context/context";
import {ChronosWindowComponent} from "../../window/window.component";
import {TYPES} from "../../../config/inversify.config";

/**
 * 时间轴控制面板-组件数据
 */
@injectable()
export class ChronosTimelineControlData extends ComponentData {
    graphics: Konva.Group | undefined
    startOffSet: { x: number, y: number }
    width: number
    height: number
    hide: boolean
    backgroundColor: string
    borderColor: string
    border: number
    radius: number
    shadow: ShadowType
    text: {
        fontSize: number,
        fontFamily: string,
        color: string,
        hoverColor: string,
        marginBottom: number
    }
    margin: number

    constructor(context: Context, data?: ChronosTimelineControlDataType) {
        super(context);
        this.width = data?.width ?? 150;
        this.height = data?.height ?? 200;
        this.hide = data?.hide ?? true;
        this.backgroundColor = data?.backgroundColor ?? 'white';
        this.borderColor = data?.borderColor ?? '#EBEBEB';
        this.radius = data?.radius ?? 10;
        this.border = data?.border ?? 1;
        this.margin = data?.margin ?? 20;
        this.shadow = {
            color: data?.shadow?.color ?? 'black',
            blur: data?.shadow?.blur ?? 10,
            offset: {
                x: data?.shadow?.offset?.x ?? 0,
                y: data?.shadow?.offset?.y ?? 0
            },
            opacity: data?.shadow?.opacity ?? 0.2
        };
        this.text = {
            fontSize: data?.text?.fontSize ?? 14,
            fontFamily: data?.text?.fontFamily ?? 'Calibri',
            color: data?.text?.color ?? '#4F4F54',
            hoverColor: data?.text?.hoverColor ?? '#359EE8',
            marginBottom: data?.text?.marginBottom ?? 8
        };
        
        // 位置计算 - 参考 lane-display 模式
        const window = context.ioc.get<ChronosWindowComponent>(TYPES.ChronosWindowComponent);
        if (data?.startOffSetPct) {
            this.startOffSet = {
                x: window.data?.width * data.startOffSetPct.xPct,
                y: window.data?.height * data.startOffSetPct.yPct
            };
        } else {
            // 默认位置：右上角 (70% x, 15% y)
            this.startOffSet = {
                x: window.data?.width * 0.7,
                y: window.data?.height * 0.15
            };
        }
    }
}

export type ChronosTimelineControlDataType = {
    startOffSetPct?: { xPct: number, yPct: number }
    width?: number
    height?: number
    hide?: boolean
    backgroundColor?: string
    borderColor?: string
    border?: number
    margin?: number
    radius?: number
    shadow?: ShadowConfigType
    text?: {
        fontSize?: number,
        fontFamily?: string,
        color?: string,
        hoverColor?: string,
        marginBottom?: number
    }
}
