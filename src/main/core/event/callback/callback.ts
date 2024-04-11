import {ChronosNodeEntryData} from "../../../component/node/operate/entry/data.entry.node.component";
import {ChronosNodeGroupComponent} from "../../../component/node/operate/group/group.node.component";
import {injectable} from "inversify";
import {ChronosNodeEntryComponent} from "../../../component/node/operate/entry/entry.node.component";

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
     * 修订窗确定回调
     */
    reviseConfirm: ((node: ChronosNodeEntryData, nodeComponent: ChronosNodeEntryComponent) => void) | undefined

}