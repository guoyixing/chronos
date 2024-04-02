import {ComponentService} from "../../../service.component";
import {ChronosNodeGroupData} from "./data.group.node.component";
import {TYPES} from "../../../../config/inversify.config";
import {inject, injectable} from "inversify";
import {ChronosNodeEntryComponent} from "../entry/entry.node.component";

/**
 * 节点组-组件服务
 */
@injectable()
export class ChronosNodeGroupService implements ComponentService {

    /**
     * 数据
     */
    private _data: ChronosNodeGroupData

    constructor(@inject(TYPES.ChronosNodeGroupData) data: ChronosNodeGroupData) {
        this._data = data;
    }

    /**
     * 绘制
     */
    draw() {
        this._data.nodeGroup.forEach((entry) => {
            entry.service.draw();
        })
    }

    /**
     * 获取节点条目
     * @param nodeId 节点ID
     */
    getNodeEntryByNodeId(nodeId: string): ChronosNodeEntryComponent | undefined {
        let result: ChronosNodeEntryComponent | undefined;
        this._data.nodeGroup.forEach((entry) => {
            if (entry.data.id === nodeId) {
                result = entry;
            }
        })
        return result;
    }

    /**
     * 移除节点条目
     * @param id
     */
    removeNodeEntry(id: string) {
        for (let i = 0; i < this._data.nodeGroup.length; i++) {
            if (this._data.nodeGroup[i].data.id === id) {
                this._data.nodeGroup.splice(i, 1);
                break;
            }
        }
    }
}
