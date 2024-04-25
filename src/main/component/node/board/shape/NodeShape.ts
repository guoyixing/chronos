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
     * @param coordinate 节点位置
     * @param name 节点名
     */
    create(coordinate: { xStart?: number; xFinish?: number | undefined; y?: number }, name: string): Konva.Group;

    /**
     * 进度
     * @param coordinate 节点位置
     * @param progress 节点名
     */
    progress(coordinate: {
        xStart?: number;
        xFinish?: number | undefined;
        y?: number
    }, progress: number): Konva.Group | undefined;

    /**
     * 图形变形
     * @param xStart x起始坐标
     * @param xFinish x结束坐标
     * @param y y坐标
     * @param progress 进度
     */
    transform(xStart: number, y: number, xFinish?: number, progress?: number): void;

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
