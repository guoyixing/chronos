import {BaseComponent} from "../component.interface";
import {ResizeListener, StageDragListener} from "../../core/event/event";
import {Lifecycle} from "../../core/lifecycle/lifecycle";
import {ChronosScaleService} from "./scale.service";
import {ChronosScaleData} from "./scale.data";
import {inject, injectable} from "inversify";
import {TYPES} from "../../config/inversify.config";
import {ChronosWindowComponent} from "../window/window.component";

/**
 * 比例尺-组件
 */
@injectable()
export class ChronosScaleComponent extends BaseComponent<ChronosScaleData, ChronosScaleService>
    implements StageDragListener, ResizeListener, Lifecycle {

    /**
     * 组件名称
     */
    name = () => "scale"

    constructor(@inject(TYPES.ChronosScaleData) data: ChronosScaleData,
                @inject(TYPES.ChronosScaleService) service: ChronosScaleService) {
        super(data, service);
    }

    /**
     * 监听舞台拖拽
     */
    stageDragListen(): void {
        this.service.redraw();
    }

    /**
     * 视口尺寸变化监听
     */
    resizeListen(width: number, height: number): void {
        // 重新计算位置
        this.data.recalculatePosition(width, height);
        // 重绘
        this.service.redraw();
    }

    /**
     * 初始化
     */
    init(): void {
        const window = this.data.context.ioc.get<ChronosWindowComponent>(TYPES.ChronosWindowComponent);
        this.data.layer = window.data.layer
    }

    /**
     * 排序
     */
    order(): number {
        return 9999
    }

}
