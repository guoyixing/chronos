import Konva from "konva";
import {StageGroup} from "../config/config.type";

/**
 * 窗口渲染器,网格
 */
export class RendererWindow {

    /**
     * 绘制网格
     */
    drawGrid(layer: Konva.Layer, {config, stage}: StageGroup) {
        const width = config.size.width;
        const height = config.size.height;
        const grid = config.grid;

        //绘制纵线
        for (let i = 0; i < width; i += grid.size) {
            layer.add(new Konva.Line({
                points: [i, 0, i, height],
                stroke: grid.color,
                strokeWidth: grid.width,
            }));
        }

        //绘制横线
        for (let j = 0; j < height; j += grid.size) {
            layer.add(new Konva.Line({
                points: [0, j, width, j],
                stroke: grid.color,
                strokeWidth: grid.width,
            }));
        }
        stage.add(layer)
    }
}