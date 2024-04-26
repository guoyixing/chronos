import {NodeShape} from "./node-shape.interface";
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
            cornerRadius: 5,
            strokeWidth: 2,
            stroke: '#4E72B8',
            prefectDrawEnabled: false
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

    /**
     * 进度
     * @param coordinate 节点位置
     * @param progress 节点名
     */
    progress(coordinate: { xStart?: number; xFinish?: number | undefined; y?: number }, progress: number): Konva.Group {
        if (!coordinate.xStart || !coordinate.xFinish) {
            throw new Error("无法获取x结束坐标")
        }
        const width = coordinate.xFinish - coordinate.xStart;
        //创建矩形
        const rect = new Konva.Rect({
            name: 'progressRect',
            x: 0,
            y: -5,
            width: width,
            height: 10,
            fill: '#FFF',
            cornerRadius: 5,
            opacity: 0.5,
            prefectDrawEnabled: false
        });

        const group = new Konva.Group({
            name: 'progress',
            width: rect.width(),
            x: 0,
            y: 0,
        });
        group.add(rect);
        //创建遮罩
        group.clipFunc((ctx) => {
            const widthProgress = width * progress;
            ctx.rect(0, -5, widthProgress, 10);
        });
        return group
    }

    minWidth(): number {
        return 1
    }

    /**
     * 变形
     * @param xStart
     * @param y
     * @param xFinish
     * @param progress 进度
     */
    transform(xStart: number, y: number, xFinish?: number, progress?: number): void {
        if (!xFinish) {
            throw new Error("无法获取x结束坐标")
        }
        const shape = this.shape;
        const rect = shape?.findOne<Konva.Rect>('.rect');
        const text = shape?.findOne<Konva.Text>('.text');
        const width = xFinish - xStart;
        rect?.width(width)
        if (shape && rect) {
            shape.x(xStart)
            shape.width(width)
            text?.x(rect.width() / 2 - text.width() / 2)
        }

        if (progress !== undefined && progress > 0 && progress <= 1) {
            const progressGroup = shape?.findOne<Konva.Group>('.progress');
            if (progressGroup) {
                const progressRect = progressGroup.findOne<Konva.Rect>('.progressRect');
                progressRect?.width(width)
                progressGroup.width(width)
                progressGroup.clipFunc((ctx) => {
                    const widthProgress = width * progress;
                    ctx.rect(0, -5, widthProgress, 10);
                });
            }
        }
    }

    transformerOffset(): { left: number; right: number } {
        return {left: 12, right: 12}
    }

}
