import {ComponentData} from "../../../data.component";
import {injectable} from "inversify";
import Konva from "konva";
import {ChronosNodeEntryComponent} from "../entry/entry.node.component";
import {ShadowConfigType, ShadowType} from "../../../../common/type/shadow.type";
import {Context} from "../../../../core/context/context";
import {ChronosWindowComponent} from "../../../window/window.component";
import {TYPES} from "../../../../config/inversify.config";
import {ButtonTextConfigType, ButtonTextType} from "../../../../common/type/button.type";

/**
 * 节点修订窗-组件数据
 */
@injectable()
export class ChronosNodeReviseData extends ComponentData {
    /**
     * 图形
     */
    graphics: Konva.Group | undefined

    /**
     * 绑定的节点
     */
    bindNodeId: string | undefined

    /**
     * 绑定的节点
     */
    bindNode: ChronosNodeEntryComponent | undefined

    /**
     * 表单ID
     */
    formId: string | undefined

    /**
     * 表单
     */
    form: HTMLDivElement | undefined

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
     * 是否隐藏
     */
    hide: boolean

    /**
     * 背景颜色
     */
    backgroundColor: string

    /**
     * 边框颜色
     */
    borderColor: string

    /**
     * 边框大小
     */
    border: number

    /**
     * 圆角
     */
    radius: number | number[]

    /**
     * 阴影
     */
    shadow: ShadowType

    /**
     * 按钮
     */
    button: ButtonTextType

    constructor(context: Context, data?: ChronosNodeReviseDataType) {
        super(context);
        this.formId = data?.formId;
        this.form = this.formId ? document.getElementById(this.formId) as HTMLDivElement : undefined;
        this.width = data?.width ?? 400;
        this.height = data?.height ?? 200;
        this.hide = data?.hide ?? true;
        this.backgroundColor = data?.backgroundColor ?? 'white';
        this.borderColor = data?.borderColor ?? '#EBEBEB';
        this.radius = data?.radius ?? 10;
        this.border = data?.border ?? 1;
        this.shadow = {
            color: data?.shadow?.color ?? 'black',
            blur: data?.shadow?.blur ?? 10,
            offset: {
                x: data?.shadow?.offset?.x ?? 0,
                y: data?.shadow?.offset?.y ?? 0
            },
            opacity: data?.shadow?.opacity ?? 0.2
        }
        this.button = {
            margin: {
                right: data?.button?.margin?.right ?? 10,
                bottom: data?.button?.margin?.bottom ?? 10
            },
            text: {
                color: data?.button?.text?.color ?? '#359EE8',
                hoverColor: data?.button?.text?.hoverColor ?? '#359EE8',
                fontSize: data?.button?.text?.fontSize ?? 14,
                fontFamily: data?.button?.text?.fontFamily ?? 'Calibri'
            },
            background: {
                height: data?.button?.background?.height ?? 30,
                width: data?.button?.background?.width ?? 60,
                color: data?.button?.background?.color ?? '#ECECF4',
                hoverColor: data?.button?.background?.hoverColor ?? '#E0DFFF',
                stroke: data?.button?.background?.stroke ?? 1,
                strokeColor: data?.button?.background?.strokeColor ?? '#ECECF4',
                radius: data?.button?.background?.radius ?? 5
            }
        }
        const window = context.ioc.get<ChronosWindowComponent>(TYPES.ChronosWindowComponent);
        if (data?.startOffSetPct) {
            this.startOffSet = {
                x: window.data.width * data.startOffSetPct.xPct - this.width / 2,
                y: window.data.height * data.startOffSetPct.yPct - this.height / 2
            }
        } else {
            this.startOffSet = {
                x: window.data.width * 0.5 - this.width / 2,
                y: window.data.height * 0.5 - this.height / 2
            }
        }
    }
}

/**
 * 节点修订窗-组件数据
 */
export type ChronosNodeReviseDataType = {
    startOffSetPct?: { xPct: number, yPct: number },
    formId?: string,
    width?: number,
    height?: number,
    hide?: boolean,
    backgroundColor?: string,
    borderColor?: string,
    border?: number,
    radius?: number | number[],
    shadow?: ShadowConfigType,
    button?: ButtonTextConfigType
}