import Konva from "konva";
import {Context} from "../context/context";

/**
 * 窗口渲染器,网格
 */
export class ChronosWindow {

    private readonly context: Context

    private layer: Konva.Layer

    constructor(renderer: Context) {
        this.context = renderer;
        this.layer = this.context.applyLayer('window');
        this.draw();
        this.stageMoveListen();
    }

    stageMoveListen() {
        this.context.stage.on('dragmove', () => {
            this.layer.destroyChildren();
            this.draw();
        });
    }

    /**
     * 绘制窗体
     */
    draw() {
        const [width, height] = this.context.getSize()
        const coordinate = this.context.getFixedCoordinate()

        // 4变形边框绘制
        const windowBorder = new Konva.Rect({
            x: coordinate.x,
            y: coordinate.y,
            width: width,
            height: height,

            // 以下选项属于终端样式配置
            stroke: 'black',
            strokeWidth: 1
        });

        this.layer.add(windowBorder);
    }
}