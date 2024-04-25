import {BaseComponent} from "../../component.interface";
import {ChronosLaneGroupService} from "./lane-group.service";
import {ChronosLaneGroupData} from "./lane-group.data";
import {Lifecycle} from "../../../core/lifecycle/lifecycle";
import {inject, injectable} from "inversify";
import {TYPES} from "../../../config/inversify.config";
import {ChronosWindowComponent} from "../../window/window.component";
import {ChronosLaneEntryService} from "../entry/lane-entry.service";
import {ChronosLaneEntryComponent} from "../entry/lane-entry.component";
import {StageDragListener} from "../../../core/event/event";
import {Callback} from "../../../core/event/callback/callback";
import {ChronosLaneReviseComponent} from "../../revise/lane/lane-revise.component";

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

    // /**
    //  * 工具栏插件注册
    //  */
    // toolbar(): ChronosToolPlug {
    //     return new ChronosToolPlug("泳道", () => {
    //         this.data.laneGroup.forEach((entry) => {
    //             entry.data.hideLeft = !entry.data.hideLeft
    //         })
    //         //重新绘制
    //         this.data.layer?.destroyChildren();
    //         this.service.draw()
    //     })
    // }

    /**
     * 初始化
     */
    init() {
        super.init()
        //获取窗体组件
        const window = this.data.context.ioc.get<ChronosWindowComponent>(TYPES.ChronosWindowComponent);
        //回调
        const callback = this.data.context.ioc.get<Callback>(TYPES.Callback);
        //修订窗
        const revise = this.data.context.ioc.get<ChronosLaneReviseComponent>(TYPES.ChronosLaneReviseComponent);

        //初始化泳道组
        this.data.originalLaneEntryData.forEach((laneEntryData) => {
            const service = new ChronosLaneEntryService(laneEntryData, callback, window, this, revise);
            const component = new ChronosLaneEntryComponent(laneEntryData, service);
            this.data.laneGroup.push(component);
        })
    }

    /**
     * 舞台拖拽监听
     */
    stageDragListen(): void {
        this.service.keepPos()
    }
}
