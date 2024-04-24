import {BaseComponent} from "../component";
import {StageDragListener} from "../../core/event/event";
import {Lifecycle} from "../../core/lifecycle/lifecycle";
import {ChronosWatermarkData} from "./data.watermark.component";
import {ChronosWatermarkService} from "./service.watermark.component";
import {inject, injectable} from "inversify";
import {TYPES} from "../../config/inversify.config";
import {ChronosToolPlug, ToolbarPlugRegister} from "../toolbar/plug.toolbar.component";
import {ButtonType} from "../../common/type/button.type";
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
            //线条长度
            const line = button.stroke.length * 1.5;
            const line_2 = line / 2;
            const line_5_2 = line / 5 * 2;
            const x = line / 8;
            const path = `
            M-${x} -${line_2}v${line_2 + line / 5}
            M-${x} -${line_2}h${line_5_2}
            M-${x} -${line / 6}h${line_5_2}
            M-${x} ${line / 5}h${line_5_2}
            M${-x + line / 5 * 3} ${line_2}v-${line}h${line_5_2}v${line / 3 * 2}h-${line / 5}
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

        const callback = (graphics: Konva.Path, button: ButtonType) => {
            this.data.hide ? graphics.stroke(button.stroke.hoverColor) : graphics.stroke(button.stroke.color)
            this.data.hide ? this.service.open() : this.service.close()
        }

        return new ChronosToolPlug("水印", graphics, callback)
    }


}