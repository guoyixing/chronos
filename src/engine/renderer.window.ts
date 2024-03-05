import {WindowConfig} from "../config/config.window";


/**
 * 窗口渲染器
 */
export class RendererWindow {

    private readonly windowConfig: WindowConfig

    constructor(windowConfig: WindowConfig) {
        this.windowConfig = windowConfig
    }

    draw(htmlElement: HTMLElement): HTMLCanvasElement {
        const canvas = document.createElement('canvas');
        const config = this.windowConfig.windowSize;

        let ctx = canvas.getContext('2d');

        ctx!.fillStyle = 'black';

        canvas.width = config.w + config.x;
        canvas.height = config.h + config.y;

        const width = config.w - config.x;
        const height = config.h - config.y;

        ctx!.strokeRect(config.x, config.y, width, height);

        htmlElement.appendChild(canvas);
        return canvas;
    }
}