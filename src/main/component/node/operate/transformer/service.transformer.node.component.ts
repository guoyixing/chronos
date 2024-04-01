import {ComponentService} from "../../../service.component";
import {inject, injectable} from "inversify";
import {ChronosNodeTransformerData} from "./data.transformer.node.component";
import {TYPES} from "../../../../config/inversify.config";
import Konva from "konva";
import {ChronosNodeGroupComponent} from "../group/group.node.component";
import {EVENT_TYPES} from "../../../../core/event/event";

/**
 * 节点变形器-组件服务
 */
@injectable()
export class ChronosNodeTransformerService implements ComponentService {

    /**
     * 数据
     */
    private _data: ChronosNodeTransformerData

    /**
     * 节点组
     */
    private _nodeGroup: ChronosNodeGroupComponent

    constructor(@inject(TYPES.ChronosNodeTransformerData) data: ChronosNodeTransformerData,
                @inject(TYPES.ChronosNodeGroupComponent) nodeGroup: ChronosNodeGroupComponent) {
        this._data = data;
        this._nodeGroup = nodeGroup;
    }

    /**
     * 绘制
     */
    draw() {
        const data = this._data;
        //删除控制点
        data.leftControlPoint?.destroy();
        data.rightControlPoint?.destroy();
        if (data.bindNodeId) {
            data.bindNode = this._nodeGroup.service.getNodeEntryByNodeId(data.bindNodeId)
        }
        //清除跟随节点移动
        this.clearFollowNodeAndLane()
        //绘制变形器
        this.drawTransformer();
        //点击舞台取消选中
        this.clickStageDeselect();
        //监听移动，节点跟随变形器移动
        this.listenMove();
        //跟随节点和泳道移动
        this.followNodeAndLane();
        //监听节点重绘
        this.listenReDrawNodeEntry()
        //监听节点拖拽
        this.listenDragNodeEntry()

        //获取添加到节点的图层
        data.leftControlPoint && data.bindNode?.data.layer?.add(data.leftControlPoint)
        data.rightControlPoint && data.bindNode?.data.layer?.add(data.rightControlPoint)
    }

    /**
     * 点击舞台取消选中
     */
    clickStageDeselect() {
        const data = this._data;
        const stage = data.context.drawContext.stage;

        stage.off('click.deselect')
        //点击空白处，取消选中
        stage.on('click.deselect', (e) => {
            if (e.target === this._data.context.drawContext.stage) {
                data.leftControlPoint?.destroy();
                data.rightControlPoint?.destroy();
                data.bindNodeId = undefined;
                data.bindNode = undefined;
                stage.off('click.deselect')
            }
        })
    }

    /**
     * 绘制变形器
     */
    drawTransformer() {
        const data = this._data;
        //获取节点的图像
        const nodeGraphics = data.bindNode?.data.graphics;
        const coordinate = nodeGraphics?.coordinate();

        //获取节点的偏移量
        const transformerOffset = nodeGraphics?.transformerOffset();

        if (coordinate === undefined || coordinate.xFinish === undefined || transformerOffset === undefined) {
            //如果没有获取到坐标则直接返回
            return
        }
        //绘制左控制器
        data.leftControlPoint = new Konva.Circle({
            x: coordinate.xStart - transformerOffset?.left || 0,
            y: coordinate.y,
            radius: data.pointRadius,
            fill: data.pointColor,
            stroke: data.pointBorderColor,
            strokeWidth: data.pointBorder,
            draggable: true,
            dragBoundFunc: function (pos) {
                return {
                    x: pos.x,
                    y: this.getAbsolutePosition().y
                };
            }
        });

        //绘制右控制器
        data.rightControlPoint = new Konva.Circle({
            x: coordinate.xFinish + transformerOffset?.right || 0,
            y: coordinate.y,
            radius: data.pointRadius,
            fill: data.pointColor,
            stroke: data.pointBorderColor,
            strokeWidth: data.pointBorder,
            draggable: true,
            dragBoundFunc: function (pos) {
                return {
                    x: pos.x,
                    y: this.getAbsolutePosition().y
                };
            }
        });
    }

    /**
     * 监听移动
     */
    listenMove() {
        const data = this._data;
        //获取节点的图像
        const nodeGraphics = data.bindNode?.data.graphics;
        let coordinate: { xStart: number, xFinish: number | undefined, y: number } | undefined;

        //绑定左节点的移动事件
        const leftControlPoint = data.leftControlPoint;
        if (leftControlPoint) {
            let leftX: number;
            leftControlPoint?.on('dragstart', () => {
                coordinate = nodeGraphics?.coordinate();
                leftX = leftControlPoint.x();
            })

            //获取节点的偏移量
            leftControlPoint?.on('dragmove', () => {
                if (coordinate && coordinate.xFinish && nodeGraphics) {
                    const minCoordinateX = coordinate.xFinish - nodeGraphics.minWidth();
                    if (leftControlPoint.x() < minCoordinateX) {
                    } else {
                        leftControlPoint.x(minCoordinateX)
                    }
                    nodeGraphics.transform(coordinate.xStart + (leftControlPoint.x() - leftX), coordinate.y, coordinate.xFinish)
                }
            })

            leftControlPoint?.on('dragend', () => {
                //更新节点的坐标
                const coordinate = data.bindNode?.data.coordinate;
                //更新节点的坐标，这里并不是把同样的对象赋值给coordinate，coordinate会根据节点状态获取新的坐标
                data.bindNode!.data.coordinate = {
                    xStart: coordinate?.xStart,
                    xFinish: coordinate?.xFinish,
                    y: coordinate?.y
                }
                //更新时间
                data.bindNode?.service.updateTime();
            })

            //绑定右节点的移动事件
            const rightControlPoint = data.rightControlPoint;
            if (rightControlPoint) {
                let rightX: number;
                rightControlPoint?.on('dragstart', () => {
                    coordinate = nodeGraphics?.coordinate();
                    rightX = rightControlPoint.x();
                })

                //获取节点的偏移量
                rightControlPoint?.on('dragmove', () => {
                    if (coordinate && nodeGraphics) {
                        const maxCoordinateX = coordinate.xStart + nodeGraphics.minWidth();
                        if (rightControlPoint.x() > maxCoordinateX) {
                        } else {
                            rightControlPoint.x(maxCoordinateX)
                        }
                        nodeGraphics?.transform(coordinate.xStart, coordinate.y, (coordinate.xFinish || 0) + (rightControlPoint.x() - rightX))
                    }
                })

                //更新节点的坐标
                rightControlPoint?.on('dragend', () => {
                    //更新节点的坐标
                    const coordinate = data.bindNode?.data.coordinate;
                    //更新节点的坐标，这里并不是把同样的对象赋值给coordinate，coordinate会根据节点状态获取新的坐标
                    data.bindNode!.data.coordinate = {
                        xStart: coordinate?.xStart,
                        xFinish: coordinate?.xFinish,
                        y: coordinate?.y
                    }
                    //更新时间
                    data.bindNode?.service.updateTime();
                })
            }
        }
    }

    /**
     * 跟随节点和泳道移动
     */
    followNodeAndLane() {
        const data = this._data;
        const bindNode = data.bindNode;

        //左变形器绑定节点移动
        bindNode?.service.follow(
            "transformer",
            () => data.leftControlPoint?.x(),
            (x) => data.leftControlPoint?.x(x),
            (y) => data.leftControlPoint?.y(y)
        )

        //右变形器绑定节点移动
        bindNode?.service.follow(
            "transformer",
            () => data.rightControlPoint?.x(),
            (x) => data.rightControlPoint?.x(x),
            (y) => data.rightControlPoint?.y(y)
        )

        //左变形器绑定泳道移动
        bindNode?.data.lane?.service.follow(
            "transformer",
            () => data.leftControlPoint?.y(),
            (y) => data.leftControlPoint?.y(y)
        )

        //右变形器绑定泳道移动
        bindNode?.data.lane?.service.follow(
            "transformer",
            () => data.rightControlPoint?.y(),
            (y) => data.rightControlPoint?.y(y)
        )
    }

    /**
     * 清除跟随节点和泳道移动
     */
    clearFollowNodeAndLane() {
        const bindNode = this._data.bindNode;
        bindNode?.service.clearFollow('transformer')
        bindNode?.data.lane?.service.clearFollow('transformer')
    }

    /**
     * 监听节点重绘
     */
    listenReDrawNodeEntry() {
        //监听节点重绘
        this._data.bindNode?.service.on(EVENT_TYPES.ReDraw, () => {
            this.draw()
        });
    }

    /**
     * 监听节点拖拽
     */
    listenDragNodeEntry() {
        //监听节点拖拽
        this._data.bindNode?.service.on(EVENT_TYPES.Drag, () => {
            this.draw()
        });
    }
}