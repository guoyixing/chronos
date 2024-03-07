import {StageConfig} from "../metadata/config/config.stage";
import Konva from "konva";

/**
 * Context
 */
export class Context {

    /**
     * 舞台元数据
     */
    readonly stageConfig: StageConfig

    /**
     * 舞台
     */
    readonly stage: Konva.Stage;

    /**
     * 根层
     */
    readonly rootLayer: Konva.Layer

    /**
     * 图层索引
     */
    layerIndex: Map<string, Konva.Layer>;

    constructor(htmlElement: HTMLDivElement) {
        this.rootLayer = new Konva.Layer()
        this.layerIndex = new Map()
        this.layerIndex.set('root', this.rootLayer)
        const stageConfig = new StageConfig(htmlElement, true)
        this.stageConfig = stageConfig

        this.stage = new Konva.Stage({
            container: stageConfig.rootElement.id,
            width: stageConfig.size.width,
            height: stageConfig.size.height,
            //舞台拖动
            draggable: true
        })
        this.stage.add(this.rootLayer)
    }

    /**
     * 可见区域能够绘制的大小
     */
    getSize(): [width: number, heigh: number] {
        return [
            this.stageConfig.size.width - 2 * this.stageConfig.border,
            this.stageConfig.size.height - 2 * this.stageConfig.border
        ]
    }

    /**
     * 0 + border : 可见区域的 Y 坐标
     */
    getRelativeY() {
        return this.stageConfig.border
    }

    /**
     * 同上
     */
    getRelativeX() {
        return this.stageConfig.border
    }

    /**
     * 获取定点坐标
     * 左上角相对于舞台原点的坐标
     * @return {x: number, y: number}
     */
    getFixedCoordinate(): { x: number; y: number } {
        return {
            x: -this.stage.x(),
            y: -this.stage.y()
        }
    }

    /**
     * 申请图层
     */
    applyLayer(name: string): Konva.Layer {
        const layer = new Konva.Layer();
        this.layerIndex.set(name, layer);
        this.stage.add(layer)
        return layer
    }
}
