import {Context} from "../../context/context";
import Konva from "konva";
import {ChronosGrid} from "../chronos.grid";

/**
 * 画笔
 */
export class ChronosNodeBrush {

    /**
     * 上下文
     */
    private readonly context: Context

    /**
     * 图层
     */
    private readonly _layer: Konva.Layer

    /**
     * 线条组
     */
    lineGroup: Array<ChronosNodeLine> = []

    /**
     * 线条组是否闭合
     */
    private _isClose: boolean = false;


    constructor(context: Context) {
        this.context = context;
        //申请图层
        this._layer = this.context.applyLayer('nodeBrush')
        this.stageClickListen()
        this.mouseMoveListen()
    }

    /**
     * 监听鼠标点击
     */
    stageClickListen() {
        //TODO 后续统一监听
        this.context.stage.on('click', () => {
            this.addLine();
            this._layer.destroyChildren()
            this.draw();
        });
    }

    /**
     * 鼠标移动监听
     */
    mouseMoveListen() {
        //TODO 后续统一监听
        this.context.stage.on('mousemove', () => {
            if (!this._isClose) {
                //没有闭合
                this._layer.destroyChildren()
                this.draw();
            }
        });
    }

    /**
     * 绘制线条
     */
    draw() {
        if (this.lineGroup.length <= 0) {
            return
        }

        //标记出起点，画一个圆
        this.drawStartPoint();

        //判断是否是闭合图形
        let line
        if (this._isClose) {
            //绘制图形
            line = this.drawShape();
        } else {
            line = this.drawLine();
        }
        this._layer.add(line)

        //标记出终点，画一个圆
        this.drawEndPoint()

    }

    /**
     * 判断是否是闭合图形
     */
    private setClose() {
        this._isClose = this.lineGroup.length > 1
            && this.lineGroup[this.lineGroup.length - 1].end.x === this.lineGroup[0].start.x
            && this.lineGroup[this.lineGroup.length - 1].end.y === this.lineGroup[0].start.y;
        console.log(this._isClose)
    }

    /**
     * 绘制起点
     */
    private drawEndPoint() {
        if (this._isClose) {
            //如果是闭合图形，那么就不需要绘制
            return
        }

        const end = this.lineGroup[this.lineGroup.length - 1];
        const circle = new Konva.Circle({
            x: end.start.x,
            y: end.start.y,
            radius: 2,
            fill: '#DD0000',
        });
        this._layer.add(circle)
    }

    /**
     * 绘制起点
     */
    private drawStartPoint() {
        const start = this.lineGroup[0];
        const circle = new Konva.Circle({
            x: start.start.x,
            y: start.start.y,
            radius: 2,
            fill: '#DD0000',
        });
        this._layer.add(circle)
    }

    /**
     * 绘制线
     */
    private drawLine() {
        const pointArray: number[] = []
        this.lineGroup.forEach((line) => {
            pointArray.push(line.start.x, line.start.y)
        })

        //添加鼠标瞄准的点，获取网格红点的位置
        const component = this.context.getComponent("grid") as ChronosGrid;
        const point = component.getPoint();
        if (point) {
            pointArray.push(point.x, point.y)
        }
        return new Konva.Line({
            points: pointArray,
            stroke: 'black',
            strokeWidth: 2
        });
    }

    /**
     * 绘制图形
     */
    private drawShape() {
        return new Konva.Shape({
            sceneFunc: (context, shape) => {
                context.beginPath();
                const start = this.lineGroup[0];
                context.moveTo(start.start.x, start.start.y);

                for (let i = 1; i < this.lineGroup.length; i++) {
                    const line = this.lineGroup[i];
                    context.lineTo(line.start.x, line.start.y);
                }
                context.closePath();
                context.fillStrokeShape(shape);
            },
            stroke: 'black',
            strokeWidth: 2
        });
    }

    /**
     * 添加线条
     */
    addLine() {
        //获取网格红点的位置
        const component = this.context.getComponent("grid") as ChronosGrid;
        const point = component.getPoint();

        if (!point) {
            return
        }
        //获取上一个点
        const last = this.lineGroup[this.lineGroup.length - 1];

        //如果上一个线的起点和当前线的起点一样，那么就不添加
        if (last && last.start.x === point.x && last.start.y === point.y) {
            return
        }
        const line = new ChronosNodeLine(point);
        if (last) {
            last.end = point;
        }
        this.lineGroup.push(line)

        //判断线条组是否闭合
        this.setClose();
    }

}


/**
 * 点
 */
export class ChronosNodeLine {
    /**
     * 起点
     */
    start: { x: number, y: number }

    /**
     * 终点
     */
    end: { x: number, y: number }


    constructor(start: { x: number; y: number }, end?: { x: number; y: number }) {
        this.start = start;
        this.end = end || {x: start.x, y: start.y};
    }
}