import {ComponentService} from "../../../service.component";
import Konva from "konva";
import {ChronosNodeEntryData} from "./data.entry.node.component";
import {ChronosWindowComponent} from "../../../window/window.component";
import {ChronosNodeBarComponent} from "../bar/bar.node.component";
import {ChronosLaneGroupComponent} from "../../../lane/group/group.lane.component";
import {ChronosTimelineComponent} from "../../../timeline/timeline.component";

/**
 * 节点条目-组件服务
 */
export class ChronosNodeEntryService implements ComponentService {

    /**
     * 数据
     */
    private _data: ChronosNodeEntryData

    /**
     * 窗口
     */
    private _window: ChronosWindowComponent

    /**
     * 节点导航窗
     */
    private _bar: ChronosNodeBarComponent

    /**
     * 泳道组
     */
    private _laneGroup: ChronosLaneGroupComponent

    /**
     * 时间轴
     */
    private _timeline: ChronosTimelineComponent

    constructor(data: ChronosNodeEntryData,
                window: ChronosWindowComponent,
                bar: ChronosNodeBarComponent,
                laneGroup: ChronosLaneGroupComponent,
                timeline: ChronosTimelineComponent) {
        this._data = data;
        this._window = window;
        this._bar = bar;
        this._laneGroup = laneGroup;
        this._timeline = timeline;
    }

    /**
     * 绘制
     */
    draw() {
        const data = this._data;
        const laneGroup = this._laneGroup;
        const window = this._window;
        //获取bar
        const node = this._bar.service.getGraphicsByNode(data);

        //移动时候y轴绑定到泳道的行，只允许在奇数行移动
        node.dragBoundFunc((pos) => {
            const lane = laneGroup.service.laneByY(pos.y);
            if (lane === undefined) {
                throw new Error('泳道不存在')
            }
            const y = lane.service.getYByRow(lane.service.getRowByY(pos.y))
            return {
                x: pos.x,
                y: y + data.context.drawContext.stage.y() % laneGroup.data.rowHeight
            };
        });

        //监听移动开始
        let moveRange: Konva.Rect;
        node.on('dragstart', () => {
            moveRange = this.drawMoveRange(node);
        });

        //监听移动
        node.on('dragmove', () => {
            //可移动范围切换到泳道的行
            const moveRangeY = node.y() - laneGroup.data.rowHeight / 2;
            moveRange.y(moveRangeY);
        });

        //监听移动结束
        node.on('dragend', () => {
            //移动结束后，移除移动范围
            moveRange && moveRange.destroy();
            data.coordinate.y = node.y();
            this.updateLane()
            //TODO 更新时间
        });
        data.graphics = node
        data.layer?.add(node);
    }

    /**
     * 绘制移动范围
     * @param node 节点
     */
    drawMoveRange(node: Konva.Shape) {
        const data = this._data;
        //画一个矩形作为移动范围的边界
        const moveRange = new Konva.Rect({
            x: data.context.drawContext.getFixedCoordinate().x,
            y: node.y() - this._laneGroup.data.rowHeight / 2,
            width: this._window.data.width,
            height: this._laneGroup.data.rowHeight,
            fill: data.moveRangeColor,
            stroke: data.moveRangeBorderColor,
            strokeWidth: data.moveRangeBorder
        });
        data.context.drawContext.rootLayer.add(moveRange);
        return moveRange;
    }

    /**
     * 更新坐标
     */
    updateCoordinate() {
        const data = this._data;
        const laneGroup = this._laneGroup;
        const timeline = this._timeline;

        //获取泳道
        const lane = laneGroup.service.laneById(data.laneId);

        console.log(lane, data.row)
        //获取y坐标
        const y = lane?.service.getYByRow(data.row)
        if (y === undefined) {
            throw new Error('泳道不存在')
        }

        //获取x开始坐标
        const xStart = timeline.service.getXByTime(data.startTime)

        //获取x结束坐标
        let xFinish
        if (data.finishTime) {
            xFinish = timeline.service.getXByTime(data.finishTime)
        }

        data.lane = lane;
        data.coordinate = {xStart: xStart, xFinish: xFinish, y: y}
    }

    /**
     * 更新泳道
     */
    updateLane() {
        const data = this._data;
        const laneGroup = this._laneGroup;
        if (data.coordinate.y === undefined) {
            throw new Error('坐标不存在')
        }
        //获取泳道
        const lane = laneGroup.service.laneByY(data.coordinate.y);
        if (lane === undefined) {
            throw new Error('泳道不存在')
        }
        data.lane = lane;
        data.laneId = lane.data.id;
        data.row = lane.service.getRowByY(data.coordinate.y);
    }
}
