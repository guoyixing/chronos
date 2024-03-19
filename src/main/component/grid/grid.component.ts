import {inject, injectable} from "inversify";
import {BaseComponent} from "../component";
import {MouseMoveListener, StageDragListener} from "../../core/event/event";
import {Lifecycle} from "../../core/lifecycle/lifecycle";
import {ChronosGridData} from "./data.grid.component";
import {ChronosGridService} from "./service.grid.component";
import {TYPES} from "../../config/inversify.config";

/**
 * 网格
 */
@injectable()
export class ChronosGridComponent extends BaseComponent<ChronosGridData, ChronosGridService> implements StageDragListener, MouseMoveListener, Lifecycle {

    /**
     * 组件名称
     */
    name = () => "grid"

    constructor(@inject(TYPES.ChronosGridData) data: ChronosGridData,
                @inject(TYPES.ChronosGridService) service: ChronosGridService) {
        super(data, service);
    }

    /**
     * 舞台拖拽监听
     */
    stageDragListen() {
        this.data.layer.destroyChildren()
        this.service.draw()
    }

    /**
     * 鼠标移动监听
     */
    mouseMoveListen() {
        this.service.drawPoint();
    }


    // get toolbar(): ChronosTool {
    //     return new ChronosTool("网格", () => {
    //         this.context.stageConfig.showGrid = !this.context.stageConfig.showGrid
    //         this.layer.destroyChildren()
    //         this.draw()
    //     })
    // }
}
