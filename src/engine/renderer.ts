import {EventProvider} from "./event.provider.js";
import {RendererWindow} from "./renderer.window.js";
import {StageConfig} from "../config/config.stage";

/**
 * Renderer
 * 窗口管理器
 */
export class Renderer {

    /**
     * 构造器挂载的 DOM
     * @private
     */
    private readonly htmlElement: HTMLDivElement

    /**
     * 鼠标句柄 [移动,点击]
     * @see mouseClick
     * @see mouseMove
     */
    private eventProvider: EventProvider

    constructor(htmlElement: HTMLDivElement) {
        this.htmlElement = htmlElement;

        const provider = {
            pointer: this,
            mouseClick: this.mouseClick,
            mouseMove: this.mouseMove,
            eventInitialization: this.onInitial
        }
        this.eventProvider = new EventProvider(provider)
    }

    /**
     * 初始渲染,在 dom 创建后
     *
     * @param event event
     * @private 内部生命周期
     */
    private onInitial(event: Event) {
        const config = new StageConfig(this.htmlElement,true);
        const window = new RendererWindow(config);
        window.draw()
    }

    private mouseClick(event: MouseEvent) {
        console.log(event)
    }

    private mouseMove(event: MouseEvent) {

    }

}
