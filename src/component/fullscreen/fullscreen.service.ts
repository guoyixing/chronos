import {ComponentService} from "../component-service.interface";
import {ChronosFullscreenData} from "./fullscreen.data";
import {inject, injectable} from "inversify";
import {TYPES} from "../../config/inversify.config";
import {ResizeListener} from "../../core/event/event";
import {ChronosWindowData} from "../window/window.data";

/**
 * 全屏-组件服务
 */
@injectable()
export class ChronosFullscreenService implements ComponentService {

    /**
     * 数据
     */
    private _data: ChronosFullscreenData

    constructor(@inject(TYPES.ChronosFullscreenData) data: ChronosFullscreenData) {
        this._data = data;
    }

    /**
     * 绑定根元素
     */
    bindRootElement(element: HTMLDivElement): void {
        this._data.rootElement = element;
    }

    draw(): void {
        // 全屏组件不需要绑制图形，只处理全屏逻辑
    }

    /**
     * 切换全屏状态
     */
    toggle(): void {
        if (this._data.isFullscreen) {
            this.exitFullscreen();
        } else {
            this.enterFullscreen();
        }
    }

    /**
     * 进入全屏（铺满浏览器窗口）
     */
    enterFullscreen(): void {
        const rootElement = this._data.rootElement;
        if (!rootElement) {
            console.warn('全屏组件：根元素未绑定');
            return;
        }

        // 备份原始样式
        this._data.originalStyles = {
            width: rootElement.style.width,
            height: rootElement.style.height,
            position: rootElement.style.position,
            top: rootElement.style.top,
            left: rootElement.style.left,
            zIndex: rootElement.style.zIndex,
            background: rootElement.style.background
        };

        // 使用 CSS 铺满浏览器窗口
        this.enterCssFullscreen(rootElement);
        this._data.isFullscreen = true;
    }

    /**
     * 退出全屏
     */
    exitFullscreen(): void {
        const rootElement = this._data.rootElement;
        if (!rootElement) {
            return;
        }

        // 恢复原始样式
        this.restoreOriginalStyles(rootElement);
        this._data.isFullscreen = false;
    }

    /**
     * 使用 CSS 铺满浏览器窗口
     */
    private enterCssFullscreen(element: HTMLDivElement): void {
        // 获取 stage 容器的背景色，保持一致
        const stageContainer = this._data.context.drawContext.stage.container();
        const computedStyle = window.getComputedStyle(stageContainer);
        const backgroundColor = computedStyle.backgroundColor || '#ffffff';

        element.style.position = 'fixed';
        element.style.top = '0';
        element.style.left = '0';
        element.style.width = '100vw';
        element.style.height = '100vh';
        element.style.zIndex = '9999';
        element.style.background = backgroundColor;

        // 延迟调整舞台大小，等待样式生效
        requestAnimationFrame(() => {
            this.resizeStage();
        });
    }

    /**
     * 恢复原始样式
     */
    private restoreOriginalStyles(element: HTMLDivElement): void {
        const styles = this._data.originalStyles;
        if (styles) {
            element.style.width = styles.width;
            element.style.height = styles.height;
            element.style.position = styles.position;
            element.style.top = styles.top;
            element.style.left = styles.left;
            element.style.zIndex = styles.zIndex;
            element.style.background = styles.background;
        }

        // 延迟调整舞台大小
        requestAnimationFrame(() => {
            this.resizeStage();
        });
    }

    /**
     * 调整舞台大小并通知所有 ResizeListener 重绘
     */
    private resizeStage(): void {
        const rootElement = this._data.rootElement;
        if (!rootElement) {
            return;
        }

        const stage = this._data.context.drawContext.stage;
        const width = rootElement.clientWidth;
        const height = rootElement.clientHeight;

        // 更新舞台尺寸
        stage.width(width);
        stage.height(height);

        // 先更新 Window 数据，因为其他组件的 draw() 方法依赖 Window 的尺寸
        const windowData = this._data.context.ioc.get<ChronosWindowData>(TYPES.ChronosWindowData);
        windowData.width = width;
        windowData.height = height;

        // 通过 IOC 获取所有 ResizeListener 并通知尺寸变化
        const listeners = this._data.context.ioc.getAll<ResizeListener>(TYPES.ResizeListener);
        listeners.forEach(listener => listener.resizeListen(width, height));
    }

    /**
     * 监听键盘事件（ESC 退出全屏）
     */
    listenFullscreenChange(): void {
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && this._data.isFullscreen) {
                this.exitFullscreen();
            }
        });
    }
}
