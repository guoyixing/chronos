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
        this.service.listenLaneGroup()
    }

    /**
     * 工具栏插件注册
     */
    toolbar(): ChronosToolPlug {

        const graphics = (button: ButtonType) => {
            const size = button.stroke.length;
            const halfSize = size / 2;
            // 日历图标
            // 坐标系统：x 从 0 到 size（中心在 halfSize），y 从 -size/2 到 +size/2
            const w = size * 0.9;  // 日历宽度（放大以与其他图标视觉一致）
            const h = size * 0.8;  // 日历高度
            const hookH = size * 0.18;  // 挂钩高度
            const hookW = size * 0.15;  // 挂钩间距
            
            const left = halfSize - w / 2;
            const top = -h / 2;
            const headerY = top + h * 0.28;  // 日历头部分割线
            
            const path = `
                M${left} ${top}h${w}v${h}h${-w}z
                M${left} ${headerY}h${w}
                M${halfSize - hookW} ${top}v${-hookH}
                M${halfSize + hookW} ${top}v${-hookH}
            `;
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
