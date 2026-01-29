import {inject, injectable} from "inversify";
import {BaseComponent} from "../../component.interface";
import {Lifecycle} from "../../../core/lifecycle/lifecycle";
import {StageDragListener} from "../../../core/event/event";
import {TYPES} from "../../../config/inversify.config";
import {ChronosTimelineControlData} from "./timeline-control.data";
import {ChronosTimelineControlService} from "./timeline-control.service";
import {ChronosToolPlug, ToolbarPlugRegister} from "../../toolbar/toolbar-plug.component";
import {ButtonType} from "../../../core/common/type/button.type";
import Konva from "konva";

/**
 * 时间轴控制面板-组件
 */
@injectable()
export class ChronosTimelineControlComponent 
    extends BaseComponent<ChronosTimelineControlData, ChronosTimelineControlService>
    implements Lifecycle, StageDragListener, ToolbarPlugRegister {

    name = () => "timeline-control"

    constructor(
        @inject(TYPES.ChronosTimelineControlData) data: ChronosTimelineControlData,
        @inject(TYPES.ChronosTimelineControlService) service: ChronosTimelineControlService
    ) {
        super(data, service);
    }

    /**
     * 工具栏插件注册 - 时钟图标
     */
    toolbar(): ChronosToolPlug {
        const graphics = (button: ButtonType) => {
            const r = button.stroke.length / 2;
            // 时钟图标 SVG path
            const path = `
                M0 ${-r}
                A${r} ${r} 0 1 1 0 ${r}
                A${r} ${r} 0 1 1 0 ${-r}
                M0 0 L0 ${-r * 0.6}
                M0 0 L${r * 0.4} 0
            `;
            return new Konva.Path({
                x: 0,
                y: 0,
                data: path,
                stroke: this.data.hide ? button.stroke.color : button.stroke.hoverColor,
                strokeWidth: button.stroke.width,
                lineJoin: 'round',
                lineCap: 'round',
            });
        };

        const callback = (graphics: Konva.Path, button: ButtonType) => {
            graphics.stroke(this.data.hide ? button.stroke.hoverColor : button.stroke.color);
            this.data.hide ? this.service.open() : this.service.close();
        };

        return new ChronosToolPlug("时间轴控制", graphics, callback);
    }

    /**
     * 舞台拖拽监听 - 保持面板位置
     */
    stageDragListen(): void {
        !this.data.hide && this.service.keepPos();
    }

    /**
     * 初始化 - 覆盖默认实现以复用 window layer（不创建新 layer）
     */
    init() {
        // 不调用 super.init() 以避免 applyLayer 创建新图层
        this.data.layer = this.service.setLayer();
    }

    start() {
        !this.data.hide && super.start();
    }

    order(): number {
        return 9998;  // 在 lane-display (9999) 之前
    }
}
