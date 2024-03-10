import Konva from "konva";
import {Context} from "../context/context";
import {DragListener} from "../context/drag.event";

/**
 * 窗口边框
 */
export class ChronosWindow implements DragListener {

    private readonly context: Context

    private readonly _layer: Konva.Layer

    constructor(renderer: Context) {
        this.context = renderer;
        this._layer = this.context.applyLayer('window');
        this.draw();
    }

    get layer() {
        return this._layer
    }

    stageMoveListen() {
        this.limitStageMove();
        this.draw()
    }

    /**
     * 限制舞台的移动范围
     * 不限制x轴移动
     * 限制y轴移动，y轴移动范围是泳道组的高度
     */
    limitStageMove(): void {
        //获取当前舞台的坐标
        const stage = this.context.stage;
        const stageX = stage.x();

        let stageY = stage.y();

        const stageMoveLimit = this.context.stageMoveLimit;
        if (stageY < stageMoveLimit.yTop) {
            stageY = stageMoveLimit.yTop;
        }
        if (stageY > stageMoveLimit.yBottom) {
            stageY = stageMoveLimit.yBottom;
        }
        stage.position({ x: stageX, y: stageY });
    }

    /**
     * 绘制窗体
     * 不能使用rect，因为rect会挡住下面的图层的内容
     */
    draw() {
        const [width, height] = this.context.getSize()
        const coordinate = this.context.getFixedCoordinate()

        //画上边线
        const topLine = new Konva.Line({
            points: [coordinate.x, coordinate.y, coordinate.x + width, coordinate.y],
            stroke: 'black',
            strokeWidth: 1
        });
        //画下边线
        const bottomLine = new Konva.Line({
            points: [coordinate.x, coordinate.y + height, coordinate.x + width, coordinate.y + height],
            stroke: 'black',
            strokeWidth: 1
        });
        //画左边线
        const leftLine = new Konva.Line({
            points: [coordinate.x, coordinate.y, coordinate.x, coordinate.y + height],
            stroke: 'black',
            strokeWidth: 1
        });
        //画右边线
        const rightLine = new Konva.Line({
            points: [coordinate.x + width, coordinate.y, coordinate.x + width, coordinate.y + height],
            stroke: 'black',
            strokeWidth: 1
        });

        //加入图层
        this._layer.add(topLine);
        this._layer.add(bottomLine);
        this._layer.add(leftLine);
        this._layer.add(rightLine);
    }
}
