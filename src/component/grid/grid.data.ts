import {ComponentData} from "../component-data.interface";
import {injectable} from "inversify";
import Konva from "konva";
import {Context} from "../../core/context/context";

/**
 * 网格-组件数据
 */
@injectable()
export class ChronosGridData extends ComponentData {

    // ===== 运行时属性 =====

    /**
     * 图形
     */
    graphics: Konva.Group | undefined

    /**
     * 网格横线坐标
     */
    xLine: number[] = []

    /**
     * 网格纵线坐标
     */
    yLine: number[] = []

    /**
     * 点
     */
    point: Konva.Circle | undefined;

    /**
     * 是否显示点
     * 鼠标移动到网格上的时候，是否显示点
     */
    hidePoint: boolean = true;

    // ===== 业务属性 =====

    /**
     * 是否隐藏
     */
    hide: boolean

    // ===== 样式属性 =====

    /**
     * 渲染起始坐标
     */
    startOffSet: { x: number, y: number }

    /**
     * 网格间隙
     */
    tbGapSize: number;

    /**
     * 左右间隙
     */
    lrGapSize: number;

    /**
     * 网格颜色
     */
    color: string;

    /**
     * 网格宽度，粗细
     */
    width: number;

    /**
     * 点的颜色
     */
    pointColor: string = '#DD0000';

    /**
     * 点的半径
     */
    pointRadius: number = 3;

    constructor(context: Context, data?: ChronosGridDataType) {
        super(context);
        this.startOffSet = data?.startOffSet ?? {x: 60, y: 0};
        this.tbGapSize = data?.tbGapSize ?? 20;
        this.lrGapSize = data?.lrGapSize ?? 40;
        this.color = data?.color ?? '#EFEFEF';
        this.width = data?.width ?? 1;
        this.hide = data?.hide ?? false;
    }

}

/**
 * 网格-业务数据类型
 * Business properties: visibility state
 */
export type ChronosGridBusinessType = {
    /**
     * 是否隐藏
     */
    hide?: boolean
}

/**
 * 网格-样式数据类型
 * Style properties: spacing, colors, dimensions
 */
export type ChronosGridStyleType = {
    /**
     * 渲染起始坐标
     */
    startOffSet?: { x: number, y: number }

    /**
     * 网格间隙
     */
    tbGapSize?: number;

    /**
     * 左右间隙
     */
    lrGapSize?: number;

    /**
     * 网格颜色
     */
    color?: string;

    /**
     * 网格宽度，粗细
     */
    width?: number;
}

/**
 * 网格-组件数据类型 (向后兼容)
 * Combined type for backward compatibility
 */
export type ChronosGridDataType = ChronosGridBusinessType & ChronosGridStyleType
