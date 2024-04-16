import {NodeShape} from "./NodeShape";
import Konva from "konva";

/**
 * 矩形形状
 */
export class RectNodeShape implements NodeShape {
    /**
     * 节点形状的code
     */
    code: string = "rect";
    /**
     * 节点图形
     */
    shape: Konva.Group | undefined;
    /**
     * 是否可变性
     */
    transformable: boolean = true;

    /**
     * 坐标
     * xStart: 开始x坐标
     * xFinish: 结束x坐标，如果没有结束时间，则为undefined
     * y: y坐标
     */
    coordinate(): { xStart: number; xFinish: number | undefined; y: number } {
        const shape = this.shape;
        if (shape) {
            return {xStart: shape.x(), xFinish: shape.x() + shape.width(), y: shape.y()}
        }
        throw new Error('未找到节点')
    }

    create(coordinate: { xStart?: number; xFinish?: number | undefined; y?: number }, name: string): Konva.Group {
        if (!coordinate.xStart || !coordinate.xFinish) {
            throw new Error("无法获取x结束坐标")
        }
        const width = coordinate.xFinish - coordinate.xStart;
        //创建矩形
        const rect = new Konva.Rect({
            name: 'rect',
            x: 0,
            y: -5,
            width: width,
            height: 10,
            fill: '#4E72B8',
            cornerRadius: 5
        });
        //节点名称
        const text = new Konva.Text({
            name: 'text',
            x: 0,
            y: 8,
            text: name,
            fontSize: 12,
            fontFamily: 'Calibri',
            fill: 'black',
        });
        text.x(width / 2 - text.width() / 2)

        this.shape = new Konva.Group({
            width: rect.width(),
            x: coordinate.xStart,
            y: coordinate.y,
            draggable: true
        })
            .add(rect)
            .add(text);
        return this.shape;
    }

    minWidth(): number {
        return 1
    }

    /**
     * 变形
     * @param xStart
     * @param y
     * @param xFinish
     */
    transform(xStart: number, y: number, xFinish?: number): void {
        if (!xFinish) {
            throw new Error("无法获取x结束坐标")
        }
        const shape = this.shape;
        const rect = shape?.findOne<Konva.Arrow>('.rect');
        const text = shape?.findOne<Konva.Text>('.text');
        console.log(rect, text)
        rect?.width(xFinish - xStart)
        if (shape && rect) {
            shape.x(xStart)
            shape.width(xFinish - xStart)
            text?.x(rect.width() / 2 - text.width() / 2)
        }

    }

    transformerOffset(): { left: number; right: number } {
        return {left: 12, right: 12}
    }

}