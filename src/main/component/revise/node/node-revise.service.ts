import {ComponentService} from "../../component-service.interface";
import {inject, injectable} from "inversify";
import {TYPES} from "../../../config/inversify.config";
import {Callback} from "../../../core/event/callback/callback";
import {ChronosNodeGroupComponent} from "../../node/operate/group/node-group.component";
import {ChronosReviseService} from "../revise.service";
import {ChronosReviseData} from "../revise.data";
import {ChronosNodeEntryComponent} from "../../node/operate/entry/node-entry.component";

/**
 * 节点修订窗-组件服务
 */
@injectable()
export class ChronosNodeReviseService extends ChronosReviseService<ChronosNodeEntryComponent> implements ComponentService {

    formName = "node-revise"

    /**
     * 回调
     */
    private _callback: Callback

    /**
     * 节点组
     */
    private _nodeGroup: ChronosNodeGroupComponent;


    constructor(@inject(TYPES.ChronosNodeReviseData) data: ChronosReviseData<ChronosNodeEntryComponent>,
                @inject(TYPES.Callback) callback: Callback,
                @inject(TYPES.ChronosNodeGroupComponent) nodeGroup: ChronosNodeGroupComponent) {
        super(data);
        this._callback = callback;
        this._nodeGroup = nodeGroup;
    }

    /**
     * 获取绑定的组件
     */
    getBind(): ChronosNodeEntryComponent | undefined {
        if (this._data.bindId) {
            return this._nodeGroup.service.getNodeEntryByNodeId(this._data.bindId);
        }
    }

    /**
     * 确认按钮事件
     */
    reviseConfirm(): void {
        if (!this._data.bind) {
            throw Error("绑定的节点不存在")
        }
        this._callback.nodeReviseConfirm && this._callback.nodeReviseConfirm(this._data.bind.data, this._data.bind)
        this._data.bind?.service.reDraw()
        this.close();
    }

    /**
     * 删除按钮事件
     */
    reviseDelete(): void {
        if (!this._data.bind) {
            throw Error("绑定的节点不存在")
        }
        this._data.bind?.service.clear()
        this.close();
    }

}
