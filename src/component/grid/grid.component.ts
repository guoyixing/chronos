import {inject, injectable} from "inversify";
import {BaseComponent} from "../component.interface";
import {MouseMoveListener, ResizeListener, StageDragListener} from "../../core/event/event";
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
    implements StageDragListener, MouseMoveListener, ResizeListener, Lifecycle, ToolbarPlugRegister {

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
            const size = button.stroke.length;
            const halfSize = size / 2;
            // 网格图标：两条竖线 + 两条横线
            // 坐标系统：x 从 0 到 size（中心在 halfSize），y 从 -size/2 到 +size/2
            const vX1 = halfSize - size / 6;  // 左竖线
            const vX2 = halfSize + size / 6;  // 右竖线
            const hY1 = -size / 6;  // 上横线
            const hY2 = size / 6;   // 下横线
            const halfLen = size / 2;
            
            const path = `
                M${vX1} ${-halfLen}v${size}
                M${vX2} ${-halfLen}v${size}
                M${halfSize - halfLen} ${hY1}h${size}
                M${halfSize - halfLen} ${hY2}h${size}
            `;
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
     * 视口尺寸变化监听
     */
    resizeListen(_width: number, _height: number): void {
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
