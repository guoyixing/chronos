import {StageConfig} from "../config/config.stage";
import Konva from "konva";


/**
 * 窗口渲染器
 */
export class RendererWindow {

    private readonly stageConfig: StageConfig

    constructor(stageConfig: StageConfig) {
        this.stageConfig = stageConfig
    }

    draw(): Konva.Stage {
        //创建konva舞台
        let stage = new Konva.Stage({
            container: this.stageConfig.rootElement.id,
            width: this.stageConfig.size.width,
            height: this.stageConfig.size.height
        })
        if (this.stageConfig.showGrid) {
            stage.add(this.drawGrid());
        }
        //绘制
        stage.draw();
        return stage;
    }

    /**
     * 绘制网格
     */
    drawGrid(): Konva.Layer {
        let layer = new Konva.Layer();
        let width = this.stageConfig.size.width;
        let height = this.stageConfig.size.height;
        let grid = this.stageConfig.grid;

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
        return layer;
    }
}