import {inject, injectable} from "inversify";
import {ChronosReviseService} from "../serivce.revise.component";
import {ComponentService} from "../../service.component";
import {Callback} from "../../../core/event/callback/callback";
import {ChronosLaneEntryComponent} from "../../lane/entry/entry.lane.component";
import {ChronosLaneGroupComponent} from "../../lane/group/group.lane.component";
import {TYPES} from "../../../config/inversify.config";
import {ChronosReviseData} from "../data.revise.component";

@injectable()
export class ChronosLaneReviseService extends ChronosReviseService<ChronosLaneEntryComponent> implements ComponentService {

    formName = "lane-revise"

    /**
     * 回调
     */
    private _callback: Callback

    /**
     * 泳道组
     */
    private _laneGroup: ChronosLaneGroupComponent;


    constructor(@inject(TYPES.ChronosLaneReviseData) data: ChronosReviseData<ChronosLaneEntryComponent>,
                @inject(TYPES.Callback) callback: Callback,
                @inject(TYPES.ChronosLaneGroupComponent) laneGroup: ChronosLaneGroupComponent) {
        super(data);
        this._callback = callback;
        this._laneGroup = laneGroup;
    }

    /**
     * 获取绑定的组件
     */
    getBind(): ChronosLaneEntryComponent | undefined {
        if (this._data.bindId) {
            return this._laneGroup.service.laneById(this._data.bindId);
        }
    }

    /**
     * 确认按钮事件
     */
    reviseConfirm(): void {
        if (!this._data.bind) {
            throw Error("绑定的泳道不存在")
        }
        this._callback.laneReviseConfirm && this._callback.laneReviseConfirm(this._data.bind.data, this._data.bind)
        this._laneGroup?.service.reDraw()
        this.close();
    }

    /**
     * 删除按钮事件
     */
    reviseDelete(): void {
        if (!this._data.bind) {
            throw Error("绑定的泳道不存在")
        }
        this._data.bind?.service.clear()
        this._laneGroup?.service.reDraw()
        this.close();
    }
}
