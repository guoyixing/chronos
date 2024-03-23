import {ComponentData} from "../../../data.component";
import {injectable} from "inversify";
import {Context} from "../../../../core/context/context";
import Konva from "konva";

/**
 * 节点导航窗-组件数据
 */
@injectable()
export class ChronosNodeBarData extends ComponentData {

    /**
     * 图形
     */
    graphics: Konva.Group | undefined


    /**
     * 渲染起始坐标
     */
    startOffSet: { x: number, y: number } | undefined

    /**
     * 宽度
     */
    width: number

    /**
     * 高度
     */
    height: number | undefined

    /**
     * 是否隐藏
     */
    hide: boolean = true

    /**
     * 背景颜色
     */
    backgroundColor: string = 'white'

    /**
     * 边框颜色
     */
    borderColor: string = 'black'

    /**
     * 边框大小
     */
    border: number = 1


    constructor(context: Context, width: number) {
        super(context);
        this.width = width;
    }
}
