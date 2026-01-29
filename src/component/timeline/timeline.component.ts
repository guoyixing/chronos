import {Lifecycle} from "../../core/lifecycle/lifecycle";
import {ResizeListener, StageDragListener} from "../../core/event/event";
import {BaseComponent} from "../component.interface";
import {ChronosTimelineService} from "./timeline.service";
import {ChronosTimelineData} from "./timeline.data";
import {inject, injectable} from "inversify";
import {TYPES} from "../../config/inversify.config";
import {ChronosLaneGroupComponent} from "../lane/group/lane-group.component";

/**
 * 时间轴组件
 */
@injectable()
export class ChronosTimelineComponent extends BaseComponent<ChronosTimelineData, ChronosTimelineService>
    implements StageDragListener, ResizeListener, Lifecycle {

    /**
     * 组件名称
     */
    name = () => "timeline"

    /**
     * 泳道组组件（用于时间轴级别变化时触发泳道重绘）
     */
    private _laneGroup: ChronosLaneGroupComponent

    constructor(@inject(TYPES.ChronosTimelineData) data: ChronosTimelineData,
                @inject(TYPES.ChronosTimelineService) service: ChronosTimelineService,
                @inject(TYPES.ChronosLaneGroupComponent) laneGroup: ChronosLaneGroupComponent) {
        super(data, service);
        this._laneGroup = laneGroup;
    }

    init() {
        super.init();
        this.service.listenScale()
    }

    stageDragListen(): void {
        this.data.layer?.destroyChildren()
        this.service.draw()
    }

    /**
     * 视口尺寸变化监听
     * @param _width 新的宽度（未使用）
     * @param _height 新的高度（未使用）
     */
    resizeListen(_width: number, _height: number): void {
        // 重绘时间轴
        this.data.layer?.destroyChildren();
        this.service.draw();
    }

    /**
     * 重绘时间轴（供外部调用，时间轴级别变化时调用）
     * 同时触发泳道组重绘以调整位置
     */
    reDraw(): void {
        this.data.layer?.destroyChildren();
        this.service.draw();
        // 时间轴级别变化后，触发泳道组重绘以更新位置
        this._laneGroup.service.reDraw();
    }
}
