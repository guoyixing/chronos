import {ChronosHolidayData} from "./holiday.data";
import {ChronosHolidayService} from "./holiday.service";
import {BaseComponent} from "../component.interface";
import {inject, injectable} from "inversify";
import {Lifecycle} from "../../core/lifecycle/lifecycle";
import {TYPES} from "../../config/inversify.config";
import {ChronosToolPlug, ToolbarPlugRegister} from "../toolbar/toolbar-plug.component";
import {ButtonType} from "../../core/common/type/button.type";
import Konva from "konva";

/**
 * 假期-组件
 */
@injectable()
export class ChronosHolidayComponent extends BaseComponent<ChronosHolidayData, ChronosHolidayService>
    implements Lifecycle, ToolbarPlugRegister {

    /**
     * 组件名称
     */
    name = () => "holiday"

    constructor(@inject(TYPES.ChronosHolidayData) data: ChronosHolidayData,
                @inject(TYPES.ChronosHolidayService) service: ChronosHolidayService) {
        super(data, service);
    }

    init() {
        this.data.layer = this.data.context.drawContext.rootLayer
        this.service.listenScale()
    }

    /**
     * 工具栏插件注册
     */
    toolbar(): ChronosToolPlug {

        const graphics = (button: ButtonType) => {
            //线条长度
            const line = button.stroke.length * 1.5;

            const path = `
            M-${line / 8} -${line / 4}h${line}v${line / 4 * 3}h-${line}z
            M${line / 7} -${line / 4}v-${line / 4}h${line / 2}v${line / 4}
            M${line / 4} -${line / 8}v${line / 2}
            M${line / 2} -${line / 8}v${line / 2}
            `
            const color = this.data.hide ? button.stroke.color : button.stroke.hoverColor;

            return new Konva.Path({
                x: 0,
                y: 0,
                data: path,
                stroke: this.data.holiday.length > 0 ? color : button.stroke.disabledColor,
                strokeWidth: button.stroke.width,
                lineJoin: 'round',
                lineCap: 'round',
            })
        }

        const callback = (graphics: Konva.Path, button: ButtonType) => {
            if (this.data.holiday.length > 0) {
                this.data.hide ? graphics.stroke(button.stroke.hoverColor) : graphics.stroke(button.stroke.color)
                this.data.hide ? this.service.open() : this.service.close()
            }
        }

        return new ChronosToolPlug("假期", graphics, callback)
    }

}
