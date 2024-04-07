import {ComponentService} from "../service.component";
import {inject, injectable} from "inversify";
import {ChronosScaleData} from "./data.scale.component";
import {TYPES} from "../../config/inversify.config";
import Konva from "konva";
import {EVENT_TYPES, EventPublisher} from "../../core/event/event";

/**
 * 比例尺-组件服务
 */
@injectable()
export class ChronosScaleService implements ComponentService, EventPublisher {

    id: string = "scale"

    /**
     * 数据
     */
    private _data: ChronosScaleData

    constructor(@inject(TYPES.ChronosScaleData) data: ChronosScaleData) {
        this._data = data;
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

        const background = this.drawBackground();

        const plus = this.drawPlus(background);

        const text = this.drawText(background);

        //绘制减号
        const minus = this.drawMinus(background);


        const group = new Konva.Group({x: x, y: y})
        group.add(background)
        group.add(plus)
        group.add(text)
        group.add(minus)

        data.graphics = group
        data.layer?.add(group)
    }

    /**
     * 重绘
     */
    redraw(): void {
        this._data.graphics?.destroy()
        this.draw()
    }

    /**
     * 绘制减号
     * @param background 背景
     */
    drawMinus(background: Konva.Rect) {
        const data = this._data;
        const button = data.button;
        //线条长度
        const line = button.stroke.length;
        const path = `M0 0h${line}`

        //绘制减号
        const minusText = new Konva.Path({
            x: 0,
            y: 0,
            data: path,
            stroke: button.stroke.color,
            strokeWidth: button.stroke.width,
            lineCap: 'round',
            lineJoin: 'round'
        })
        minusText.x(background.width() - line - button.stroke.margin.right)
        minusText.y(background.height() / 2 - minusText.height() / 2)

        //绘制减号背景
        const minusBackground = new Konva.Rect({
            x: data.width/4*3,
            y: 0,
            width: data.width/4,
            height: data.height,
            fill: button.background.color,
            cornerRadius: [0,data.radius,data.radius,0],
            stroke: data.borderColor,
            strokeWidth: data.border,
        })

        const minus = new Konva.Group();
        minus.add(minusBackground)
        minus.add(minusText)

        minus.on('mousemove', () => {
            minusText.stroke(button.stroke.hoverColor)
            minusBackground.fill(button.background.hoverColor)
        })
        minus.on('mouseout', () => {
            minusText.stroke(button.stroke.color)
            minusBackground.fill(button.background.color)
        })
        minus.on('click', () => {
            if (data.scaleX > data.scaleJump) {
                //解决精度问题
                data.scaleX = (data.scaleX * 10 - data.scaleJump * 10) / 10
                this.redraw()
                this.publish(EVENT_TYPES.ScaleUpdate)
                this.publish(EVENT_TYPES.ScaleReDraw)
            }
        })
        return minus;
    }

    /**
     * 绘制文字
     * @param background 背景
     */
    drawText(background: Konva.Rect) {
        const data = this._data;
        //绘制文字
        const text = new Konva.Text({
            x: 0,
            y: 0,
            //解决精度问题
            text: data.scaleX * 1000 / 10 + "%",
            fontSize: data.fontSize,
            fill: data.textColor
        })
        text.x(background.width() / 2 - text.width() / 2)
        text.y(background.height() / 2 - text.height() / 2)
        return text;
    }

    /**
     * 绘制加号
     * @param background 背景
     */
    drawPlus(background: Konva.Rect) {
        const data = this._data;
        const button = data.button;
        //线条长度
        const line = button.stroke.length;
        //计算竖线开始的位置
        const vY = -line / 2;
        const vX = line / 2;
        const path = `M${vX} ${vY}v${line}M0 0h${line}`

        //绘制加号
        const plusText = new Konva.Path({
            x: 0,
            y: 0,
            data: path,
            stroke: button.stroke.color,
            strokeWidth: button.stroke.width,
            lineCap: 'round',
            lineJoin: 'round'
        })
        plusText.x(button.stroke.margin.left)
        plusText.y(background.height() / 2 - plusText.height() / 2)

        //绘制加号背景
        const plusBackground = new Konva.Rect({
            x: 0,
            y: 0,
            width: data.width/4,
            height: data.height,
            fill: button.background.color,
            cornerRadius: [data.radius,0,0,data.radius],
            stroke: data.borderColor,
            strokeWidth: data.border,
        })

        const plus = new Konva.Group();
        plus.add(plusBackground)
        plus.add(plusText)

        plus.on('mousemove', () => {
            plusText.stroke(button.stroke.hoverColor)
            plusBackground.fill(button.background.hoverColor)
        })
        plus.on('mouseout', () => {
            plusText.stroke(button.stroke.color)
            plusBackground.fill(button.background.color)
        })
        plus.on('click', () => {
            //解决精度问题
            data.scaleX = (data.scaleX * 10 + data.scaleJump * 10) / 10
            this.redraw()
            this.publish(EVENT_TYPES.ScaleUpdate)
            this.publish(EVENT_TYPES.ScaleReDraw)
        })
        return plus;
    }

    /**
     * 绘制背景
     */
    drawBackground() {
        const data = this._data;
        //绘制背景
        return new Konva.Rect({
            x: 0,
            y: 0,
            width: data.width,
            height: data.height,
            fill: data.backgroundColor,
            stroke: data.borderColor,
            strokeWidth: data.border,
            cornerRadius: data.radius
        })
    }

    /**
     * 事件绑定
     * @param event 事件名称
     * @param callback 回调
     */
    on(event: symbol, callback: (data?: any) => void): void {
        const eventManager = this._data.context.eventManager;
        eventManager?.listen(this, event, callback)
    }

    /**
     * 发布事件
     * @param event 事件名称
     */
    publish(event: symbol): void {
        const eventManager = this._data.context.eventManager;
        eventManager?.publish(this, event)
    }
}