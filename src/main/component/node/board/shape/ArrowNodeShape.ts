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
     * @param coordinate 节点位置
     * @param name 节点名
     */
    create(coordinate: { xStart?: number; xFinish?: number | undefined; y?: number }, name: string): Konva.Group {
        if (!coordinate.xStart || !coordinate.xFinish) {
            throw new Error("无法获取x结束坐标")
        }

        //创建一个圆形
        const circle = new Konva.Circle({
            name: 'circle',
            x: 5,
            y: 0,
            radius: 5,
            fill: '#2F9E44',
            stroke: '#2F9E44',
            strokeWidth: 2,
        });

        const arrow = new Konva.Arrow({
            name: 'arrow',
            x: 0,
            y: 0,
            points: [0, 0, coordinate.xFinish - coordinate.xStart, 0],
            pointerLength: 10,
            pointerWidth: 10,
            fill: '#2F9E44',
            stroke: '#2F9E44',
            strokeWidth: 5,
        });
        const width = arrow.width() - arrow.pointerLength();

        //添加节点名
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
            width: width,
            x: coordinate.xStart,
            y: coordinate.y,
            draggable: true
        })
            .add(arrow)
            .add(circle)
            .add(text)

        return this.shape
    }

    /**
     * 图形变形
     * @param xStart x起始坐标
     * @param xFinish x结束坐标
     * @param y y坐标
     * @param progress 进度
     */
    transform(xStart: number, y: number, xFinish?: number | undefined, progress?: number): void {
        if (!xFinish) {
            throw new Error("无法获取x结束坐标")
        }
        const shape = this.shape;
        const arrow = shape?.findOne<Konva.Arrow>('.arrow');
        const text = shape?.findOne<Konva.Text>('.text');
        arrow?.points([0, 0, xFinish - xStart, 0])
        if (shape && arrow) {
            shape.x(xStart)
            shape.width(arrow.width() - arrow.pointerLength())
            text?.x((arrow.width() - arrow.pointerLength()) / 2 - text.width() / 2)
        }

        if (progress !== undefined && progress > 0 && progress < 1) {
            const progressGroup = shape?.findOne<Konva.Group>('.progress');
            if (progressGroup) {
                const progressArrow = progressGroup.findOne<Konva.Arrow>('.progressArrow');
                progressArrow?.points([0, 0, xFinish - xStart, 0])
                if (progressArrow) {
                    const width = progressArrow.width() - progressArrow.pointerLength();
                    progressGroup.width(width)
                    progressGroup.clipFunc((ctx) => {
                        const widthProgress = width * progress;
                        ctx.rect(0, -10, widthProgress + 3, 20);
                    });
                }

            }
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

    /**
     * 进度
     * @param coordinate 节点位置
     * @param progress 节点名
     */
    progress(coordinate: { xStart?: number; xFinish?: number | undefined; y?: number }, progress: number) {
        if (!coordinate.xStart || !coordinate.xFinish) {
            throw new Error("无法获取x结束坐标")
        }

        //创建一个圆形
        const circle = new Konva.Circle({
            name: 'progressCircle',
            x: 5,
            y: 0,
            radius: 5,
            fill: '#FFF',
            opacity: 0.5,
            prefectDrawEnabled: false
        });

        const arrow = new Konva.Arrow({
            name: 'progressArrow',
            x: 10,
            y: 0,
            points: [0, 0, coordinate.xFinish - coordinate.xStart, 0],
            pointerLength: 10,
            pointerWidth: 10,
            fill: '#FFF',
            stroke: '#FFF',
            strokeWidth: 3,
            opacity: 0.5,
            prefectDrawEnabled: false
        });
        const width = arrow.width() - arrow.pointerLength();

        const group = new Konva.Group({
            name: 'progress',
            width: width,
            x: 0,
            y: 0,
        });
        group.add(arrow)
        group.add(circle)

        //创建遮罩
        group.clipFunc((ctx) => {
            const widthProgress = width * progress;
            ctx.rect(0, -10, widthProgress + 3, 20);
        });
        return group
    }
}
