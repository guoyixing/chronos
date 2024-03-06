import Konva from "konva";
import {Context} from "../context/context";

/**
 * 窗口渲染器,网格
 */
export class ChronosWindow {

    private readonly context: Context

    constructor(renderer: Context) {
        this.context = renderer;
        this.drawGrid();
    }

    /**
     * 绘制网格
     */
    drawGrid() {
        const {stageConfig, rootLayer} = this.context;
        const [width, height] = this.context.getSize()
        const grid = stageConfig.grid;

        //绘制纵线
        for (let i = 0; i < width; i += grid.size) {
            rootLayer.add(new Konva.Line({
                points: [i, 0, i, height],
                stroke: grid.color,
                strokeWidth: grid.width,
            }));
        }

        //绘制横线
        for (let j = 0; j < height; j += grid.size) {
            rootLayer.add(new Konva.Line({
                points: [0, j, width, j],
                stroke: grid.color,
                strokeWidth: grid.width,
            }));
        }

        // 4变形边框绘制
        const windowBorder = new Konva.Rect({
            x: this.context.getRelativeX(),
            y: this.context.getRelativeY(),
            width: width,
            height: height,

            // 以下选项属于终端样式配置
            stroke: 'black',
            strokeWidth: 1
        });

        rootLayer.add(windowBorder);
    }
}