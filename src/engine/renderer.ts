import {EventProvider} from "./event.provider.js";
import {RendererWindow} from "./renderer.window.js";
import {StageConfig} from "../config/config.stage";
import {StageGroup, WindowGroup} from "../config/config.type";
import Konva from "konva";

/**
 * Renderer
 */
export class Renderer {

    /**
     * 窗口组,渲染器,根html,负责绘制第一层(最底层)的画布
     */
    private readonly windowGroup: WindowGroup

    private readonly stageGroup: StageGroup

    /**
     * 初始第一一层后续添加
     */
    private readonly rootLayer: Konva.Layer

    /**
     * 鼠标句柄 [移动,点击]
     * @see mouseClick
     * @see mouseMove
     */
    private eventProvider: EventProvider

    constructor(htmlElement: HTMLDivElement) {
        const stageConfig = new StageConfig(htmlElement, true);

        // 第一层留给窗口
        this.rootLayer = new Konva.Layer()

        // 窗口组
        this.windowGroup = {
            rootHtmlElement: htmlElement,
            rendererWindow: new RendererWindow()
        }

        const stage = new Konva.Stage({
            container: stageConfig.rootElement.id,
            width: stageConfig.size.width,
            height: stageConfig.size.height
        })

        // 舞台组
        this.stageGroup = {
            config: stageConfig,
            stage: stage
        }

        // 事件监听器
        this.eventProvider = new EventProvider({
            pointer: this,
            mouseClick: this.mouseClick,
            mouseMove: this.mouseMove,
            eventInitialization: this.onInitial
        })
    }

    /**
     * 初始渲染,在 dom 创建后
     *
     * @private 内部生命周期
     */
    private onInitial() {
        this.drawWindow();
    }

    /**
     * 第一层渲染窗口
     * @private
     */
    private drawWindow() {
        const {rendererWindow} = this.windowGroup
        rendererWindow.drawGrid(this.rootLayer, this.stageGroup)
    }

    resize() {
        this.rootLayer.remove()
        this.stageGroup.stage.remove()
        this.drawWindow();
    }

    private mouseClick(event: MouseEvent) {
        console.log(event)
    }

    private mouseMove(event: MouseEvent) {
        if (!event) {
            console.log(event)
        }
    }
}
