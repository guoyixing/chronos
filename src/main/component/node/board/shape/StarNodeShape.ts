import {NodeShape} from "./NodeShape";
import Konva from "konva";
import {ChronosNodeEntryData} from "../../operate/entry/data.entry.node.component";

/**
 * 星形节点
 */
export class StarNodeShape implements NodeShape {

    /**
     * 节点图形
     */
    shape: Konva.Group | undefined

    /**
     * 节点形状的code
     */
    code: string = "star"

    /**
     * 是否可以变形
     */
    transformable: boolean = false

    /**
     * 创建图形
     * @param nodeData 节点数据
     */
    create(nodeData: ChronosNodeEntryData): Konva.Group {
        const coordinate = nodeData.coordinate;
        const star = new Konva.Star({
            name: 'star',
            x: 0,
            y: -3,
            numPoints: 5,
            innerRadius: 5,
            outerRadius: 10,
            fill: 'yellow',
            stroke: 'black',
            strokeWidth: 1,
        });
        //添加节点名
        const text = new Konva.Text({
            x: 0,
            y: 8,
            text: nodeData.name,
            fontSize: 12,
            fontFamily: 'Calibri',
            fill: 'black',
        });
        text.x(-text.width() / 2)
        this.shape = new Konva.Group({
            width: star.width(),
            x: coordinate.xStart,
            y: coordinate.y,
            draggable: true
        })
            .add(star)
            .add(text)
        return this.shape
    }

    /**
     * 图形变形
     * @param xStart x起始坐标
     * @param xFinish x结束坐标
     * @param y y坐标
     */
    transform(xStart: number, y: number, xFinish?: number | undefined): void {
        this.shape?.x(xStart)
        this.shape?.y(y)
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
            return {xStart: shape.x(), xFinish: undefined, y: shape.y()}
        }
        throw new Error('未找到节点')
    }

    /**
     * 变形器节点偏移量
     */
    transformerOffset(): { left: number; right: number; } {
        throw new Error("star类型的节点无法变形.");
    }

    /**
     * 最小宽度
     */
    minWidth(): number {
        throw new Error("star类型的节点无法变形.");
    }
}