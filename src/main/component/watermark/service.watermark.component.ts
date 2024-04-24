import {inject, injectable} from "inversify";
import {ComponentService} from "../service.component";
import {TYPES} from "../../config/inversify.config";
import {ChronosWatermarkData} from "./data.watermark.component";
import {ChronosWindowComponent} from "../window/window.component";
import Konva from "konva";

/**
 * 水印-组件服务
 */
@injectable()
export class ChronosWatermarkService implements ComponentService {

    /**
     * 数据
     */
    private _data: ChronosWatermarkData

    /**
     * 窗体
     */
    private _window: ChronosWindowComponent

    constructor(@inject(TYPES.ChronosWatermarkData) data: ChronosWatermarkData,
                @inject(TYPES.ChronosWindowComponent) window: ChronosWindowComponent) {
        this._data = data;
        this._window = window;
    }

    /**
     * 绘制
     */
    draw(): void {
        const data = this._data;
        if (data.hide) {
            return
        }

        const {width, height} = this._window.service.getVisualRange()
        //获取当前左上角的坐标
        const coordinate = data.context.drawContext.getFixedCoordinate();

        //x起始坐标
        const x = coordinate.x - coordinate.x % data.lrSize;
        //y起始坐标
        const y = coordinate.y - coordinate.y % data.tbSize;

        const group = new Konva.Group({x: x, y: y});
        //绘制文字
        const length = data.text.size * data.text.content.length;
        for (let i = -length; i < width + data.lrSize; i += data.lrSize) {
            for (let j = -data.text.size; j < height + data.tbSize; j += data.tbSize) {
                group.add(new Konva.Text({
                    x: i,
                    y: j,
                    text: data.text.content,
                    fontSize: data.text.size,
                    fontFamily: data.text.font,
                    fill: data.text.color,
                    opacity: data.text.opacity,
                    rotation: data.rotation,
                    prefectDrawEnabled: false
                }));
            }
        }
        data.graphics = group;
        data.context.drawContext.rootLayer.add(group);
        group.moveToBottom()
    }

    /**
     * 重绘
     */
    redraw(): void {
        this._data.graphics?.destroy()
        this.draw()
    }

    open() {
        this._data.hide = false;
        this.draw()
    }

    close() {
        this._data.hide = true;
        this._data.graphics?.destroy();
    }
}