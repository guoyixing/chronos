import {inject, injectable} from "inversify";
import {ComponentService} from "../service.component";
import Konva from "konva";
import {ChronosToolbarData} from "./data.toolbar.component";
import {TYPES} from "../../config/inversify.config";
import {ChronosWindowComponent} from "../window/window.component";

/**
 * 工具栏-组件服务
 */
@injectable()
export class ChronosToolbarService implements ComponentService {

    /**
     * 数据
     */
    private _data: ChronosToolbarData

    /**
     * 窗口
     */
    private _window: ChronosWindowComponent

    constructor(@inject(TYPES.ChronosToolbarData) data: ChronosToolbarData,
                @inject(TYPES.ChronosWindowComponent) window: ChronosWindowComponent) {
        this._data = data;
        this._window = window;
    }

    /**
     * 绘制
     */
    draw(): void {
        const group = new Konva.Group();
        //绘制背景
        this.drawBackground(group);
        //绘制工具组
        this.drawToolbarGroup(group);
        this._data.layer?.add(group);
    }


    /**
     * 绘制工具组
     * @private
     */
    drawToolbarGroup(group: Konva.Group) {
        const data = this._data;

        const fixedCoordinate = data.context.drawContext.getFixedCoordinate();
        //下一个元素的y坐标
        let nextY = 0;

        //绘制工具
        data.toolPlugs.forEach((tool) => {
            const text = new Konva.TextPath({
                x: data.startOffSet.x + fixedCoordinate.x + data.width / 2,
                y: data.startOffSet.y + fixedCoordinate.y + nextY + data.plugMargin,
                text: tool.name,
                fontSize: data.fontSize,
                fill: data.textColor,
                data: data.textDirection
            });
            text.on('click', () => {
                tool.callback();
            });

            text.on('mouseover', () => {
                document.body.style.cursor = 'pointer';
                text.fill(data.hoverTextColor);
            });

            text.on('mouseout', () => {
                document.body.style.cursor = 'default';
                text.fill(data.textColor);
            });

            group.add(text);
            nextY += text.text().length * data.fontSize + data.plugMargin;
        });
    }

    /**
     * 绘制背景
     */
    private drawBackground(group: Konva.Group) {
        const data = this._data;

        //获取固定坐标
        const fixedCoordinate = data.context.drawContext.getFixedCoordinate();
        //绘制工具栏底色
        const rect = new Konva.Rect({
            x: data.startOffSet.x + fixedCoordinate.x,
            y: data.startOffSet.y + fixedCoordinate.y,
            width: data.width,
            height: this._window.data.height - this._window.data.border * 2,
            fill: data.backgroundColor,
            stroke: data.backgroundBorderColor,
            strokeWidth: data.backgroundBorder
        });
        group.add(rect);
    }

    /**
     * 获取图层
     */
    setLayer() {
        return this._window.data.layer;
    }

}
