import {ComponentService} from "../../../service.component";
import Konva from "konva";
import {ChronosNodeEntryData} from "./data.entry.node.component";
import {ChronosWindowComponent} from "../../../window/window.component";
import {ChronosNodeBarComponent} from "../bar/bar.node.component";
import {ChronosLaneGroupComponent} from "../../../lane/group/group.lane.component";
import {ChronosTimelineComponent} from "../../../timeline/timeline.component";
import {NodeShape} from "../../board/shape/NodeShape";
import {ChronosNodeGroupComponent} from "../group/group.node.component";
import {EVENT_TYPES, EventPublisher} from "../../../../core/event/event";
import {ChronosNodeTransformerComponent} from "../transformer/transformer.node.component";
import {ChronosNodeDetailComponent} from "../detail/detail.node.component";

/**
 * 节点条目-组件服务
 */
export class ChronosNodeEntryService implements ComponentService, EventPublisher {

    /**
     * 组件ID
     */
    id: string

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
     * 节点组
     */
    private _nodeGroup: ChronosNodeGroupComponent

    /**
     * 节点变形器
     */
    private _nodeTransformer: ChronosNodeTransformerComponent

    /**
     * 节点详情
     */
    private _nodeDetail: ChronosNodeDetailComponent


    constructor(data: ChronosNodeEntryData,
                window: ChronosWindowComponent,
                bar: ChronosNodeBarComponent,
                laneGroup: ChronosLaneGroupComponent,
                timeline: ChronosTimelineComponent,
                nodeGroup: ChronosNodeGroupComponent,
                nodeTransformer: ChronosNodeTransformerComponent,
                nodeDetail:ChronosNodeDetailComponent) {
        this._data = data;
        this._window = window;
        this._bar = bar;
        this._laneGroup = laneGroup;
        this._timeline = timeline;
        this._nodeGroup = nodeGroup;
        this._nodeTransformer = nodeTransformer;
        this._nodeDetail = nodeDetail;
        this.id = "nodeEntry" + this._data.id
    }

    /**
     * 绘制
     */
    draw() {
        const data = this._data;
        if (data.hidden){
            return
        }
        //获取bar
        const nodeShape = this._bar.service.getGraphicsByNode(data);
        const node = nodeShape.shape;

        //监听移动
        this.listenMove(nodeShape)
        //监听点击
        this.listenClick(nodeShape)
        //监听悬浮
        this.listenMouseOver(nodeShape)

        data.graphics = nodeShape
        node && data.layer?.add(node);
    }

    /**
     * 重绘
     */
    reDraw() {
        const data = this._data;
        data.graphics?.shape?.destroy()
        data.graphics = undefined
        this.initCoordinate();
        this.followLane()
        this.draw()
        this.publish(EVENT_TYPES.ReDraw)
    }

    /**
     * 监听移动
     * @param nodeShape 节点
     */
    listenMove(nodeShape: NodeShape) {
        const data = this._data;
        const node = nodeShape.shape;
        const laneGroup = this._laneGroup;

        //移动时候y轴绑定到泳道的行，只允许在奇数行移动
        node?.dragBoundFunc((pos) => {
            const lane = laneGroup.service.laneByY(pos.y);
            if (lane === undefined) {
                throw new Error('泳道不存在')
            }
            const y = lane.service.getYByRow(lane.service.getRowByY(pos.y))
            if (y === undefined) {
                throw new Error('行不存在')
            }
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
            this.clearFollowLane()
            this.updateLane()
            this.updateTime()
            this.followLane()
            this.publish(EVENT_TYPES.Drag)
        });
    }

    /**
     * 监听移动
     * @param nodeShape 节点
     */
    listenClick(nodeShape: NodeShape) {
        const data = this._data;
        const node = nodeShape.shape;
        if (nodeShape.transformable) {
            node?.on('click', () => {
                this._nodeTransformer.data.bindNodeId = data.id;
                this._nodeTransformer.service.draw()
            })
        }
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
            data.hidden = true
            console.warn('节点'+data.id+'，无法获取到所在行')
            return
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
        data.lane?.service.follow(
            data.id,
            () => data.graphics?.shape?.y(),
            (y) => data.graphics?.shape?.y(y)
        )
    }

    /**
     * 清除跟随泳道移动
     */
    clearFollowLane() {
        const data = this._data;
        data.lane?.service.clearFollow(data.id)
    }


    /**
     * 监听泳道重绘
     */
    listenReDrawLane() {
        //监听泳道重绘
        this._data.lane?.service.on(EVENT_TYPES.ReDraw, () => {
            this.reDraw()
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
        if (data.coordinate.xFinish !== undefined) {
            data.finishTime = timeline.service.getTimeByX(data.coordinate.xFinish);
        }
    }

    /**
     * 跟随节点移动
     */
    follow(id: String,
           getX: () => number | undefined,
           setX: (y: number) => void,
           setY: (y: number) => void): void {
        const data = this._data;
        const shape = data.graphics?.shape;
        //原始位置X
        let originalPositionX: number | undefined;
        let originalNodeEntryPositionX: number | undefined;
        //监听节点的X轴移动开始
        shape?.on('dragstart.followNodeEntryX' + id, () => {
            originalPositionX = getX();
            originalNodeEntryPositionX = shape?.x()
        });

        //监听节点的X轴移动
        shape?.on('dragmove.followNodeEntryX' + id, () => {
            const offSetX = shape?.x();
            if (originalPositionX != undefined && offSetX != undefined && originalNodeEntryPositionX != undefined) {
                setX(originalPositionX + (offSetX - originalNodeEntryPositionX))
            }
        });
        //监听节点的Y轴移动
        shape?.on('dragmove.followNodeEntryY' + id, () => {
            const offSetY = shape?.y();
            if (offSetY != undefined) {
                setY(offSetY)
            }
        });
    }

    /**
     * 鼠标悬浮显示详情
     */
    listenMouseOver(nodeShape: NodeShape) {
        const data = this._data;
        const node = nodeShape.shape;
        if (node) {
            node.on('mouseover', () => {
                this._nodeDetail.data.bindNodeId = data.id;
                this._nodeDetail.service.draw()
            });
            node.on('mouseout', () => {
                this._nodeDetail.service.clear()
            });
        }
    }

    /**
     * 清除跟随节点移动
     */
    clearFollow(id: String): void {
        const data = this._data;
        data.graphics?.shape?.off('dragstart.followNodeEntryX' + id);
        data.graphics?.shape?.off('dragmove.followNodeEntryX' + id);
        data.graphics?.shape?.off('dragmove.followNodeEntryY' + id);
    }


    /**
     * 事件绑定
     * @param event 事件名称
     * @param callback 回调
     */
    on(event: symbol, callback: (data?: any) => void): void {
        const eventManager = this._data.context.eventManager;
        eventManager?.listen(this, event, callback)
    }

    /**
     * 发布事件
     * @param event 事件名称
     */
    publish(event: symbol): void {
        const eventManager = this._data.context.eventManager;
        eventManager?.publishAndPop(this, event)
    }
}
