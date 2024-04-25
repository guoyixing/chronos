import {inject, injectable} from "inversify";
import {BaseComponent} from "../../component.interface";
import {Lifecycle} from "../../../core/lifecycle/lifecycle";
import {StageDragListener} from "../../../core/event/event";
import {TYPES} from "../../../config/inversify.config";
import {ChronosLaneDisplayData} from "./lane-display.data";
import {ChronosLaneDisplayService} from "./lane-display.service";
import {ChronosToolPlug, ToolbarPlugRegister} from "../../toolbar/toolbar-plug.component";
import {ButtonType} from "../../../core/common/type/button.type";
import Konva from "konva";

/**
 * 泳道显示控制器-组件
 */
@injectable()
export class ChronosLaneDisplayComponent extends BaseComponent<ChronosLaneDisplayData, ChronosLaneDisplayService>
    implements Lifecycle, StageDragListener, ToolbarPlugRegister {

    /**
     * 组件名称
     */
    name = () => "lane-display"

    constructor(@inject(TYPES.ChronosLaneDisplayData) data: ChronosLaneDisplayData,
                @inject(TYPES.ChronosLaneDisplayService) service: ChronosLaneDisplayService) {
        super(data, service);
    }

    /**
     * 工具栏插件注册
     */
    toolbar(): ChronosToolPlug {

        const graphics = (button: ButtonType) => {
            //线条长度
            const line = button.stroke.length;
            //计算第一个横线的位置
            const y1 = -line / 2;
            //计算第三个横线的位置
            const y2 = line / 2;

            const path = `
            M0 ${y1}h${line}
            M0 0h${line}
            M0 ${y2}h${line}
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

        return new ChronosToolPlug("泳道显示控制器", graphics, callback)
    }

    /**
     * 舞台拖拽监听
     */
    stageDragListen(): void {
        !this.data.hide && this.service.keepPos()
    }

    /**
     * 初始化
     */
    init() {
        this.data.layer = this.service.setLayer()
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
