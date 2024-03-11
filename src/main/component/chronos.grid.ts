import {Context} from "../context/context";
import Konva from "konva";
import {DragListener} from "../context/drag.event";

/**
 * 网格组件
 */
export class ChronosGrid implements DragListener {

    private readonly context: Context

    /**
     * 网格横线坐标
     */
    private xLine: number[] = []

    /**
     * 网格纵线坐标
     */
    private yLine: number[] = []

    /**
     * 点
     */
    private point: Konva.Circle | null = null;

    constructor(renderer: Context) {
        this.context = renderer;
        //注册监听
        this.stageMoveListen();
        if (this.context.stageConfig.grid.point) {
            this.mouseMoveListen();
        }
        this.context.registerComponent("grid", this);
    }

    get layer() {
        return this.context.rootLayer
    }

    /**
     * 获取点的坐标
     */
    getPoint() {
        return this.point ? {x: this.point.x(), y: this.point.y()} : null;
    }

    /**
     * 舞台移动监听
     */
    stageMoveListen() {
        this.draw();
    }

    /**
     * 鼠标移动监听
     */
    mouseMoveListen() {
        //TODO 后续统一监听
        this.context.stage.on('mousemove', () => {
            this.drawPoint();
        });
    }

    /**
     * 绘制网格
     */
    draw() {
        //清空网格坐标
        this.xLine = [];
        this.yLine = [];

        const {stageConfig, rootLayer} = this.context;
        const [width, height] = this.context.getSize()
        const grid = stageConfig.grid;

        //获取当前左上角的坐标
        const coordinate = this.context.getFixedCoordinate();

        //计算网格的x起始坐标
        const x = coordinate.x - coordinate.x % grid.size;

        //计算网格的y起始坐标
        const y = coordinate.y - coordinate.y % grid.size;

        //绘制纵线
        for (let i = x; i < x + width + grid.size; i += grid.size) {
            this.xLine.push(i);
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
            this.yLine.push(j);
            rootLayer.add(new Konva.Line({
                points: [x - grid.size, j, x + width + grid.size, j],
                stroke: grid.color,
                strokeWidth: grid.width,
            }));
        }
    }

    /**
     * 绘制鼠标移动到网格上的点
     */
    drawPoint() {
        //获取鼠标位置
        const pointerPosition = this.context.stage.getPointerPosition();
        if (!pointerPosition) {
            return;
        }
        const fixedCoordinate = this.context.getFixedCoordinate();
        const mouseX = pointerPosition.x + fixedCoordinate.x;
        const mouseY = pointerPosition.y + fixedCoordinate.y;

        //获取x线与鼠标最近的坐标
        const x = this.xLine.reduce((prev, curr) => {
            return (Math.abs(curr - mouseX) < Math.abs(prev - mouseX) ? curr : prev);
        })

        //获取y线与鼠标最近的坐标
        const y = this.yLine.reduce((prev, curr) => {
            return (Math.abs(curr - mouseY) < Math.abs(prev - mouseY) ? curr : prev);
        })

        //清空点
        if (this.point) {
            this.point.remove();
        }

        //绘制点
        this.point = new Konva.Circle({
            x: x,
            y: y,
            radius: 3,
            fill: '#DD0000',
        });

        //绘制点
        this.layer.add(this.point);
    }
}
