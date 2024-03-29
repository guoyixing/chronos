import {inject, injectable} from "inversify";
import {BaseComponent} from "../component";
import {MouseMoveListener, StageDragListener} from "../../core/event/event";
import {Lifecycle} from "../../core/lifecycle/lifecycle";
import {ChronosGridData} from "./data.grid.component";
import {ChronosGridService} from "./service.grid.component";
import {TYPES} from "../../config/inversify.config";
import {ChronosToolPlug, ToolbarPlugRegister} from "../toolbar/plug.toolbar.component";

/**
 * 网格
 */
@injectable()
export class ChronosGridComponent extends BaseComponent<ChronosGridData, ChronosGridService>
    implements StageDragListener, MouseMoveListener, Lifecycle, ToolbarPlugRegister {

    /**
     * 组件名称
     */
    name = () => "grid"

    order(): number {
        return -9999
    }

    constructor(@inject(TYPES.ChronosGridData) data: ChronosGridData,
                @inject(TYPES.ChronosGridService) service: ChronosGridService) {
        super(data, service);
    }

    /**
     * 工具栏插件注册
     */
    toolbar(): ChronosToolPlug {
        return new ChronosToolPlug("网格", () => {
            this.data.hide = !this.data.hide
            this.data.graphics?.destroy()
            this.service.draw()
        })
    }

    /**
     * 初始化
     */
    init() {
        this.data.layer = this.data.context.drawContext.rootLayer
    }

    /**
     * 舞台拖拽监听
     */
    stageDragListen() {
        this.data.graphics?.destroy()
        this.service.draw()
    }

    /**
     * 鼠标移动监听
     */
    mouseMoveListen() {
        this.service.drawPoint();
    }


}
