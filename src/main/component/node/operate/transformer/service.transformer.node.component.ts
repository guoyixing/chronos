import {ComponentService} from "../../../service.component";
import {inject, injectable} from "inversify";
import {ChronosNodeTransformerData} from "./data.transformer.node.component";
import {TYPES} from "../../../../config/inversify.config";
import Konva from "konva";

/**
 * 节点变形器-组件服务
 */
@injectable()
export class ChronosNodeTransformerService implements ComponentService {

    /**
     * 数据
     */
    private _data: ChronosNodeTransformerData

    constructor(@inject(TYPES.ChronosNodeTransformerData) data: ChronosNodeTransformerData) {
        this._data = data;
    }

    /**
     * 绘制
     */
    draw() {
        const data = this._data;
        //删除控制点
        data.leftControlPoint?.destroy();
        data.rightControlPoint?.destroy();
        //绘制变形器
        this.drawTransformer();
        //点击舞台取消选中
        this.clickStageDeselect();
        //监听移动
        this.listenMove();

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
                coordinate && nodeGraphics?.transform(coordinate.xStart + (leftControlPoint.x() - leftX), coordinate.y, coordinate.xFinish)
            })
        }

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
                coordinate && nodeGraphics?.transform(coordinate.xStart, coordinate.y, (coordinate.xFinish || 0) + (rightControlPoint.x() - rightX))
            })
        }
    }
}