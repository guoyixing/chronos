import {inject, injectable} from "inversify";
import {ChronosJumpTimelineData} from "./data.jump.timeline.component";
import {ChronosJumpTimelineService} from "./service.jump.timeline.component";
import {StageDragListener} from "../../../core/event/event";
import {Lifecycle} from "../../../core/lifecycle/lifecycle";
import {ChronosToolPlug, ToolbarPlugRegister} from "../../toolbar/plug.toolbar.component";
import {BaseComponent} from "../../component";
import {TYPES} from "../../../config/inversify.config";
import {ButtonType} from "../../../common/type/button.type";
import Konva from "konva";
import {ChronosToolbarData} from "../../toolbar/data.toolbar.component";
import {ChronosWindowComponent} from "../../window/window.component";

/**
 * 时间轴跳转-组件
 */
@injectable()
export class ChronosJumpTimelineComponent extends BaseComponent<ChronosJumpTimelineData, ChronosJumpTimelineService>
    implements StageDragListener, Lifecycle, ToolbarPlugRegister {

    /**
     * 组件名称
     */
    name = () => "jumpTimeline"

    constructor(@inject(TYPES.ChronosJumpTimelineData) data: ChronosJumpTimelineData,
                @inject(TYPES.ChronosJumpTimelineService) service: ChronosJumpTimelineService) {
        super(data, service);
    }

    init() {
        const window = this.data.context.ioc.get<ChronosWindowComponent>(TYPES.ChronosWindowComponent);
        this.data.layer = window.data.layer
    }

    stageDragListen(): void {
        if (this.data.hide) {
            return
        }
        this.service.close()
        this.service.open()
    }

    /**
     * 工具栏插件注册
     */
    toolbar(): ChronosToolPlug {

        const graphics = (button: ButtonType) => {
            //线条长度
            const line = button.stroke.length * 1.5;

            const path = `
            M-${line / 8} -${line / 2}h${line}v${line}h-${line}z
            M-${line / 8} -${line / 2 - line / 4}h${line}
            M${line / 8} 0h${line / 2}
            M${line / 8} ${line / 2 - line / 4}h${line / 2}
            `

            return new Konva.Path({
                x: 0,
                y: 0,
                data: path,
                stroke: this.data.hide ? button.stroke.color : button.stroke.hoverColor,
                strokeWidth: button.stroke.width,
                lineJoin: 'round',
                lineCap: 'round',
            })
        }

        const callback = (graphics: Konva.Path, button: ButtonType, toolbar: ChronosToolbarData) => {
            this.data.hide ? graphics.stroke(button.stroke.hoverColor) : graphics.stroke(button.stroke.color)
            this.data.hide ? this.service.open() : this.service.close()
        }

        return new ChronosToolPlug("时间轴跳转", graphics, callback)
    }

    order(): number {
        return 9999
    }
}