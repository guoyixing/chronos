import {inject, injectable} from "inversify";
import {ComponentService} from "../component-service.interface";
import Konva from "konva";
import {ChronosToolbarData} from "./toolbar.data";
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
        const x = coordinate.x + data.startOffSet.x;
        //y坐标
        const y = coordinate.y + data.startOffSet.y
        const group = new Konva.Group({x: x, y: y});
        //绘制背景
        this.drawBackground(group);
        //绘制工具组
        this.drawToolbarGroup(group);
        this._data.graphics = group;
        this._data.layer?.add(group);
    }


    /**
     * 绘制工具组（支持多行布局和展开方向）
     * @private
     */
    drawToolbarGroup(group: Konva.Group) {
        const data = this._data;
        const itemsPerRow = data.itemsPerRow > 0 ? data.itemsPerRow : data.toolPlugs.length;
        const visibleRows = data.visibleRows;
        const maxVisibleItems = visibleRows * itemsPerRow;
        const isUpward = data.expandDirection === 'up';

        //绘制工具
        data.toolPlugs.forEach((tool, index) => {
            // 跳过超出可见范围的按钮
            if (index >= maxVisibleItems) {
                return;
            }

            // 计算按钮在网格中的位置
            const row = Math.floor(index / itemsPerRow);
            const col = index % itemsPerRow;
            const buttonX = col * data.buttonWidth;
            
            // 向上展开时，行顺序从底部开始（反转 y 坐标）
            let buttonY: number;
            if (isUpward) {
                // 向上展开：第一行在底部，新行在上方
                buttonY = (visibleRows - 1 - row) * data.buttonHeight;
            } else {
                // 向下展开：第一行在顶部，新行在下方
                buttonY = row * data.buttonHeight;
            }

            const background = new Konva.Rect({
                x: 0,
                y: 0,
                width: data.buttonWidth,
                height: data.buttonHeight,
                fill: data.button.background.color,
                stroke: data.borderColor,
                strokeWidth: data.border,
                cornerRadius: data.radius
            });

            const graphics = tool.graphics(data.button);
            graphics.x(background.width() / 2 - data.button.stroke.length / 2)
            graphics.y(background.height() / 2)

            const button = new Konva.Group({x: buttonX, y: buttonY})
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
        });

        // 绘制展开/收缩按钮（如果需要）
        if (data.needsExpandButton) {
            this.drawExpandButton(group, itemsPerRow);
        }
    }

    /**
     * 绘制展开/收缩切换按钮
     * @private
     */
    private drawExpandButton(group: Konva.Group, itemsPerRow: number) {
        const data = this._data;
        const isUpward = data.expandDirection === 'up';
        
        // 按钮位置：每行最后一个位置
        const buttonX = itemsPerRow * data.buttonWidth;
        // 向上展开时，展开按钮在底部行；向下展开时，在顶部行
        const buttonY = isUpward ? (data.visibleRows - 1) * data.buttonHeight : 0;

        const background = new Konva.Rect({
            x: 0,
            y: 0,
            width: data.buttonWidth,
            height: data.buttonHeight,
            fill: data.button.background.color,
            stroke: data.borderColor,
            strokeWidth: data.border,
            cornerRadius: data.radius
        });

        // 根据展开方向和展开状态确定箭头方向
        // 向上展开：收缩时显示向上箭头，展开时显示向下箭头
        // 向下展开：收缩时显示向下箭头，展开时显示向上箭头
        let arrowPath: string;
        if (isUpward) {
            arrowPath = data.expanded
                ? 'M 0 -3 L 5 3 L 10 -3'  // 向下箭头（收缩，向下收）
                : 'M 0 3 L 5 -3 L 10 3';  // 向上箭头（展开，向上展）
        } else {
            arrowPath = data.expanded
                ? 'M 0 3 L 5 -3 L 10 3'   // 向上箭头（收缩，向上收）
                : 'M 0 -3 L 5 3 L 10 -3'; // 向下箭头（展开，向下展）
        }

        const arrow = new Konva.Path({
            data: arrowPath,
            stroke: data.button.stroke.color,
            strokeWidth: data.button.stroke.width,
            lineCap: 'round',
            lineJoin: 'round'
        });
        arrow.x(background.width() / 2 - 5);  // 居中
        arrow.y(background.height() / 2);

        const button = new Konva.Group({x: buttonX, y: buttonY});
        button.add(background);
        button.add(arrow);

        button.on('click', () => {
            // 切换展开状态
            data.expanded = !data.expanded;
            // 向上展开时需要重新计算位置（因为高度变化会影响起始坐标）
            if (isUpward) {
                const window = this._window;
                data.recalculatePosition(window.data.width, window.data.height);
            }
            // 重绘工具栏
            data.graphics?.destroy();
            this.draw();
        });

        button.on('mouseover', () => {
            document.body.style.cursor = 'pointer';
            background.fill(data.button.background.hoverColor);
            arrow.stroke(data.button.stroke.hoverColor);
        });

        button.on('mouseout', () => {
            document.body.style.cursor = 'default';
            background.fill(data.button.background.color);
            arrow.stroke(data.button.stroke.color);
        });

        group.add(button);
    }

    /**
     * 绘制背景
     */
    private drawBackground(group: Konva.Group) {
        const data = this._data;
        //获取固定坐标
        // fixedCoordinate 未使用，但保留注释说明原意
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
