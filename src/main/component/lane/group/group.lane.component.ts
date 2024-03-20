import {BaseComponent} from "../../component";
import {ChronosLaneGroupService} from "./service.group.lane.component";
import {ChronosLaneGroupData} from "./data.group.lane.component";
import {Lifecycle} from "../../../core/lifecycle/lifecycle";
import {inject, injectable} from "inversify";
import {TYPES} from "../../../config/inversify.config";
import {ChronosWindowComponent} from "../../window/window.component";
import {ChronosLaneEntryService} from "../entry/service.entry.lane.component";
import {ChronosLaneEntryComponent} from "../entry/entry.lane.component";
import {StageDragListener} from "../../../core/event/event";

/**
 * 泳道组-组件
 */
@injectable()
export class ChronosLaneGroupComponent extends BaseComponent<ChronosLaneGroupData, ChronosLaneGroupService>
    implements Lifecycle, StageDragListener {

    /**
     * 组件名称
     */
    name = () => "lane-group"

    constructor(@inject(TYPES.ChronosLaneGroupData) data: ChronosLaneGroupData,
                @inject(TYPES.ChronosLaneGroupService) service: ChronosLaneGroupService) {
        super(data, service);
    }

    /**
     * 初始化
     */
    init() {
        super.init()
        //获取窗体组件
        const window = this.data.context.ioc.get<ChronosWindowComponent>(TYPES.ChronosWindowComponent);

        //初始化泳道组
        this.data.originalLaneEntryData.forEach((laneEntryData) => {
            const service = new ChronosLaneEntryService(laneEntryData, window, this);
            const component = new ChronosLaneEntryComponent(laneEntryData, service);
            this.data.laneGroup.push(component);
        })
    }

    // get toolbar(): ChronosTool {
    //     return new ChronosTool("泳道", () => {
    //         this._isDrawLeft = !this._isDrawLeft;
    //         //重新绘制
    //         this._layer.destroyChildren();
    //         this.draw()
    //     })
    // }

    /**
     * 舞台拖拽监听
     */
    stageDragListen(): void {
        this.data.layer?.destroyChildren()
        this.service.draw()
    }
}