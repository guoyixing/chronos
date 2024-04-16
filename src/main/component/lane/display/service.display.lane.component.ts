import {ComponentService} from "../../service.component";
import {inject, injectable} from "inversify";
import {ChronosLaneDisplayData} from "./data.display.lane.component";
import {ChronosWindowComponent} from "../../window/window.component";
import {TYPES} from "../../../config/inversify.config";
import {ChronosLaneGroupComponent} from "../group/group.lane.component";
import Konva from "konva";

/**
 * 泳道显示控制器-组件服务
 */
@injectable()
export class ChronosLaneDisplayService implements ComponentService {

    /**
     * 数据
     */
    private _data: ChronosLaneDisplayData

    /**
     * 窗口
     */
    private _window: ChronosWindowComponent

    /**
     * 泳道组
     */
    private _laneGroup: ChronosLaneGroupComponent

    constructor(@inject(TYPES.ChronosLaneDisplayData) data: ChronosLaneDisplayData,
                @inject(TYPES.ChronosWindowComponent) window: ChronosWindowComponent,
                @inject(TYPES.ChronosLaneGroupComponent) laneGroup: ChronosLaneGroupComponent) {
        this._data = data;
        this._window = window;
        this._laneGroup = laneGroup;
    }

    /**
     * 绘制
     */
    draw(): void {
        const data = this._data;
        const fixedCoordinate = this._data.context.drawContext.getFixedCoordinate();
        const width = data.width ?? 0;
        const height = data.height ?? 0;
        const startOffSet = data.startOffSet;
        if (startOffSet === undefined) {
            return
        }

        const textGroup = this.drawTextGroup();

        //创建遮罩组
        const maskGroup = new Konva.Group({
            x: data.margin,
            y: data.margin,
        });
        maskGroup.add(textGroup);
        //创建遮罩
        maskGroup.clipFunc((ctx) => {
            ctx.rect(-1, -1, width, height - data.margin * 2);
        });

        const group = new Konva.Group({
            x: startOffSet.x + fixedCoordinate.x,
            y: startOffSet.y + fixedCoordinate.y,
        });

        //绘制背景
        const background = new Konva.Rect({
            x: 0,
            y: 0,
            width: width,
            height: height,
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
        group.add(maskGroup);

        this._data.graphics = group;
        this._data.layer?.add(group);
    }

    /**
     * 绘制文本组
     */
    drawTextGroup() {
        const data = this._data;
        const width = data.width;
        const height = data.height;
        //获取所有的泳道形
        const lanes = this._laneGroup.data.laneGroup;
        const textHeight = lanes.length * (data.text.marginBottom + data.text.fontSize);
        const textGroup = new Konva.Group({
            x: 0,
            y: data.text.offSetY,
            draggable: true,
            dragBoundFunc: function (pos) {
                if (height > textHeight + data.margin * 2) {
                    return {
                        x: this.getAbsolutePosition().x,
                        y: this.getAbsolutePosition().y
                    };
                }

                let y = pos.y
                const maxY = data.startOffSet.y + data.margin;
                if (y > maxY) {
                    y = maxY;
                }
                const minY = data.startOffSet.y + height - textHeight - data.margin;
                if (y < minY) {
                    y = minY;
                }
                return {
                    x: this.getAbsolutePosition().x,
                    y: y
                };
            },
        });

        textGroup.on('dragend', function () {
            data.text.offSetY = textGroup.y();
        })

        lanes.forEach((lane, index) => {
            const text = new Konva.Text({
                x: 0,
                y: index * data.text.marginBottom + index * data.text.fontSize,
                width: width,
                text: lane.data.name.replace(/[\r\n]/g, ""),
                fontSize: data.text.fontSize,
                fontFamily: data.text.fontFamily,
                fill: lane.data.hide ? data.text.color : data.text.hoverColor,
            });
            text.on('click', () => {
                lane.data.hide = !lane.data.hide;
                text.fill(lane.data.hide ? data.text.color : data.text.hoverColor);
                this._laneGroup.service.reDraw()
            })
            textGroup.add(text)
        });

        // <path d="M426.666667 741.930667H360.277333A221.610667 221.610667 0 1 1 360.277333 298.666667H426.666667v64H360.277333a157.610667 157.610667 0 0 0 0 315.264H426.666667v64zM597.333333 298.666667h66.389334a221.610667 221.610667 0 0 1 0 443.306666H597.333333v-64h66.389334a157.610667 157.610667 0 0 0 0-315.306666H597.333333V298.666667z m-192 256h213.333334v-64h-213.333334V554.666667z"
        return textGroup;
    }

    /**
     * 关闭图层
     */
    close() {
        this._data.hide = true;
        this._data.graphics?.destroy();
    }

    /**
     * 开启图层
     */
    open() {
        this._data.hide = false;
        this.draw();
    }

    /**
     * 获取图层
     */
    setLayer() {
        return this._window.data.layer;
    }

    /**
     * 保持定位
     */
    keepPos() {
        const data = this._data;
        const fixedCoordinate = this._data.context.drawContext.getFixedCoordinate();
        data.graphics?.x(data.startOffSet.x + fixedCoordinate.x)
        data.graphics?.y(data.startOffSet.y + fixedCoordinate.y)
    }

}
