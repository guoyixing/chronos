import {ComponentService} from "../../../service.component";
import Konva from "konva";
import {ChronosNodeEntryData} from "./data.entry.node.component";
import {ChronosWindowComponent} from "../../../window/window.component";
import {ChronosNodeBarComponent} from "../bar/bar.node.component";
import {ChronosLaneGroupComponent} from "../../../lane/group/group.lane.component";
import {ChronosTimelineComponent} from "../../../timeline/timeline.component";
import {NodeShape} from "../../board/shape/NodeShape";
import {ChronosNodeGroupComponent} from "../group/group.node.component";
import {EVENT_TYPES} from "../../../../core/event/event";

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

    /**
     * 时间轴
     */
    private _nodeGroup: ChronosNodeGroupComponent


    constructor(data: ChronosNodeEntryData,
                window: ChronosWindowComponent,
                bar: ChronosNodeBarComponent,
                laneGroup: ChronosLaneGroupComponent,
                timeline: ChronosTimelineComponent,
                nodeGroup: ChronosNodeGroupComponent) {
        this._data = data;
        this._window = window;
        this._bar = bar;
        this._laneGroup = laneGroup;
        this._timeline = timeline;
        this._nodeGroup = nodeGroup;
    }

    /**
     * 绘制
     */
    draw() {
        const data = this._data;
        const laneGroup = this._laneGroup;
        //获取bar
        const nodeShape = this._bar.service.getGraphicsByNode(data);

        const node = nodeShape.shape;
        //移动时候y轴绑定到泳道的行，只允许在奇数行移动
        node?.dragBoundFunc((pos) => {
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
        node?.on('dragstart', () => {
            moveRange = this.drawMoveRange(nodeShape);
        });

        //监听移动
        node?.on('dragmove', () => {
            //可移动范围切换到泳道的行
            const moveRangeY = node?.y() - laneGroup.data.rowHeight / 2;
            moveRange.y(moveRangeY);
        });

        //监听移动结束
        node?.on('dragend', () => {
            //移动结束后，移除移动范围
            moveRange && moveRange.destroy();
            this.updateLane()
            this.updateTime()
        });
        data.graphics = nodeShape
        node && data.layer?.add(node);
    }

    /**
     * 绘制移动范围
     * @param node 节点
     */
    drawMoveRange(node: NodeShape) {
        const data = this._data;
        //画一个矩形作为移动范围的边界
        const moveRange = new Konva.Rect({
            x: data.context.drawContext.getFixedCoordinate().x,
            y: node.coordinate().y - this._laneGroup.data.rowHeight / 2,
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
    initCoordinate() {
        const data = this._data;
        const laneGroup = this._laneGroup;
        const timeline = this._timeline;

        //获取泳道
        const lane = laneGroup.service.laneById(data.laneId);

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
     * 跟随泳道移动
     */
    followLane() {
        const data = this._data;
        const lane = data.lane;
        //原始位置
        let originalPosition: number | undefined;

        //监听移动开始
        lane?.data.graphics?.on('dragstart', () => {
            originalPosition = data.graphics?.shape?.y();
        });

        //监听泳道的移动
        lane?.data.graphics?.on('dragmove', () => {
            const offSetY = lane?.data.graphics?.y();
            if (originalPosition != undefined && offSetY != undefined) {
                data.graphics?.shape?.y(originalPosition + offSetY)
            }
        });

    }

    /**
     * 监听泳道重绘
     */
    listenReDrawLane() {
        const data = this._data;
        const lane = data.lane;
        //监听泳道重绘
        lane?.on(EVENT_TYPES.ReDraw, () => {
            data.graphics?.shape?.destroy()
            data.graphics = undefined
            this.initCoordinate();
            this.followLane()
            this.draw()
        });
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

    /**
     * 更新时间
     */
    updateTime() {
        const data = this._data;
        const timeline = this._timeline;
        if (data.coordinate.xStart === undefined) {
            throw new Error('开始时间不存在')
        }
        data.startTime = timeline.service.getTimeByX(data.coordinate.xStart);
        if (data.coordinate.xFinish !== undefined){
            data.finishTime = timeline.service.getTimeByX(data.coordinate.xFinish);
        }
    }
}
