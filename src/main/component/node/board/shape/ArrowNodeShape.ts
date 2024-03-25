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
        this.shape = new Konva.Group({
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
    }

    /**
     * 坐标
     * xStart: 开始x坐标
     * xFinish: 结束x坐标，如果没有结束时间，则为undefined
     * y: y坐标
     */
    coordinate(): { xStart: number; xFinish: number | undefined; y: number; } {
        const shape = this.shape;
        const arrow = shape?.findOne<Konva.Arrow>('.arrow');
        if (shape && arrow) {
            return {xStart: shape.x(), xFinish: arrow.x() + arrow.points()[2], y: shape.y()}
        }
        throw new Error('未找到节点')
    }
}