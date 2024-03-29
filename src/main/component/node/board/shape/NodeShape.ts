import Konva from "konva";

/**
 * 节点形状的接口
 */
export interface NodeShape {

    /**
     * 节点图形
     */
    shape: Konva.Group | undefined;

    /**
     * 节点形状的code
     */
    code: string;

    /**
     * 是否可以变形
     */
    transformable: boolean;

    /**
     * 创建图形
     * @param xStart x起始坐标
     * @param xFinish x结束坐标
     * @param y y坐标
     */
    create(xStart: number, y: number, xFinish?: number): Konva.Group;

    /**
     * 图形变形
     * @param xStart x起始坐标
     * @param xFinish x结束坐标
     * @param y y坐标
     */
    transform(xStart: number, y: number, xFinish?: number): void;

    /**
     * 坐标
     * xStart: 开始x坐标
     * xFinish: 结束x坐标，如果没有结束时间，则为undefined
     * y: y坐标
     */
    coordinate(): { xStart: number, xFinish: number | undefined, y: number }

    /**
     * 变形器节点偏移量
     */
    transformerOffset(): { left: number, right: number }

    /**
     * 最小宽度
     */
    minWidth(): number;
}