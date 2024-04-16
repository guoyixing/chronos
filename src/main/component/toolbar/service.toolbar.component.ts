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
        const data = this._data;
        const coordinate = this._data.context.drawContext.getFixedCoordinate();
        //x坐标
        let x = coordinate.x + data.startOffSet.x;
        //y坐标
        let y = coordinate.y + data.startOffSet.y
        const group = new Konva.Group({x: x, y: y});
        //绘制背景
        this.drawBackground(group);
        //绘制工具组
        this.drawToolbarGroup(group);
        this._data.graphics = group;
        this._data.layer?.add(group);
    }


    /**
     * 绘制工具组
     * @private
     */
    drawToolbarGroup(group: Konva.Group) {
        const data = this._data;
        //下一个元素的y坐标
        let nextX = 0;

        //绘制工具
        data.toolPlugs.forEach((tool, index) => {
            const background = new Konva.Rect({
                x: 0,
                y: 0,
                width: data.button.stroke.margin.left + data.button.stroke.margin.right + data.button.stroke.length,
                height: data.height,
                fill: data.button.background.color,
                stroke: data.borderColor,
                strokeWidth: data.border,
                cornerRadius: data.radius
            });

            const graphics = tool.graphics(data.button);
            graphics.x(background.width() / 2 - data.button.stroke.length / 2)
            graphics.y(background.height() / 2)

            const button = new Konva.Group({x: nextX, y: 0})
            button.add(background)
            button.add(graphics)


            button.on('click', () => {
                tool.callback(graphics, data.button, data);
            });

            button.on('mouseover', () => {
                document.body.style.cursor = 'pointer';
                background.fill(data.button.background.hoverColor)
            });

            button.on('mouseout', () => {
                document.body.style.cursor = 'default';
                background.fill(data.button.background.color)
            });

            group.add(button);
            nextX += background.width();
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
            x: 0,
            y: 0,
            width: data.width,
            height: data.height,
            fill: data.backgroundColor,
            stroke: data.borderColor,
            strokeWidth: data.border,
            cornerRadius: data.radius
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
