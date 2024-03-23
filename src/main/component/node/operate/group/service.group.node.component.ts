import {ComponentService} from "../../../service.component";
import {ChronosNodeGroupData} from "./data.group.node.component";
import {TYPES} from "../../../../config/inversify.config";
import {inject, injectable} from "inversify";

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
}
