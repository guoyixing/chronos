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

    id:string = "scale"

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
        const minus = new Konva.Text({
            x: 0,
            y: 0,
            text: "-",
            fontSize: data.buttonFontSize,
            fill: data.buttonTextColor,
            fontFamily: data.buttonFontFamily
        })
        minus.x(background.width() - minus.width() - data.buttonRightMargin)
        minus.y(background.height() / 2 - minus.height() / 2)

        minus.on('mousemove', () => {
            minus.fill(data.buttonHoverTextColor)
        })
        minus.on('mouseout', () => {
            minus.fill(data.buttonTextColor)
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
        //绘制加号
        const plus = new Konva.Text({
            x: 0,
            y: 0,
            text: "+",
            fontSize: data.buttonFontSize,
            fill: data.buttonTextColor,
            fontFamily: data.buttonFontFamily
        })
        plus.x(data.buttonLeftMargin)
        plus.y(background.height() / 2 - plus.height() / 2)

        plus.on('mousemove', () => {
            plus.fill(data.buttonHoverTextColor)
        })
        plus.on('mouseout', () => {
            plus.fill(data.buttonTextColor)
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
            strokeWidth: data.border
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