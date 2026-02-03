import {ComponentData} from "../../../component-data.interface";
import {ChronosLaneEntryComponent} from "../../../lane/entry/lane-entry.component";
import {Context} from "../../../../core/context/context";
import {NodeShape} from "../../board/shape/node-shape.interface";
import Konva from "konva";

/**
 * 节点条目-组件数据
 */
export class ChronosNodeEntryData extends ComponentData {

    // ===== 运行时属性 =====

    /**
     * 坐标
     * xStart: 开始x坐标
     * xFinish: 结束x坐标，如果没有结束时间，则为undefined
     * y: y坐标
     */
    private _coordinate: { xStart?: number, xFinish?: number | undefined, y?: number } = {}

    /**
     * 泳道
     */
    lane: ChronosLaneEntryComponent | undefined

    /**
     * 图形
     */
    graphics: NodeShape | undefined

    /**
     * 进度文字图形
     */
    progressTextGraphics: Konva.Group | undefined

    // ===== 业务属性 =====

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
     * 进度
     */
    progress: number | undefined

    /**
     * 泳道id
     */
    laneId: string

    /**
     * 泳道中的所属行号
     */
    row: number

    /**
     * 是否隐藏
     */
    hidden: boolean

    /**
     * 扩展字段
     */
    extendField: Record<string, unknown>

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
        this.progress = data.progress;
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
 * 节点条目-业务数据类型
 * Business properties: domain logic, identifiers, relationships, time, and progress
 */
export type ChronosNodeEntryBusinessType = {
    id: string
    name: string
    type: string
    startTime: string
    laneId: string
    row: number
    finishTime?: string
    hidden?: boolean
    progress?: number
    extendField?: Record<string, unknown>
}

/**
 * 节点条目-样式数据类型
 * Style properties: (all styling is handled by node shape implementations)
 */
export type ChronosNodeEntryStyleType = object

/**
 * 节点条目-组件数据类型 (向后兼容)
 * Combined type for backward compatibility
 */
export type ChronosNodeEntryDataType = ChronosNodeEntryBusinessType & ChronosNodeEntryStyleType
