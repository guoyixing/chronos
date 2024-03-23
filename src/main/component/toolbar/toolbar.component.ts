import {BaseComponent} from "../component";
import {Lifecycle} from "../../core/lifecycle/lifecycle";
import {ChronosToolbarService} from "./service.toolbar.component";
import {ChronosToolbarData} from "./data.toolbar.component";
import {inject, injectable} from "inversify";
import {TYPES} from "../../config/inversify.config";
import {StageDragListener} from "../../core/event/event";
import {ToolbarPlugRegister} from "./plug.toolbar.component";

/**
 * 工具栏-组件
 */
@injectable()
export class ChronosToolbarComponent extends BaseComponent<ChronosToolbarData, ChronosToolbarService>
    implements StageDragListener, Lifecycle {

    /**
     * 组件名称
     */
    name = () => "toolbar"

    constructor(@inject(TYPES.ChronosToolbarData) data: ChronosToolbarData,
                @inject(TYPES.ChronosToolbarService) service: ChronosToolbarService) {
        super(data, service);
    }

    /**
     * 初始化
     */
    init() {
        this.data.layer = this.service.setLayer()
        const plugs = this.data.context.ioc.getAll<ToolbarPlugRegister>(TYPES.ToolbarPlugRegister)
        plugs.sort((a, b) => a.toolbar().order - b.toolbar().order)
        plugs.forEach((register) => {
            this.data.toolPlugs.push(register.toolbar())
        })
    }

    stageDragListen() {
        this.data.graphics?.destroy();
        this.service.draw();
    }

    order(): number {
        return 9999
    }
}
