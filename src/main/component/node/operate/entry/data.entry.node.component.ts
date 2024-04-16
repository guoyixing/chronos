import {ComponentData} from "../../../data.component";
import {ChronosLaneEntryComponent} from "../../../lane/entry/entry.lane.component";
import {Context} from "../../../../core/context/context";
import {NodeShape} from "../../board/shape/NodeShape";

/**
 * 节点条目-组件数据
 */
export class ChronosNodeEntryData extends ComponentData {

    /**
     * 坐标
     * xStart: 开始x坐标
     * xFinish: 结束x坐标，如果没有结束时间，则为undefined
     * y: y坐标
     */
    private _coordinate: { xStart?: number, xFinish?: number | undefined, y?: number } = {}

    /**
     * 节点id
     */
    id: string

    /**
     * 名称
     */
    name: string

    /**
     * 节点类型
     */
    type: string

    /**
     * 节点开始时间
     */
    startTime: Date

    /**
     * 节点结束时间
     * 使用finish，而不是end，因为根据PDM的定义，应该是开始和完成
     */
    finishTime: Date | undefined

    /**
     * 泳道id
     */
    laneId: string

    /**
     * 泳道中的所属行号
     */
    row: number

    /**
     * 泳道
     */
    lane: ChronosLaneEntryComponent | undefined

    /**
     * 图形
     */
    graphics: NodeShape | undefined

    /**
     * 是否隐藏
     */
    hidden: boolean

    /**
     * 扩展字段
     */
    extendField: {}

    constructor(context: Context, data: ChronosNodeEntryDataType) {
        super(context);
        this.id = data.id;
        this.name = data.name;
        this.type = data.type;
        this.extendField = data.extendField ?? {};
        this.startTime = new Date(data.startTime);
        if (data.finishTime) {
            this.finishTime = new Date(data.finishTime);
        }
        this.laneId = data.laneId;
        this.row = data.row;
        this.hidden = data.hidden ?? false;
    }

    get coordinate(): { xStart?: number; xFinish?: number | undefined; y?: number } {
        const coordinate = this.graphics?.coordinate();
        return coordinate || this._coordinate
    }

    set coordinate(value: { xStart?: number; xFinish?: number | undefined; y?: number }) {
        this._coordinate = value;
    }
}

/**
 * 节点条目-组件数据类型
 */
export type ChronosNodeEntryDataType = {
    id: string
    name: string
    type: string
    startTime: string
    laneId: string
    row: number
    finishTime?: string
    hidden?: boolean
    extendField?: {}

}