import {ComponentData} from "../../data.component";
import {Context} from "../../../core/context/context";

/**
 * 泳道条目-组件数据
 */
export class ChronosLaneEntryData extends ComponentData {

    /**
     * 泳道id
     */
    id: string

    /**
     * 泳道名称
     */
    name: string

    /**
     * 泳道行数
     */
    rowNum: number = 1

    /**
     * 泳道行高度
     */
    height: number = 0

    /**
     * 渲染起始坐标
     */
    startCoordinate: { x: number, y: number } = {x: 0, y: 0}

    /**
     * 索引
     * 当前泳道在泳道组中的索引
     */
    index: number = 0

    /**
     * 泳道行
     * 可以存放节点的行对应的y坐标
     * 均为单数行
     */
    row: number[] = []

    /**
     * 隐藏泳道左侧
     */
    hideLeft: boolean = false


    constructor(context: Context, id: string, name: string, rowNum: number) {
        super(context);
        this.id = id;
        this.name = name;
        this.rowNum = rowNum;
    }
}
