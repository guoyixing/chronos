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

        this._layer.add(windowBorder);
    }
}