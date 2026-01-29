import {inject, injectable} from "inversify";
import {ChronosFullscreenData} from "./fullscreen.data";
import {ChronosFullscreenService} from "./fullscreen.service";
import {Lifecycle} from "../../core/lifecycle/lifecycle";
import {ChronosToolPlug, ToolbarPlugRegister} from "../toolbar/toolbar-plug.component";
import {BaseComponent} from "../component.interface";
import {TYPES} from "../../config/inversify.config";
import {ButtonType} from "../../core/common/type/button.type";
import Konva from "konva";
import {ChronosToolbarData} from "../toolbar/toolbar.data";

/**
 * 全屏-组件
 */
@injectable()
export class ChronosFullscreenComponent extends BaseComponent<ChronosFullscreenData, ChronosFullscreenService>
    implements Lifecycle, ToolbarPlugRegister {

    /**
     * 组件名称
     */
    name = () => "fullscreen"

    constructor(@inject(TYPES.ChronosFullscreenData) data: ChronosFullscreenData,
                @inject(TYPES.ChronosFullscreenService) service: ChronosFullscreenService) {
        super(data, service);
    }

    /**
     * 初始化
     */
    init(): void {
        // 监听全屏变化事件
        this.service.listenFullscreenChange();
    }

    /**
     * 启动
     */
    start(): void {
        // 全屏组件不需要绑制
    }

    /**
     * 工具栏插件注册
     */
    toolbar(): ChronosToolPlug {
        const graphics = (button: ButtonType) => {
            const size = button.stroke.length;

            // 全屏图标：四个角的箭头
            const path = this.data.isFullscreen
                ? this.getExitFullscreenPath(size)
                : this.getEnterFullscreenPath(size);

            return new Konva.Path({
                x: 0,
                y: 0,
                data: path,
                stroke: this.data.isFullscreen ? button.stroke.hoverColor : button.stroke.color,
                strokeWidth: button.stroke.width,
                lineJoin: 'round',
                lineCap: 'round',
            });
        };

        const callback = (graphics: Konva.Path, button: ButtonType, _toolbar: ChronosToolbarData) => {
            this.service.toggle();

            // 更新图标
            const size = button.stroke.length;
            const newPath = this.data.isFullscreen
                ? this.getExitFullscreenPath(size)
                : this.getEnterFullscreenPath(size);
            graphics.data(newPath);

            // 更新颜色
            graphics.stroke(this.data.isFullscreen ? button.stroke.hoverColor : button.stroke.color);
        };

        return new ChronosToolPlug("全屏", graphics, callback);
    }

    /**
     * 进入全屏的图标路径
     * 四个角的 L 形，向外扩展
     */
    private getEnterFullscreenPath(size: number): string {
        const s = size * 0.4;  // 半边长
        const corner = size * 0.15;  // 角落线长度
        // 四个角的 L 形
        return [
            // 左上角
            `M${-s} ${-s + corner}V${-s}H${-s + corner}`,
            // 右上角
            `M${s - corner} ${-s}H${s}V${-s + corner}`,
            // 右下角
            `M${s} ${s - corner}V${s}H${s - corner}`,
            // 左下角
            `M${-s + corner} ${s}H${-s}V${s - corner}`
        ].join('');
    }

    /**
     * 退出全屏的图标路径
     * 四个角的 L 形，向内收缩
     */
    private getExitFullscreenPath(size: number): string {
        const s = size * 0.4;  // 半边长
        const inner = size * 0.1;  // 内部偏移
        // 四个角向内的 L 形
        return [
            // 左上角（向内）
            `M${-s} ${-inner}V${-inner}H${-inner}`,
            // 右上角（向内）
            `M${inner} ${-inner}H${inner}V${-s}`,
            // 右下角（向内）
            `M${inner} ${inner}V${inner}H${s}`,
            // 左下角（向内）
            `M${-inner} ${inner}H${-inner}V${s}`
        ].join('');
    }

    /**
     * 排序
     */
    order(): number {
        return 9998;
    }
}
