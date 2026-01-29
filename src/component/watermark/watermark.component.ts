import {BaseComponent} from "../component.interface";
import {StageDragListener} from "../../core/event/event";
import {Lifecycle} from "../../core/lifecycle/lifecycle";
import {ChronosWatermarkData} from "./watermark.data";
import {ChronosWatermarkService} from "./watermark.service";
import {inject, injectable} from "inversify";
import {TYPES} from "../../config/inversify.config";
import {ChronosToolPlug, ToolbarPlugRegister} from "../toolbar/toolbar-plug.component";
import {ButtonType} from "../../core/common/type/button.type";
import Konva from "konva";

/**
 * 水印-组件
 */
@injectable()
export class ChronosWatermarkComponent extends BaseComponent<ChronosWatermarkData, ChronosWatermarkService>
    implements StageDragListener, Lifecycle, ToolbarPlugRegister {

    /**
     * 组件名称
     */
    name = () => "watermark"

    constructor(@inject(TYPES.ChronosWatermarkData) data: ChronosWatermarkData,
                @inject(TYPES.ChronosWatermarkService) service: ChronosWatermarkService) {
        super(data, service);
    }

    init() {
        this.data.layer = this.data.context.drawContext.rootLayer
    }

    stageDragListen(): void {
        this.service.redraw()
    }

    toolbar(): ChronosToolPlug {
        const graphics = (button: ButtonType) => {
            const size = button.stroke.length;
            const halfSize = size / 2;
            // 水印图标：水滴形状
            // 坐标系统：x 从 0 到 size（中心在 halfSize），y 从 -size/2 到 +size/2
            const r = size * 0.35;  // 水滴底部圆的半径
            const topY = -size * 0.45;  // 水滴顶点
            const bottomY = size * 0.25;  // 水滴底部
            
            // 水滴路径：顶点 -> 右曲线 -> 底部圆弧 -> 左曲线 -> 回到顶点
            const path = `
                M${halfSize} ${topY}
                Q${halfSize + r * 1.2} ${0} ${halfSize + r} ${bottomY}
                A${r} ${r} 0 1 1 ${halfSize - r} ${bottomY}
                Q${halfSize - r * 1.2} ${0} ${halfSize} ${topY}
                Z
            `;
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

        const callback = (graphics: Konva.Path, button: ButtonType) => {
            this.data.hide ? graphics.stroke(button.stroke.hoverColor) : graphics.stroke(button.stroke.color)
            this.data.hide ? this.service.open() : this.service.close()
        }

        return new ChronosToolPlug("水印", graphics, callback)
    }


}
