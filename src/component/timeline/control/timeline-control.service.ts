import {ComponentService} from "../../component-service.interface";
import {inject, injectable} from "inversify";
import {ChronosTimelineControlData} from "./timeline-control.data";
import {ChronosWindowComponent} from "../../window/window.component";
import {ChronosTimelineComponent} from "../timeline.component";
import {ChronosScaleData} from "../../scale/scale.data";
import {TYPES} from "../../../config/inversify.config";
import Konva from "konva";

/**
 * 时间轴控制面板-组件服务
 */
@injectable()
export class ChronosTimelineControlService implements ComponentService {

    private _data: ChronosTimelineControlData;
    private _window: ChronosWindowComponent;
    private _timeline: ChronosTimelineComponent;
    private _scaleData: ChronosScaleData;

    constructor(
        @inject(TYPES.ChronosTimelineControlData) data: ChronosTimelineControlData,
        @inject(TYPES.ChronosWindowComponent) window: ChronosWindowComponent,
        @inject(TYPES.ChronosTimelineComponent) timeline: ChronosTimelineComponent,
        @inject(TYPES.ChronosScaleData) scaleData: ChronosScaleData
    ) {
        this._data = data;
        this._window = window;
        this._timeline = timeline;
        this._scaleData = scaleData;
    }

    draw(): void {
        const data = this._data;
        const fixedCoordinate = this._data.context.drawContext.getFixedCoordinate();
        
        const group = new Konva.Group({
            x: data.startOffSet.x + fixedCoordinate.x,
            y: data.startOffSet.y + fixedCoordinate.y,
        });

        // 绘制背景
        const background = new Konva.Rect({
            x: 0,
            y: 0,
            width: data.width,
            height: data.height,
            fill: data.backgroundColor,
            stroke: data.borderColor,
            strokeWidth: data.border,
            cornerRadius: data.radius,
            shadowColor: data.shadow.color,
            shadowBlur: data.shadow.blur,
            shadowOffset: data.shadow.offset,
            shadowOpacity: data.shadow.opacity,
            listening: false,
        });
        group.add(background);

        // 绘制6个级别开关（横向排列）
        const textGroup = this.drawTextGroup();
        group.add(textGroup);

        this._data.graphics = group;
        this._data.layer?.add(group);
    }

    /**
     * 绘制文本开关组（横向排列，垂直水平居中）
     */
    private drawTextGroup(): Konva.Group {
        const data = this._data;
        const levels = this._timeline.data.levelOrder;
        const labels = this._timeline.data.levelLabels;
        
        // 先计算所有文本的总宽度
        const tempTexts: Konva.Text[] = [];
        let totalWidth = 0;
        
        levels.forEach((level) => {
            const isVisible = this._timeline.data.levelVisibility[level];
            const text = new Konva.Text({
                text: labels[level],
                fontSize: data.text.fontSize,
                fontFamily: data.text.fontFamily,
                fontStyle: 'bold',
                fill: isVisible ? data.text.hoverColor : data.text.color,
            });
            tempTexts.push(text);
            totalWidth += text.width();
        });
        
        // 加上间距
        totalWidth += (levels.length - 1) * data.text.marginRight;
        
        // 计算水平居中的起始X坐标
        const startX = (data.width - totalWidth) / 2;
        // 计算垂直居中的Y坐标
        const textHeight = tempTexts[0]?.height() ?? data.text.fontSize;
        const startY = (data.height - textHeight) / 2;
        
        const textGroup = new Konva.Group({
            x: startX,
            y: startY,
        });

        let currentX = 0;

        levels.forEach((level, index) => {
            const text = tempTexts[index];
            if (!text) return;
            
            text.x(currentX);
            text.y(0);
            
            // 点击切换可见性并触发 timeline 重绘
            text.on('click', () => {
                this._timeline.data.levelVisibility[level] = 
                    !this._timeline.data.levelVisibility[level];
                text.fill(this._timeline.data.levelVisibility[level] 
                    ? data.text.hoverColor 
                    : data.text.color);
                // 调用 timeline 的 reDraw 方法
                this._timeline.reDraw();
            });

            // 鼠标悬停效果
            text.on('mouseover', () => {
                document.body.style.cursor = 'pointer';
            });
            text.on('mouseout', () => {
                document.body.style.cursor = 'default';
            });
            
            textGroup.add(text);
            
            // 更新下一个文本的X位置
            currentX += text.width() + data.text.marginRight;
        });

        return textGroup;
    }

    close() {
        this._data.hide = true;
        this._data.graphics?.destroy();
    }

    open() {
        this._data.hide = false;
        // 重新计算位置（适应窗口变化）
        this._data.recalculatePosition(this._scaleData);
        this.draw();
    }

    /**
     * 获取图层 - 复用 window layer
     */
    setLayer() {
        return this._window.data.layer;
    }

    /**
     * 保持定位（拖拽时）
     */
    keepPos() {
        const data = this._data;
        const fixedCoordinate = this._data.context.drawContext.getFixedCoordinate();
        data.graphics?.x(data.startOffSet.x + fixedCoordinate.x);
        data.graphics?.y(data.startOffSet.y + fixedCoordinate.y);
    }
}
