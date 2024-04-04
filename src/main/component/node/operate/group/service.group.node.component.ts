import {ComponentService} from "../../../service.component";
import {ChronosNodeGroupData} from "./data.group.node.component";
import {TYPES} from "../../../../config/inversify.config";
import {inject, injectable} from "inversify";
import {ChronosNodeEntryComponent} from "../entry/entry.node.component";
import {NodeShape} from "../../board/shape/NodeShape";
import Konva from "konva";
import {ChronosLaneGroupComponent} from "../../../lane/group/group.lane.component";
import {ChronosWindowComponent} from "../../../window/window.component";

/**
 * 节点组-组件服务
 */
@injectable()
export class ChronosNodeGroupService implements ComponentService {

    /**
     * 数据
     */
    private _data: ChronosNodeGroupData

    /**
     * 泳道组
     */
    private _laneGroup: ChronosLaneGroupComponent

    /**
     * 窗口
     */
    private _window: ChronosWindowComponent

    constructor(@inject(TYPES.ChronosNodeGroupData) data: ChronosNodeGroupData,
                @inject(TYPES.ChronosLaneGroupComponent) laneGroup: ChronosLaneGroupComponent,
                @inject(TYPES.ChronosWindowComponent) window: ChronosWindowComponent) {
        this._data = data;
        this._laneGroup = laneGroup;
        this._window = window;
    }

    /**
     * 绘制
     */
    draw() {
        this._data.nodeGroup.forEach((entry) => {
            entry.service.draw();
        })
    }

    /**
     * 获取节点条目
     * @param nodeId 节点ID
     */
    getNodeEntryByNodeId(nodeId: string): ChronosNodeEntryComponent | undefined {
        let result: ChronosNodeEntryComponent | undefined;
        this._data.nodeGroup.forEach((entry) => {
            if (entry.data.id === nodeId) {
                result = entry;
            }
        })
        return result;
    }

    /**
     * 移除节点条目
     * @param id
     */
    removeNodeEntry(id: string) {
        for (let i = 0; i < this._data.nodeGroup.length; i++) {
            if (this._data.nodeGroup[i].data.id === id) {
                this._data.nodeGroup.splice(i, 1);
                break;
            }
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
        });
    }
}
