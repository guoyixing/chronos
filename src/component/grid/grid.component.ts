import {inject, injectable} from "inversify";
import {BaseComponent} from "../component.interface";
import {MouseMoveListener, StageDragListener} from "../../core/event/event";
import {Lifecycle} from "../../core/lifecycle/lifecycle";
import {ChronosGridData} from "./grid.data";
import {ChronosGridService} from "./grid.service";
import {TYPES} from "../../config/inversify.config";
import {ChronosToolPlug, ToolbarPlugRegister} from "../toolbar/toolbar-plug.component";
import Konva from "konva";
import {ButtonType} from "../../core/common/type/button.type";

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
        const graphics = (button: ButtonType) => {
            //线条长度
            const line = button.stroke.length;
            //计算竖线开始的位置
            const vY = -line / 2;
            const vX = line / 3;
            //计算横线开始的位置
            const hY = line / 6;
            const path = `M${vX} ${vY}v${line}M${vX * 2} ${vY}v${line}M0 ${hY}h${line}M0 ${-hY}h${line}`
            return new Konva.Path({
                x: 0,
                y: 0,
                data: path,
                stroke: this.data.hide ? button.stroke.color : button.stroke.hoverColor,
                strokeWidth: button.stroke.width,
                lineCap: 'round',
                lineJoin: 'round'
            })
        }

        const callback = (graphics: Konva.Path, button: ButtonType) => {
            this.data.hide = !this.data.hide
            if (this.data.hide) {
                graphics.stroke(button.stroke.color)
            } else {
                graphics.stroke(button.stroke.hoverColor)
            }
            this.data.graphics?.destroy()
            this.service.draw()
        }

        return new ChronosToolPlug("网格", graphics, callback)
    }


    /**
     * 初始化
     */
    init() {
        this.data.layer = this.data.context.drawContext.rootLayer
        this.service.listenScale()
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
