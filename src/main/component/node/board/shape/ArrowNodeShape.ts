import {NodeShape} from "./NodeShape";
import Konva from "konva";

/**
 * 箭头形状
 */
export class ArrowNodeShape implements NodeShape {
    /**
     * 节点图形
     */
    shape: Konva.Group | undefined

    /**
     * 节点形状的code
     */
    code: string = "arrow"

    /**
     * 是否可以变形
     */
    transformable: boolean = true

    /**
     * 创建图形
     * @param xStart x起始坐标
     * @param xFinish x结束坐标
     * @param y y坐标
     */
    create(xStart: number, y: number, xFinish?: number | undefined): Konva.Group {
        if (!xFinish) {
            throw new Error("无法获取x结束坐标")
        }

        //创建一个圆形
        const circle = new Konva.Circle({
            name: 'circle',
            x: 0,
            y: 0,
            radius: 5,
            fill: 'black',
            stroke: 'black',
            strokeWidth: 1,
        });

        const arrow = new Konva.Arrow({
            name: 'arrow',
            x: 0,
            y: 0,
            points: [0, 0, xFinish - xStart, 0],
            pointerLength: 10,
            pointerWidth: 10,
            fill: 'black',
            stroke: 'black',
            strokeWidth: 3,
        });

        const width = arrow.width() - arrow.pointerLength();
        this.shape = new Konva.Group({
            width: width,
            x: xStart,
            y: y,
            draggable: true
        })
            .add(arrow)
            .add(circle)

        return this.shape
    }

    /**
     * 图形变形
     * @param xStart x起始坐标
     * @param xFinish x结束坐标
     * @param y y坐标
     */
    transform(xStart: number, y: number, xFinish?: number | undefined): void {
        if (!xFinish) {
            throw new Error("无法获取x结束坐标")
        }
        const shape = this.shape;
        const arrow = shape?.findOne<Konva.Arrow>('.arrow');

        arrow?.points([0, 0, xFinish - xStart, 0])
        if (shape && arrow) {
            shape.x(xStart)
            shape.width(arrow.width() - arrow.pointerLength())
        }
    }

    /**
     * 坐标
     * xStart: 开始x坐标
     * xFinish: 结束x坐标，如果没有结束时间，则为undefined
     * y: y坐标
     */
    coordinate(): { xStart: number; xFinish: number | undefined; y: number; } {
        const shape = this.shape;
        if (shape) {
            return {xStart: shape.x(), xFinish: shape.x() + shape.width(), y: shape.y()}
        }
        throw new Error('未找到节点')
    }

    /**
     * 变形器节点偏移量
     */
    transformerOffset(): { left: number; right: number; } {
        return {left: 12, right: 12}
    }

    /**
     * 最小宽度
     */
    minWidth(): number {
        const shape = this.shape;
        const arrow = shape?.findOne<Konva.Arrow>('.arrow');
        return arrow?.pointerLength() || 0
    }
}