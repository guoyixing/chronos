import {injectable} from "inversify";
import {ComponentData} from "../../component-data.interface";
import {ShadowConfigType, ShadowType} from "../../../core/common/type/shadow.type";
import Konva from "konva";
import {Context} from "../../../core/context/context";
import {ChronosScaleData} from "../../scale/scale.data";
import {TYPES} from "../../../config/inversify.config";

/**
 * 时间轴控制面板-组件数据
 */
@injectable()
export class ChronosTimelineControlData extends ComponentData {
    
    // ===== 运行时属性 =====

    graphics: Konva.Group | undefined

    /**
     * 位置计算临时变量
     */
    private startOffSetValue: { x: number, y: number } = {x: 0, y: 0}

    /**
     * 起始坐标 (getter for backward compatibility)
     */
    get startOffSet(): { x: number, y: number } {
        return this.startOffSetValue;
    }

    set startOffSet(value: { x: number, y: number }) {
        this.startOffSetValue = value;
    }

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
     * 背景颜色
     */
    backgroundColor: string

    /**
     * 边框颜色
     */
    borderColor: string

    /**
     * 边框宽度
     */
    border: number

    /**
     * 圆角
     */
    radius: number

    /**
     * 阴影
     */
    shadow: ShadowType

    /**
     * 文本样式
     */
    text: {
        fontSize: number,
        fontFamily: string,
        color: string,
        hoverColor: string,
        marginRight: number
    }

    /**
     * 内边距
     */
    padding: { horizontal: number, vertical: number }

    constructor(context: Context, data?: ChronosTimelineControlDataType) {
        super(context);
        // 横向布局：6个级别，每个约24px宽 + 间距
        this.width = data?.width ?? 180;
        this.height = data?.height ?? 32;
        this.hide = data?.hide ?? true;
        this.backgroundColor = data?.backgroundColor ?? '#ECECF4';
        this.borderColor = data?.borderColor ?? '#ECECF4';
        this.radius = data?.radius ?? 10;
        this.border = data?.border ?? 1;
        this.padding = {
            horizontal: data?.padding?.horizontal ?? 12,
            vertical: data?.padding?.vertical ?? 8
        };
        this.shadow = {
            color: data?.shadow?.color ?? 'black',
            blur: data?.shadow?.blur ?? 5,
            offset: {
                x: data?.shadow?.offset?.x ?? 0,
                y: data?.shadow?.offset?.y ?? 2
            },
            opacity: data?.shadow?.opacity ?? 0.1
        };
        this.text = {
            fontSize: data?.text?.fontSize ?? 14,
            fontFamily: data?.text?.fontFamily ?? 'Calibri',
            color: data?.text?.color ?? '#4F4F54',
            hoverColor: data?.text?.hoverColor ?? '#359EE8',
            marginRight: data?.text?.marginRight ?? 12
        };
        
        // 位置计算 - 放在比例尺上方，与比例尺居中对齐
        const scaleData = context.ioc.get<ChronosScaleData>(TYPES.ChronosScaleData);
        
        // 比例尺的中心X坐标
        const scaleCenterX = scaleData.startOffSet.x + scaleData.width / 2;
        // 控制面板在比例尺上方，间距8px
        const gap = 8;
        
        this.startOffSet = {
            x: scaleCenterX - this.width / 2,
            y: scaleData.startOffSet.y - this.height - gap
        };
    }

    /**
     * 根据新的窗口尺寸重新计算位置
     */
    recalculatePosition(scaleData: ChronosScaleData): void {
        const scaleCenterX = scaleData.startOffSet.x + scaleData.width / 2;
        const gap = 8;
        this.startOffSet = {
            x: scaleCenterX - this.width / 2,
            y: scaleData.startOffSet.y - this.height - gap
        };
    }
}

export type ChronosTimelineControlBusinessType = {
    hide?: boolean
}

export type ChronosTimelineControlStyleType = {
    width?: number
    height?: number
    backgroundColor?: string
    borderColor?: string
    border?: number
    padding?: { horizontal?: number, vertical?: number }
    radius?: number
    shadow?: ShadowConfigType
    text?: {
        fontSize?: number,
        fontFamily?: string,
        color?: string,
        hoverColor?: string,
        marginRight?: number
    }
}

export type ChronosTimelineControlDataType = ChronosTimelineControlBusinessType & ChronosTimelineControlStyleType
