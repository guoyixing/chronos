import {BaseComponent} from "../component.interface";
import {ChronosWindowData} from "./window.data";
import {ChronosWindowService} from "./window.service";
import {inject, injectable} from "inversify";
import {TYPES} from "../../config/inversify.config";
import {Lifecycle} from "../../core/lifecycle/lifecycle";
import {ResizeListener, StageDragListener} from "../../core/event/event";

/**
 * 窗口-组件
 */
@injectable()
export class ChronosWindowComponent extends BaseComponent<ChronosWindowData, ChronosWindowService>
    implements StageDragListener, ResizeListener, Lifecycle {

    /**
     * 组件名称
     */
    name = () => "window"

    constructor(@inject(TYPES.ChronosWindowData) data: ChronosWindowData,
                @inject(TYPES.ChronosWindowService) service: ChronosWindowService) {
        super(data, service);
    }

    order(): number {
        return 9998
    }

    /**
     * 舞台拖拽监听
     */
    stageDragListen() {
        this.data.graphics?.destroy()
        this.service.limitStageMove()
        this.service.draw()
    }

    /**
     * 视口尺寸变化监听
     * @param width 新的宽度
     * @param height 新的高度
     */
    resizeListen(width: number, height: number): void {
        // 更新窗口数据
        this.data.width = width;
        this.data.height = height;
        // 重绘窗口边框
        this.data.graphics?.destroy();
        this.service.draw();
    }

}
