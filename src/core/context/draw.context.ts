import Konva from "konva";

/**
 * 绘图上下文
 */
export class DrawContext {
    /**
     * 舞台
     */
    readonly stage: Konva.Stage;

    /**
     * 根层
     */
    readonly rootLayer: Konva.Layer

    /**
     * 舞台所在的div元素
     */
    readonly rootElement: HTMLDivElement

    /**
     * 是否允许编辑
     */
    isEdit: boolean = true

    /**
     * 舞台限制移动的范围，y轴移动范围是泳道组的高度
     */
    stageMoveLimit: { yTop: number, yBottom: number } = {yTop: 0, yBottom: 0};


    constructor(config: DrawContextConfig) {
        this.rootElement = config.rootElement
        this.rootLayer = new Konva.Layer()
        const clientRect = this.rootElement.getBoundingClientRect();
        this.stage = new Konva.Stage({
            container: config.rootElement.id,
            width: config.size ? config.size.width : clientRect.width,
            height: config.size ? config.size.height : clientRect.height,
            //舞台拖动
            draggable: config.draggable
        })

        this.stage.add(this.rootLayer)
    }

    /**
     * 申请图层
     */
    applyLayer(name: string): Konva.Layer {
        const layer = new Konva.Layer();
        this.stage.add(layer)
        return layer
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

}

/**
 * 绘图上下文配置
 */
type DrawContextConfig = {
    rootElement: HTMLDivElement
    size?: {
        width: number
        height: number
    }
    draggable: boolean
}