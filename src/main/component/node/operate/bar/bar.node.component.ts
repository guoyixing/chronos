import {BaseComponent} from "../../../component";
import {ChronosNodeBarData} from "./data.bar.node.component";
import {ChronosNodeBarService} from "./service.bar.node.component";
import {inject, injectable} from "inversify";
import {TYPES} from "../../../../config/inversify.config";
import {Lifecycle} from "../../../../core/lifecycle/lifecycle";
import {StageDragListener} from "../../../../core/event/event";
import {ChronosToolPlug, ToolbarPlugRegister} from "../../../toolbar/plug.toolbar.component";

/**
 * 节点导航窗-组件
 */
@injectable()
export class ChronosNodeBarComponent extends BaseComponent<ChronosNodeBarData, ChronosNodeBarService>
    implements Lifecycle, StageDragListener, ToolbarPlugRegister {

    /**
     * 组件名称
     */
    name = () => "node-bar"

    constructor(@inject(TYPES.ChronosNodeBarData) data: ChronosNodeBarData,
                @inject(TYPES.ChronosNodeBarService) service: ChronosNodeBarService) {
        super(data, service);
    }

    /**
     * 工具栏插件注册
     */
    toolbar(): ChronosToolPlug {
        return new ChronosToolPlug("节点", () => {
            this.data.hide ? this.service.open() : this.service.close()
        })
    }

    /**
     * 舞台拖拽监听
     */
    stageDragListen(): void {
        !this.data.hide && this.service.draw()
    }

    /**
     * 初始化
     */
    init() {
        this.data.layer = this.service.setLayer()
        this.service.setStartOffSet()
    }

    /**
     * 启动
     */
    start() {
        !this.data.hide && super.start();
    }

    order(): number {
        return 9999
    }
}
