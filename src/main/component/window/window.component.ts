import {DragListener} from "../../core/event/drag.event";
import {BaseComponent} from "../component";
import {ChronosWindowData} from "./data.window.component";
import {ChronosWindowService} from "./service.window.component";
import {inject, injectable} from "inversify";
import {TYPES} from "../../config/inversify.config";

/**
 * 窗口边框
 */
@injectable()
export class ChronosWindowComponent extends BaseComponent<ChronosWindowData, ChronosWindowService> implements DragListener {

    /**
     * 组件名称
     */
    name = () => "window"

    constructor(@inject(TYPES.ChronosWindowData) data: ChronosWindowData,
                @inject(TYPES.ChronosWindowService) service: ChronosWindowService) {
        super(data, service);
    }

    stageMoveListen() {
        this.service.limitStageMove();
        this.service.draw()
    }

}
