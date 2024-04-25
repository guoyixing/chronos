import {ChronosNodeEntryData} from "../../../component/node/operate/entry/node-entry.data";
import {ChronosNodeGroupComponent} from "../../../component/node/operate/group/node-group.component";
import {injectable} from "inversify";
import {ChronosNodeEntryComponent} from "../../../component/node/operate/entry/node-entry.component";
import {ChronosLaneEntryData} from "../../../component/lane/entry/lane-entry.data";
import {ChronosLaneGroupComponent} from "../../../component/lane/group/lane-group.component";
import {ChronosLaneEntryComponent} from "../../../component/lane/entry/lane-entry.component";

/**
 * 回调事件
 */
@injectable()
export class Callback {
    /**
     * 节点双击回调
     */
    nodeDoubleClick: ((node: ChronosNodeEntryData, nodeGroup: ChronosNodeGroupComponent) => void) | undefined

    /**
     * 节点新增回调
     */
    nodeAdd: ((node: ChronosNodeEntryData, nodeGroup: ChronosNodeGroupComponent) => void) | undefined

    /**
     * 节点变形回调
     */
    nodeTransform: ((node: ChronosNodeEntryData, nodeGroup: ChronosNodeGroupComponent) => void) | undefined

    /**
     * 节点拖拽回调
     */
    nodeDrag: ((node: ChronosNodeEntryData, nodeGroup: ChronosNodeGroupComponent) => void) | undefined

    /**
     * 节点删除回调
     */
    nodeDelete: ((node: ChronosNodeEntryData, nodeGroup: ChronosNodeGroupComponent) => void) | undefined

    /**
     * 泳道双击回调
     */
    laneDoubleClick: ((lane: ChronosLaneEntryData, laneGroup: ChronosLaneGroupComponent) => void) | undefined

    /**
     * 泳道新增行
     */
    laneAddRow: ((lane: ChronosLaneEntryData, laneGroup: ChronosLaneGroupComponent) => void) | undefined

    /**
     * 泳道减少行
     */
    laneReduceRow: ((lane: ChronosLaneEntryData, laneGroup: ChronosLaneGroupComponent) => void) | undefined

    /**
     * 添加泳道
     */
    laneAdd: ((lane: ChronosLaneEntryData, laneGroup: ChronosLaneGroupComponent) => void) | undefined

    /**
     * 删除泳道
     */
    laneDelete: ((lane: ChronosLaneEntryData, laneGroup: ChronosLaneGroupComponent) => void) | undefined

    /**
     * 节点修订窗确定回调
     */
    nodeReviseConfirm: ((node: ChronosNodeEntryData, nodeGroup: ChronosNodeEntryComponent) => void) | undefined

    /**
     * 泳道修订窗确定回调
     */
    laneReviseConfirm: ((lane: ChronosLaneEntryData, laneGroup: ChronosLaneEntryComponent) => void) | undefined

}
