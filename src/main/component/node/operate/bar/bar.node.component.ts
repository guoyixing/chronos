import {BaseComponent} from "../../../component";
import {ChronosNodeBarData} from "./data.bar.node.component";
import {ChronosNodeBarService} from "./service.bar.node.component";
import {inject, injectable} from "inversify";
import {TYPES} from "../../../../config/inversify.config";
import {Lifecycle} from "../../../../core/lifecycle/lifecycle";
import {StageDragListener} from "../../../../core/event/event";
import {ChronosToolPlug, ToolbarPlugRegister} from "../../../toolbar/plug.toolbar.component";
import {ButtonType} from "../../../../common/type/button.type";
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
            //线条长度
            const line = button.stroke.length * 1.5;
            const edgeLength = line / 12 * 5;
            //计算第一个方框开始的位置
            const x1 = -line / 8;
            const y1 = -line / 2;
            //计算第二个方框开始的位置
            const x2 = line / 2;
            const y2 = -line / 2;
            //计算第三个方框开始的位置
            const x3 = -line / 8;
            const y3 = line / 12;
            //计算第四个方框开始的位置
            const x4 = line / 2;
            const y4 = line / 12

            const path = `
            M${x1} ${y1}v${edgeLength}h${edgeLength}v${-edgeLength}h${-edgeLength}z
            M${x2} ${y2}v${edgeLength}h${edgeLength}v${-edgeLength}h${-edgeLength}z
            M${x3} ${y3}v${edgeLength}h${edgeLength}v${-edgeLength}h${-edgeLength}z
            M${x4} ${y4}v${edgeLength}h${edgeLength}v${-edgeLength}h${-edgeLength}z
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
