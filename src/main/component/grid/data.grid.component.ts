import {ComponentData} from "../data.component";
import {injectable} from "inversify";
import Konva from "konva";
import {Context} from "../../core/context/context";

/**
 * 网格-组件数据
 */
@injectable()
export class ChronosGridData extends ComponentData {

    /**
     * 图形
     */
    graphics: Konva.Group | undefined

    /**
     * 网格间隙
     */
    size: number = 20;

    /**
     * 网格颜色
     */
    color: string = '#ddd';

    /**
     * 网格宽度，粗细
     */
    width: number = 1;

    /**
     * 网格横线坐标
     */
    xLine: number[] = []

    /**
     * 网格纵线坐标
     */
    yLine: number[] = []

    /**
     * 是否隐藏
     */
    hide: boolean = false

    /**
     * 点
     */
    point: Konva.Circle | undefined;

    /**
     * 点的颜色
     */
    pointColor: string = '#DD0000';

    /**
     * 点的半径
     */
    pointRadius: number = 3;

    /**
     * 是否显示点
     * 鼠标移动到网格上的时候，是否显示点
     */
    hidePoint: boolean = true;

    constructor(context: Context) {
        super(context);
    }

}
