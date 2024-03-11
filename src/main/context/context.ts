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

    /**
     * 组件索引
     * TODO 考虑和图层索引合并
     */
    componentIndex: Map<string, any>;

    /**
     * 舞台限制移动的范围，y轴移动范围是泳道组的高度
     */
    stageMoveLimit: { yTop: number, yBottom: number } = {yTop: 0, yBottom: 0};

    constructor(stageConfig: StageConfig) {
        this.rootLayer = new Konva.Layer()
        this.componentIndex = new Map()
        this.layerIndex = new Map()
        this.layerIndex.set('root', this.rootLayer)
        this.stageConfig = stageConfig

        this.stage = new Konva.Stage({
            container: stageConfig.rootElement.id,
            width: stageConfig.size.width,
            height: stageConfig.size.height,
            //舞台拖动
            draggable: stageConfig.draggable
        })
        this.stage.add(this.rootLayer)
    }

    /**
     * 可见区域能够绘制的大小
     */
    getSize(): [width: number, height: number] {
        // 防止内容覆写到边框上
        const border = 2 * this.stageConfig.border;
        return [
            this.stageConfig.size.width - border,
            this.stageConfig.size.height - border
        ]
    }

    /**
     * 获取定点坐标
     * 左上角相对于舞台原点的坐标
     * @return {x: number, y: number}
     */
    getFixedCoordinate(): { x: number; y: number } {
        // 添加上 border 不让绘制在边框上
        const border = this.stageConfig.border
        return {
            x: -this.stage.x() + border,
            y: -this.stage.y() + border
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

    fetchLayer(name: string): Konva.Layer | undefined {
        return this.layerIndex.get(name)
    }

    /**
     * 注册组件
     */
    registerComponent(name: string, component: any) {
        this.componentIndex.set(name, component)
    }

    /**
     * 获取组件
     */
    getComponent(name: string): any {
        return this.componentIndex.get(name)
    }
}
