import {ComponentService} from "../../../service.component";
import {inject, injectable} from "inversify";
import Konva from "konva";
import {ChronosWindowComponent} from "../../../window/window.component";
import {TYPES} from "../../../../config/inversify.config";
import {ChronosNodeBarData} from "./data.bar.node.component";
import {ChronosNodeEntryComponent} from "../entry/entry.node.component";
import {ChronosNodeEntryData} from "../entry/data.entry.node.component";

/**
 * 节点导航窗-组件服务
 */
@injectable()
export class ChronosNodeBarService implements ComponentService {

    /**
     * 数据
     */
    private _data: ChronosNodeBarData

    /**
     * 窗口
     */
    private _window: ChronosWindowComponent

    constructor(@inject(TYPES.ChronosNodeBarData) data: ChronosNodeBarData,
                @inject(TYPES.ChronosWindowComponent) window: ChronosWindowComponent) {
        this._data = data;
        this._window = window;
    }

    /**
     * 绘制
     */
    draw(): void {
        this.drawBackground()
    }

    /**
     * 绘制背景
     */
    drawBackground() {
        const data = this._data;
        const fixedCoordinate = this._data.context.drawContext.getFixedCoordinate();
        const width = data.width ?? 0;
        const height = data.height ?? 0;
        data.startOffSet = data.startOffSet ?? {x: 0, y: 0}

        //绘制背景
        const background = new Konva.Rect({
            x: data.startOffSet.x + fixedCoordinate.x,
            y: data.startOffSet.y + fixedCoordinate.y,
            width: width,
            height: height,
            fill: data.backgroundColor,
            stroke: data.borderColor,
            strokeWidth: data.border,
        });

        const group = new Konva.Group();
        group.add(background);
        this._data.graphics = group;
        this._data.layer?.add(group);
    }

    /**
     * 根据节点获取一个图形
     */
    getGraphicsByNode(nodeData: ChronosNodeEntryData) {
        if (nodeData.type === 'star') {
            return new Konva.Star({
                x: nodeData.coordinate?.xStart,
                y: nodeData.coordinate?.y,
                numPoints: 5,
                innerRadius: 5,
                outerRadius: 10,
                fill: 'yellow',
                stroke: 'black',
                strokeWidth: 1,
                draggable: true,
            });
        }
        throw new Error('未知的节点类型')
    }

    /**
     * 设置起始坐标
     */
    setStartOffSet() {
        const x = this._window.data.width - this._window.data.border - this._data.width;
        let y;
        if (this._data.height == undefined || this._data.height <= 0) {
            y = this._window.data.border;
            this._data.height = this._window.data.height - this._window.data.border * 2;
        } else {
            y = this._window.data.height - this._window.data.border - this._data.height;
        }
        this._data.startOffSet = {x: x, y: y}
    }

    /**
     * 关闭图层
     */
    close() {
        this._data.hide = true;
        this._data.graphics?.destroy();
    }

    /**
     * 开启图层
     */
    open() {
        this._data.hide = false;
        this.draw();
    }

    /**
     * 获取图层
     */
    setLayer() {
        return this._window.data.layer;
    }


}
