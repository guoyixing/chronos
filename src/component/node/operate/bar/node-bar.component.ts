import {BaseComponent} from "../../../component.interface";
import {ChronosNodeBarData} from "./node-bar.data";
import {ChronosNodeBarService} from "./node-bar.service";
import {inject, injectable} from "inversify";
import {TYPES} from "../../../../config/inversify.config";
import {Lifecycle} from "../../../../core/lifecycle/lifecycle";
import {StageDragListener} from "../../../../core/event/event";
import {ChronosToolPlug, ToolbarPlugRegister} from "../../../toolbar/toolbar-plug.component";
import {ButtonType} from "../../../../core/common/type/button.type";
import Konva from "konva";

/**
 * 节点导航窗-组件
 */
@injectable()
export class ChronosNodeBarComponent extends BaseComponent<ChronosNodeBarData, ChronosNodeBarService>
    implements Lifecycle, StageDragListener, ToolbarPlugRegister {

    /**
     * 组件名称
     */
    name = () => "node-bar"

    constructor(@inject(TYPES.ChronosNodeBarData) data: ChronosNodeBarData,
                @inject(TYPES.ChronosNodeBarService) service: ChronosNodeBarService) {
        super(data, service);
    }

    /**
     * 工具栏插件注册
     */
    toolbar(): ChronosToolPlug {

        const graphics = (button: ButtonType) => {
            const size = button.stroke.length;
            const halfSize = size / 2;
            // 节点导航图标：四个小方块（2x2网格布局）
            // 坐标系统：x 从 0 到 size（中心在 halfSize），y 从 -size/2 到 +size/2
            const boxSize = size * 0.35;  // 每个方块的大小
            const gap = size * 0.1;       // 方块之间的间距
            
            // 四个方块的位置（以 halfSize, 0 为中心）
            const x1 = halfSize - gap / 2 - boxSize;  // 左列
            const x2 = halfSize + gap / 2;             // 右列
            const y1 = -gap / 2 - boxSize;             // 上行
            const y2 = gap / 2;                        // 下行

            const path = `
                M${x1} ${y1}h${boxSize}v${boxSize}h${-boxSize}z
                M${x2} ${y1}h${boxSize}v${boxSize}h${-boxSize}z
                M${x1} ${y2}h${boxSize}v${boxSize}h${-boxSize}z
                M${x2} ${y2}h${boxSize}v${boxSize}h${-boxSize}z
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

        return new ChronosToolPlug("节点", graphics, callback)
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
