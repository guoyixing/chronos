import {BaseComponent} from "../component";
import {ChronosWindowData} from "./data.window.component";
import {ChronosWindowService} from "./service.window.component";
import {inject, injectable} from "inversify";
import {TYPES} from "../../config/inversify.config";
import {Lifecycle} from "../../core/lifecycle/lifecycle";
import {StageDragListener} from "../../core/event/event";

/**
 * 窗口-组件
 */
@injectable()
export class ChronosWindowComponent extends BaseComponent<ChronosWindowData, ChronosWindowService>
    implements StageDragListener, Lifecycle {

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
        this.data.layer?.destroyChildren()
        this.service.limitStageMove()
        this.service.draw()
    }

}
