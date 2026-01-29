import {BaseComponent} from "../component.interface";
import {Lifecycle} from "../../core/lifecycle/lifecycle";
import {ChronosToolbarService} from "./toolbar.service";
import {ChronosToolbarData} from "./toolbar.data";
import {inject, injectable} from "inversify";
import {TYPES} from "../../config/inversify.config";
import {ResizeListener, StageDragListener} from "../../core/event/event";
import {ToolbarPlugRegister} from "./toolbar-plug.component";
import {ChronosWindowComponent} from "../window/window.component";

/**
 * 工具栏-组件
 */
@injectable()
export class ChronosToolbarComponent extends BaseComponent<ChronosToolbarData, ChronosToolbarService>
    implements StageDragListener, ResizeListener, Lifecycle {

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
        // 收集完工具后，重新计算位置（因为宽度现在是动态的）
        const window = this.data.context.ioc.get<ChronosWindowComponent>(TYPES.ChronosWindowComponent);
        this.data.recalculatePosition(window.data.width, window.data.height)
    }

    stageDragListen() {
        this.data.graphics?.destroy();
        this.service.draw();
    }

    /**
     * 视口尺寸变化监听
     */
    resizeListen(width: number, height: number): void {
        // 重新计算位置
        this.data.recalculatePosition(width, height);
        // 重绘
        this.data.graphics?.destroy();
        this.service.draw();
    }

    /**
     * 切换工具栏的展开/收缩状态
     */
    toggle(): void {
        this.data.expanded = !this.data.expanded;
        // 重绘
        this.data.graphics?.destroy();
        this.service.draw();
    }

    /**
     * 设置工具栏的展开状态
     * @param expanded 是否展开
     */
    setExpanded(expanded: boolean): void {
        if (this.data.expanded !== expanded) {
            this.data.expanded = expanded;
            // 重绘
            this.data.graphics?.destroy();
            this.service.draw();
        }
    }

    order(): number {
        return 9999
    }
}
