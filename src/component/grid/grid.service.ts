import {ComponentService} from "../component-service.interface";
import {inject, injectable} from "inversify";
import Konva from "konva";
import {ChronosGridData} from "./grid.data";
import {TYPES} from "../../config/inversify.config";
import {ChronosWindowComponent} from "../window/window.component";
import {ChronosScaleComponent} from "../scale/scale.component";
import {EVENT_TYPES} from "../../core/event/event";

/**
 * 网格-组件服务
 */
@injectable()
export class ChronosGridService implements ComponentService {
    /**
     * 数据
     */
    private _data: ChronosGridData

    /**
     * 窗口
     */
    private _window: ChronosWindowComponent

    /**
     * 比例尺
     */
    private _scale: ChronosScaleComponent

    constructor(@inject(TYPES.ChronosGridData) data: ChronosGridData,
                @inject(TYPES.ChronosWindowComponent) window: ChronosWindowComponent,
                @inject(TYPES.ChronosScaleComponent) scale: ChronosScaleComponent) {
        this._data = data
        this._window = window
        this._scale = scale
    }

    /**
     * 绘制
     */
    draw(): void {
        if (this._data.hide) {
            return
        }
        //清空网格坐标
        this._data.xLine = [];
        this._data.yLine = [];

        const startOffSet = this._data.startOffSet;

        const group = new Konva.Group({x: startOffSet.x, y: startOffSet.y});
        this._data.graphics = group;

        const {width, height} = this._window.service.getVisualRange()
        const borderSize = this._window.data.border * 2;
        const tbGapSize = this._data.tbGapSize;
        const lrGapSize = this._data.lrGapSize;
        const rootLayer = this._data.context.drawContext.rootLayer;

        //获取当前左上角的坐标
        const coordinate = this._data.context.drawContext.getFixedCoordinate();

        //计算网格的x起始坐标
        const offSetX = startOffSet.x + startOffSet.x % lrGapSize;
        const x = coordinate.x - offSetX - coordinate.x % lrGapSize - borderSize;

        //计算网格的y起始坐标
        const y = coordinate.y - startOffSet.y - startOffSet.y % tbGapSize - coordinate.y % tbGapSize;

        //绘制纵线
        for (let i = x; i < x + width + lrGapSize; i += lrGapSize) {
            this._data.xLine.push(i);
            group.add(new Konva.Line({
                //x开始，y开始，x结束，y结束
                //y开始-网格大小，是为了移动的时候，上方不会出现空白
                //y结束+高度+网格大小，是为了移动的时候，下方不会出现空白
                points: [i, y - lrGapSize, i, y + height + lrGapSize],
                stroke: this._data.color,
                strokeWidth: this._data.width,
            }));
        }

        //绘制横线
        for (let j = y; j < y + height + tbGapSize; j += tbGapSize) {
            this._data.yLine.push(j);
            group.add(new Konva.Line({
                points: [x - tbGapSize, j, x + width + tbGapSize + offSetX, j],
                stroke: this._data.color,
                strokeWidth: this._data.width,
            }));
        }

        rootLayer.add(group);
        group.moveToBottom()
    }

    /**
     * 绘制鼠标移动到网格上的点
     */
    drawPoint() {
        if (this._data.hidePoint) {
            return;
        }
        //获取鼠标位置
        const pointerPosition = this._data.context.drawContext.stage.getPointerPosition();
        if (!pointerPosition) {
            return;
        }
        const fixedCoordinate = this._data.context.drawContext.getFixedCoordinate();
        const mouseX = pointerPosition.x + fixedCoordinate.x;
        const mouseY = pointerPosition.y + fixedCoordinate.y;

        //获取x线与鼠标最近的坐标
        const x = this._data.xLine.reduce((prev, curr) => {
            return (Math.abs(curr - mouseX) < Math.abs(prev - mouseX) ? curr : prev);
        })

        //获取y线与鼠标最近的坐标
        const y = this._data.yLine.reduce((prev, curr) => {
            return (Math.abs(curr - mouseY) < Math.abs(prev - mouseY) ? curr : prev);
        })

        //清空点
        this._data.point?.remove();

        //绘制点
        this._data.point = new Konva.Circle({
            x: x,
            y: y,
            radius: this._data.pointRadius,
            fill: this._data.pointColor,
        });

        //绘制点
        this._data.layer?.add(this._data.point);
    }

    /**
     * 监听比例尺
     */
    listenScale() {
        const lrGapSize = this._data.lrGapSize;
        this._scale.service.on(EVENT_TYPES.ScaleUpdate, () => {
            this._data.lrGapSize = this._scale.data.scaleX * lrGapSize;
        })

        this._scale.service.on(EVENT_TYPES.ScaleReDraw, () => {
            this._data.graphics?.destroy()
            this.draw()
        })
    }
}
