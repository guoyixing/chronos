import {Context} from "../context/context";
import Konva from "konva";
import {DragListener} from "../context/drag.event";

export class ChronosGrid implements DragListener {

    private readonly context: Context

    constructor(renderer: Context) {
        this.context = renderer;
        this.draw();
        this.stageMoveListen();
    }

    get layer() {
        return this.context.rootLayer
    }

    /**
     * 舞台移动监听
     */
    stageMoveListen() {
        this.draw();
    }

    /**
     * 绘制网格
     */
    draw() {
        const {stageConfig, rootLayer} = this.context;
        const [width, height] = this.context.getSize()
        const grid = stageConfig.grid;
        console.log("grid")
        //获取当前左上角的坐标
        const coordinate = this.context.getFixedCoordinate();

        //计算网格的x起始坐标
        const x = coordinate.x - coordinate.x % grid.size;

        //计算网格的y起始坐标
        const y = coordinate.y - coordinate.y % grid.size;

        //绘制纵线
        for (let i = x; i < x + width + grid.size; i += grid.size) {
            rootLayer.add(new Konva.Line({
                //x开始，y开始，x结束，y结束
                //y开始-网格大小，是为了移动的时候，上方不会出现空白
                //y结束+高度+网格大小，是为了移动的时候，下方不会出现空白
                points: [i, y - grid.size, i, y + height + grid.size],
                stroke: grid.color,
                strokeWidth: grid.width,
            }));
        }

        //绘制横线
        for (let j = y; j < y + height + grid.size; j += grid.size) {
            rootLayer.add(new Konva.Line({
                points: [x - grid.size, j, x + width + grid.size, j],
                stroke: grid.color,
                strokeWidth: grid.width,
            }));
        }
    }
}