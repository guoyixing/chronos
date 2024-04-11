import {ComponentService} from "../../../service.component";
import {ChronosNodeEntryData} from "./data.entry.node.component";
import {ChronosNodeBarComponent} from "../bar/bar.node.component";
import {ChronosLaneGroupComponent} from "../../../lane/group/group.lane.component";
import {ChronosTimelineComponent} from "../../../timeline/timeline.component";
import {NodeShape} from "../../board/shape/NodeShape";
import {ChronosNodeGroupComponent} from "../group/group.node.component";
import {EVENT_TYPES, EventPublisher} from "../../../../core/event/event";
import {ChronosNodeTransformerComponent} from "../transformer/transformer.node.component";
import {ChronosNodeDetailComponent} from "../detail/detail.node.component";
import {ChronosScaleComponent} from "../../../scale/scale.component";
import {ChronosNodeReviseComponent} from "../revise/revise.node.component";
import {Callback} from "../../../../core/event/callback/callback";

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
     * 回调
     */
    private _callback: Callback

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

    /**
     * 比例尺
     */
    private _scale: ChronosScaleComponent

    /**
     * 修订窗
     */
    private _nodeRevise: ChronosNodeReviseComponent


    constructor(data: ChronosNodeEntryData,
                callback: Callback,
                bar: ChronosNodeBarComponent,
                laneGroup: ChronosLaneGroupComponent,
                timeline: ChronosTimelineComponent,
                nodeGroup: ChronosNodeGroupComponent,
                nodeTransformer: ChronosNodeTransformerComponent,
                nodeDetail: ChronosNodeDetailComponent,
                nodeRevise: ChronosNodeReviseComponent,
                scale: ChronosScaleComponent) {
        this._data = data;
        this._callback = callback;
        this._bar = bar;
        this._laneGroup = laneGroup;
        this._timeline = timeline;
        this._nodeGroup = nodeGroup;
        this._nodeTransformer = nodeTransformer;
        this._nodeDetail = nodeDetail;
        this._nodeRevise = nodeRevise;
        this._scale = scale;
        this.id = "nodeEntry" + this._data.id
    }

    /**
     * 绘制
     */
    draw() {
        const data = this._data;
        if (data.hidden) {
            return
        }
        //获取bar
        const nodeShape = this._bar.service.getGraphicsByNode(data);
        if (!nodeShape) {
            return
        }
        const node = nodeShape.shape;

        //监听移动
        this.listenMove(nodeShape)
        //监听点击
        this.listenClick(nodeShape)
        //监听双击
        this.listenDblClick(nodeShape)
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
     * 清除
     */
    clear() {
        const data = this._data;
        data.graphics?.shape?.destroy()
        data.graphics = undefined
        this._nodeGroup.service.removeNodeEntry(data.id)
        this.publish(EVENT_TYPES.Delete)
    }

    /**
     * 监听移动
     * @param nodeShape 节点
     */
    listenMove(nodeShape: NodeShape) {
        this._nodeGroup.service.listenMove(nodeShape, true)

        const node = nodeShape.shape;
        //监听移动结束
        node?.on('dragend', () => {
            this.clearFollowLane()
            this.updateLane()
            this.updateTime()
            this.followLane()
            this.publish(EVENT_TYPES.Drag)
        });
    }

    /**
     * 监听点击
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
     * 监听双击
     * @param nodeShape 节点
     */
    listenDblClick(nodeShape: NodeShape) {
        const data = this._data;
        const node = nodeShape.shape;
        node?.on('dblclick', () => {
            this._nodeRevise.service.close()
            this._nodeRevise.data.bindNodeId = data.id;
            this._nodeRevise.service.open()
            this._callback.nodeDoubleClick && this._callback.nodeDoubleClick(data, this._nodeGroup)
        })
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
            console.warn('节点' + data.id + '，无法获取到所在行')
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
    listenLane() {
        //监听泳道重绘
        this._data.lane?.service.on(EVENT_TYPES.ReDraw, () => {
            this.reDraw()
        });
        //监听泳道删除
        this._data.lane?.service.on(EVENT_TYPES.Delete, () => {
            this.clear()
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

    /**
     * 监听比例尺
     */
    listenScale() {
        this._scale.service.on(EVENT_TYPES.ScaleReDraw, () => {
            this.reDraw()
        })
    }
}
