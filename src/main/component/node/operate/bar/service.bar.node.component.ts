import {ComponentService} from "../../../service.component";
import {inject, injectable} from "inversify";
import Konva from "konva";
import {ChronosWindowComponent} from "../../../window/window.component";
import {TYPES} from "../../../../config/inversify.config";
import {ChronosNodeBarData} from "./data.bar.node.component";
import {ChronosNodeEntryData} from "../entry/data.entry.node.component";
import {NodeShape} from "../../board/shape/NodeShape";
import {ChronosNodeGroupComponent} from "../group/group.node.component";
import {ChronosLaneGroupComponent} from "../../../lane/group/group.lane.component";
import {ChronosTimelineComponent} from "../../../timeline/timeline.component";
import {afterDay} from "../../../../core/utils/DateUtils";

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

    /**
     * 节点组
     */
    private _nodeGroup: ChronosNodeGroupComponent;

    /**
     * 泳道组
     */
    private _laneGroup: ChronosLaneGroupComponent

    /**
     * 时间轴
     */
    private _timeline: ChronosTimelineComponent

    constructor(@inject(TYPES.ChronosNodeBarData) data: ChronosNodeBarData,
                @inject(TYPES.ChronosWindowComponent) window: ChronosWindowComponent,
                @inject(TYPES.ChronosNodeGroupComponent) nodeGroup: ChronosNodeGroupComponent,
                @inject(TYPES.ChronosLaneGroupComponent) laneGroup: ChronosLaneGroupComponent,
                @inject(TYPES.ChronosTimelineComponent) timeline: ChronosTimelineComponent) {
        this._data = data;
        this._window = window;
        this._nodeGroup = nodeGroup;
        this._laneGroup = laneGroup;
        this._timeline = timeline;
    }

    /**
     * 绘制
     */
    draw(): void {
        const data = this._data;
        const fixedCoordinate = this._data.context.drawContext.getFixedCoordinate();
        const width = data.width ?? 0;
        const height = data.height ?? 0;
        const startOffSet = data.startOffSet;
        if (startOffSet === undefined) {
            return
        }

        const group = new Konva.Group({
            x: startOffSet.x + fixedCoordinate.x,
            y: startOffSet.y + fixedCoordinate.y,
        });

        //绘制背景
        const background = new Konva.Rect({
            x: 0,
            y: 0,
            width: width,
            height: height,
            fill: data.backgroundColor,
            stroke: data.borderColor,
            strokeWidth: data.border,
            cornerRadius: data.radius,
            shadowColor: data.shadow.color,
            shadowBlur: data.shadow.blur,
            shadowOffset: data.shadow.offset,
            shadowOpacity: data.shadow.opacity,
        });

        //绘制中间分线
        const middleLine = new Konva.Line({
            points: [width / 2, height / 12, width / 2, height / 12 * 11],
            stroke: data.middleLineColor,
            strokeWidth: data.middleLineWidth,
        });
        group.add(background);
        group.add(middleLine);

        //绘制候选节点
        const candidateNodeX = width / 4;
        const y = height / 12;
        this.drawNode(data.candidateNode, candidateNodeX, undefined, y, group);

        //绘制候选变形节点
        const xStart = width / 8 * 5;
        const xFinish = width / 8 * 7;
        this.drawNode(data.candidateTransformableNode, xStart, xFinish, y, group);


        this._data.graphics = group;
        this._data.layer?.add(group);
    }

    /**
     * 绘制节点
     * @param node 节点
     * @param xStart x开始坐标
     * @param xFinish x结束坐标
     * @param y y坐标
     * @param group 组
     */
    private drawNode(node: Map<string, new () => NodeShape>, xStart: number, xFinish: number | undefined, y: number, group: Konva.Group) {
        const data = this._data;
        let index: number = 1;
        const edit = data.context.drawContext.isEdit;
        node.forEach((value) => {
            const node = new value();
            const originalY = y * index;
            const nodeName = data.candidateNodeName.get(node.code);
            const candidateNode = node.create({xStart: xStart, xFinish: xFinish, y: originalY}, nodeName ?? node.code);
            candidateNode.draggable(edit)
            candidateNode.on('dragend', () => {
                candidateNode.y(originalY)
                candidateNode.x(xStart)

                //鼠标没有停留在导航窗的时候添加节点

                const width = data.width ?? 0;
                const height = data.height ?? 0;
                const x = data.startOffSet.x
                const y = data.startOffSet.y
                //鼠标位置
                //获取鼠标位置
                const pointerPosition = data.context.drawContext.stage.getPointerPosition();
                if (!pointerPosition) {
                    return;
                }
                const mouseX = pointerPosition.x;
                const mouseY = pointerPosition.y;
                if (mouseX < x || mouseX > x + width || mouseY < y || mouseY > y + height) {
                    this.addNodeEntry(node);
                }
            })
            this._nodeGroup.service.listenMove(node, false);
            group.add(candidateNode);
            index++;
        });
        return index;
    }

    /**
     * 添加节点条目
     * @param node 节点
     */
    addNodeEntry(node: NodeShape) {
        //获取鼠标位置
        const pointerPosition = this._data.context.drawContext.stage.getPointerPosition();
        if (!pointerPosition) {
            return;
        }
        const fixedCoordinate = this._data.context.drawContext.getFixedCoordinate();
        const mouseX = pointerPosition.x + fixedCoordinate.x;
        const mouseY = pointerPosition.y + fixedCoordinate.y;
        //获取时间
        const time = this._timeline.service.getTimeByX(mouseX);
        const lane = this._laneGroup.service.laneByY(mouseY);
        if (!lane) {
            return;
        }
        const laneRow = lane.service.getRowByY(mouseY);
        const nodeName = this._data.candidateNodeName.get(node.code);
        const entryData = new ChronosNodeEntryData(this._data.context,
            {
                id: node.code + this._nodeGroup.data.nodeGroup.length,
                name: (nodeName ?? node.code) + this._nodeGroup.data.nodeGroup.length,
                type: node.code,
                startTime: time.toLocaleString(),
                laneId: lane.data.id,
                row: laneRow
            });
        if (node.transformable) {
            entryData.finishTime = afterDay(entryData.startTime, 3)
        }

        this._nodeGroup.service.addNodeEntry(entryData);
    }

    /**
     * 根据节点获取一个图形
     */
    getGraphicsByNode(nodeData: ChronosNodeEntryData): NodeShape | undefined {
        let type = this._data.candidateNode.get(nodeData.type);

        if (!type) {
            type = this._data.candidateTransformableNode.get(nodeData.type);
        }

        if (type) {
            const nodeShape = new type();
            nodeShape.create(nodeData.coordinate, nodeData.name);
            nodeShape.shape?.draggable(this._data.context.drawContext.isEdit)
            return nodeShape;
        }
        console.warn('未知的节点类型', nodeData)
        return undefined
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

    /**
     * 保持定位
     */
    keepPos() {
        const data = this._data;
        const fixedCoordinate = this._data.context.drawContext.getFixedCoordinate();
        data.graphics?.x(data.startOffSet.x + fixedCoordinate.x)
        data.graphics?.y(data.startOffSet.y + fixedCoordinate.y)
    }
}
