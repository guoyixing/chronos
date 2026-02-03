import {ComponentData} from "../component-data.interface";
import {Context} from "../../core/context/context";
import {ChronosToolPlug} from "./toolbar-plug.component";
import {injectable} from "inversify";
import Konva from "konva";
import {ButtonConfigType, ButtonType} from "../../core/common/type/button.type";

/**
 * 工具栏-组件数据
 */
@injectable()
export class ChronosToolbarData extends ComponentData {

    // ===== 运行时属性 =====

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
     * 按钮高度（私有）
     */
    private _buttonHeight: number

    /**
     * 宽度（根据工具数量动态计算）
     */
    private _width: number | undefined

    // ===== 业务属性 =====

    /**
     * 每行显示的按钮数量（0 表示不限制，单行显示所有）
     */
    itemsPerRow: number

    /**
     * 收缩状态下显示的行数
     */
    collapsedRows: number

    /**
     * 当前是否展开
     */
    expanded: boolean

    /**
     * 是否显示展开/收缩按钮（仅当按钮数量超过一行时有效）
     */
    showExpandButton: boolean

    /**
     * 展开方向：向上展开或向下展开
     */
    expandDirection: 'up' | 'down'

    // ===== 样式属性 =====

    /**
     * 定位百分比（用于 resize 时重新计算位置）
     */
    startOffSetPct: { xPct: number, yPct: number }

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

    /**
     * 获取单个按钮的宽度
     */
    get buttonWidth(): number {
        return this.button.stroke.margin.left + this.button.stroke.margin.right + this.button.stroke.length
    }

    /**
     * 获取单个按钮的高度
     */
    get buttonHeight(): number {
        return this._buttonHeight
    }

    /**
     * 获取总行数
     */
    get totalRows(): number {
        if (this.itemsPerRow <= 0 || this.toolPlugs.length === 0) {
            return 1
        }
        return Math.ceil(this.toolPlugs.length / this.itemsPerRow)
    }

    /**
     * 获取当前可见的行数
     */
    get visibleRows(): number {
        if (!this.needsExpandButton) {
            return this.totalRows
        }
        return this.expanded ? this.totalRows : this.collapsedRows
    }

    /**
     * 是否需要显示展开/收缩按钮
     */
    get needsExpandButton(): boolean {
        return this.showExpandButton && this.totalRows > this.collapsedRows
    }

    /**
     * 获取工具栏宽度（根据每行按钮数量计算）
     */
    get width(): number {
        if (this._width !== undefined) {
            return this._width
        }
        const toolCount = this.toolPlugs.length
        if (toolCount === 0) {
            return 0
        }
        // 如果不限制每行数量，使用所有按钮的宽度
        if (this.itemsPerRow <= 0) {
            return toolCount * this.buttonWidth
        }
        // 否则使用每行数量 * 按钮宽度（如果需要展开按钮，额外加一个按钮宽度）
        const buttonsInRow = Math.min(this.itemsPerRow, toolCount)
        const expandButtonWidth = this.needsExpandButton ? this.buttonWidth : 0
        return buttonsInRow * this.buttonWidth + expandButtonWidth
    }

    /**
     * 设置工具栏宽度（仅用于兼容旧配置）
     */
    set width(value: number) {
        this._width = value
    }

    /**
     * 获取工具栏高度（根据可见行数动态计算）
     */
    get height(): number {
        return this.visibleRows * this._buttonHeight
    }

    /**
     * 设置工具栏高度（实际设置的是按钮高度）
     */
    set height(value: number) {
        this._buttonHeight = value
    }


    constructor(context: Context, data?: ChronosToolbarDataType) {
        super(context);
        // width 现在是动态计算的，不再需要初始化
        // 如果用户显式设置了 width，则使用用户设置的值
        if (data?.width !== undefined) {
            this._width = data.width
        }
        // 按钮高度（即单行高度）
        this._buttonHeight = data?.height ?? 35
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
        // 保存定位百分比
        this.startOffSetPct = data?.startOffSetPct ?? { xPct: 0.5, yPct: 0.95 }
        // 初始位置在 init 后重新计算（因为需要等工具注册完才能知道宽度）
        this.startOffSet = { x: 0, y: 0 }
        // 多行展示配置
        this.itemsPerRow = data?.itemsPerRow ?? 0  // 0 表示不限制，单行显示
        this.collapsedRows = data?.collapsedRows ?? 1  // 收缩时显示1行
        this.expanded = data?.expanded ?? false  // 默认收缩状态
        this.showExpandButton = data?.showExpandButton ?? true  // 默认显示展开按钮
        this.expandDirection = data?.expandDirection ?? 'up'  // 默认向上展开
    }

    /**
     * 根据新的窗口尺寸重新计算位置
     * 向上展开时，底部位置固定；向下展开时，顶部位置固定
     */
    recalculatePosition(windowWidth: number, windowHeight: number): void {
        const baseY = windowHeight * this.startOffSetPct.yPct;
        
        if (this.expandDirection === 'up') {
            // 向上展开：底部位置固定，顶部向上延伸
            // 收缩状态时的底部位置作为锚点
            const collapsedHeight = this.collapsedRows * this._buttonHeight;
            const bottomY = baseY + collapsedHeight / 2;
            this.startOffSet = {
                x: windowWidth * this.startOffSetPct.xPct - this.width / 2,
                y: bottomY - this.height
            };
        } else {
            // 向下展开：顶部位置固定（原有逻辑）
            this.startOffSet = {
                x: windowWidth * this.startOffSetPct.xPct - this.width / 2,
                y: baseY - this.height / 2
            };
        }
    }
}

/**
 * 工具栏-业务数据类型
 * Business properties: layout and expansion behavior
 */
export type ChronosToolbarBusinessType = {
    /**
     * 每行显示的按钮数量（0 表示不限制，单行显示所有）
     */
    itemsPerRow?: number
    /**
     * 收缩状态下显示的行数
     */
    collapsedRows?: number
    /**
     * 初始是否展开
     */
    expanded?: boolean
    /**
     * 是否显示展开/收缩按钮
     */
    showExpandButton?: boolean
    /**
     * 展开方向：向上展开或向下展开（默认向上）
     */
    expandDirection?: 'up' | 'down'
}

/**
 * 工具栏-样式数据类型
 * Style properties: positioning, colors, and dimensions
 */
export type ChronosToolbarStyleType = {
    startOffSetPct?: { xPct: number, yPct: number }
    width?: number
    height?: number
    backgroundColor?: string
    border?: number
    borderColor?: string
    radius?: number
    button?: ButtonConfigType
}

/**
 * 工具栏-组件数据类型 (向后兼容)
 * Combined type for backward compatibility
 */
export type ChronosToolbarDataType = ChronosToolbarBusinessType & ChronosToolbarStyleType
