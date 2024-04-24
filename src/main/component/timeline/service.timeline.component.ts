import {ComponentService} from "../service.component";
import {inject, injectable} from "inversify";
import Konva from "konva";
import {ChronosTimelineData} from "./data.timeline.component";
import {TYPES} from "../../config/inversify.config";
import {ChronosWindowComponent} from "../window/window.component";
import {betweenMs, betweenMsAbs, getDaysInMonth} from "../../core/utils/DateUtils";
import {EVENT_TYPES} from "../../core/event/event";
import {ChronosScaleComponent} from "../scale/scale.component";

/**
 * 1天所需要的毫秒
 */
const oneDayMillisecond = 86400000;

/**
 * 时间轴-组件服务
 */
@injectable()
export class ChronosTimelineService implements ComponentService {

    /**
     * 数据
     */
    private _data: ChronosTimelineData

    /**
     * 窗口
     */
    private _window: ChronosWindowComponent

    /**
     * 比例尺
     */
    private _scale: ChronosScaleComponent

    constructor(@inject(TYPES.ChronosTimelineData) data: ChronosTimelineData,
                @inject(TYPES.ChronosWindowComponent) window: ChronosWindowComponent,
                @inject(TYPES.ChronosScaleComponent) scale: ChronosScaleComponent) {
        this._data = data;
        this._window = window;
        this._scale = scale;
    }

    draw(): void {
        this.drawShadow()
        this.drawYear()
        this.drawMonth()
        this.drawDay()
        this.drawHead()
    }

    /**
     * 绘制表头
     */
    drawHead() {
        const data = this._data;
        const coordinate = this._data.context.drawContext.getFixedCoordinate();

        //x坐标
        let x = coordinate.x + data.startOffSet.x;
        //y坐标
        let y = coordinate.y + data.startOffSet.y

        //绘制背景
        const background = new Konva.Rect({
            x: x,
            y: y,
            width: data.headWidth,
            height: data.rowHeight * 3,
            fill: 'white',
            shadowColor: data.shadow.color,
            shadowBlur: data.shadow.blur,
            shadowOffset: data.shadow.offset,
            shadowOpacity: data.shadow.opacity,
            cornerRadius: data.radius,
            prefectDrawEnabled: false
        });
        data.layer?.add(background)
        const texts = ['年', '月', '日']

        texts.forEach((text, index) => {
            let radius: number[] = [0, 0, 0, 0]
            if (index === 0) {
                radius = [0, data.radius, 0, 0]
            } else if (index === texts.length - 1) {
                radius = [0, 0, data.radius, 0]
            }

            //绘制年的矩形
            const headRect = new Konva.Rect({
                x: x,
                y: y,
                width: data.headWidth,
                height: data.rowHeight,
                strokeWidth: data.border,
                fill: data.backgroundColor[(index + 1) % data.backgroundColor.length],
                stroke: data.borderColor,
                cornerRadius: radius
            });
            const headText = new Konva.Text({
                x: x + (data.headWidth - data.fontSize) / 2,
                y: y + (data.rowHeight - data.fontSize) / 2,
                fontSize: data.fontSize,
                fontFamily: data.fontFamily,
                fill: data.textColor,
                text: text,
            })
            data.layer?.add(headRect)
            data.layer?.add(headText)

            y += data.rowHeight
        })


    }

    /**
     * 绘制年份
     */
    drawYear() {
        //获取下一个时间
        const getNextTime = (time: Date) => {
            return new Date(time.getFullYear() + 1, 0, 1)
        };

        //获取时间的文本
        const getText = (time: Date) => {
            return time.getFullYear()
        };

        this.calculateTime(0, getNextTime, getText, "年",
            (text, width, isMoveRight) => this.updateTimeX(text, width, isMoveRight))
    }

    /**
     * 绘制月份
     */
    drawMonth() {
        //获取下一个时间
        const getNextTime = (time: Date) => {
            if (time.getMonth() >= 11) {
                return new Date(time.getFullYear() + 1, 0, 1);
            } else {
                return new Date(time.getFullYear(), time.getMonth() + 1, 1);
            }
        };

        //获取时间的文本
        const getText = (time: Date) => {
            return time.getMonth() + 1
        };

        this.calculateTime(1, getNextTime, getText, "月",
            (text, width, isMoveRight) => this.updateTimeX(text, width, isMoveRight))
    }

    /**
     * 绘制天
     */
    drawDay() {
        //获取下一个时间
        const getNextTime = (time: Date) => {
            if (time.getDate() >= getDaysInMonth(time)) {
                if (time.getMonth() >= 11) {
                    return new Date(time.getFullYear() + 1, 0, 1);
                } else {
                    return new Date(time.getFullYear(), time.getMonth() + 1, 1);
                }
            } else {
                return new Date(time.getFullYear(), time.getMonth(), time.getDate() + 1);
            }
        };

        //获取时间的文本
        const getText = (time: Date) => {
            return time.getDate()
        };

        const updateTimeX = (text: Konva.Text, width: number, isMoveRight: boolean) => {
            const x = text.x();
            const data = this._data;
            if (width < data.dayWidth) {
                //格子比日期要求的宽度窄
                if (isMoveRight) {
                    //从左往右拖动，右边的日份宽度边小，字往右边移动
                    text.x(x + (data.dayWidth - text.width()) / 2)
                } else {
                    //从右往左拖动，左边的日份宽度边小，字往左边移动
                    text.x(x - (data.dayWidth - width) + (data.dayWidth - text.width()) / 2)
                }

            } else {
                //正常情况下居中显示
                text.x(x + (width - text.width()) / 2)
            }
        };

        this.calculateTime(2, getNextTime, getText, "", updateTimeX)
    }

    /**
     * 更新时间的x坐标
     * @param text 时间文本
     * @param width 宽度
     * @param isMoveRight 是否向右移动
     * @private
     */
    private updateTimeX(text: Konva.Text, width: number, isMoveRight: boolean) {
        const x = text.x();
        if (width < text.width() + 2 * this._data.textMargin) {
            //重新计算字的位置，当外框比字+外边距短的时候
            if (isMoveRight) {
                //从左往右拖动，右边的月份宽度边小，字往右边移动
                text.x(x + this._data.textMargin)
            } else {
                //从右往左拖动，左边的月份宽度边小，字往左边移动
                text.x(x + width - text.width() - this._data.textMargin)
            }
        } else {
            //正常情况下居中显示
            text.x(x + (width - text.width()) / 2)
        }
    };

    /**
     * 计算时间
     * @param rowNum 需要渲染在第几行
     * @param getNextTime 获取下一个时间的方法
     * @param getText 获取显示文本的方法
     * @param textUnit 文本单位
     * @param updateTextX 更新文本的x坐标的方法
     * @private
     */
    private calculateTime(rowNum: number,
                          getNextTime: (time: Date) => Date,
                          getText: (time: Date) => number,
                          textUnit: string,
                          updateTextX: (text: Konva.Text, width: number, isMoveRight: boolean) => void): void {
        const data = this._data;
        const coordinate = this._data.context.drawContext.getFixedCoordinate();

        //当前的日期
        const offsetDay = -(coordinate.x / data.dayWidth);
        const currentDay = new Date(data.initTime.getTime() - offsetDay * oneDayMillisecond);

        //剩余的宽度
        let surplusWidth = this._window.service.getVisualRange().width + this._window.data.border - data.startOffSet.x - data.headWidth + data.border * 2;
        //x坐标
        let x = coordinate.x + data.startOffSet.x + data.headWidth;
        //y坐标
        const y = coordinate.y + data.startOffSet.y + data.rowHeight * rowNum
        //时间
        let time = currentDay
        do {
            let nextTime = getNextTime(time);

            const toNextTimeMs = betweenMsAbs(time, nextTime);
            //计算出初始化时间的宽度
            const currentTimeWidth = toNextTimeMs * (data.dayWidth / oneDayMillisecond);

            //当前的长度比剩余长度长
            const flag = currentTimeWidth > surplusWidth;
            //宽度
            const width = flag ? surplusWidth : currentTimeWidth;

            //绘制时间的矩形
            const timeRect = new Konva.Rect({
                x: x - data.border * 2,
                y: y,
                width: width,
                height: data.rowHeight,
                strokeWidth: data.border,
                fill: data.backgroundColor[getText(time) % data.backgroundColor.length],
                stroke: data.borderColor,
            });
            //加入图层
            data.layer?.add(timeRect);

            if (width > data.textMinWidth) {
                //绘制时间的字
                const timeText = new Konva.Text({
                    x: x - data.border * 2,
                    y: y + (data.rowHeight - data.fontSize) / 2,
                    fontSize: data.fontSize,
                    fontFamily: data.fontFamily,
                    fill: data.textColor,
                    text: getText(time) + textUnit,
                    align: "center",
                });

                updateTextX(timeText, width, flag)
                data.layer?.add(timeText)
            }

            //剩余宽度
            surplusWidth -= currentTimeWidth;
            //更新坐标
            x += width;
            time = nextTime
        } while (surplusWidth > 0);
    }

    /**
     * 根据时间获取x坐标
     * @param time
     */
    getXByTime(time: Date) {
        const data = this._data;
        const coordinate = this._data.context.drawContext.getFixedCoordinate();

        //当前的日期
        const offsetDay = -(coordinate.x / data.dayWidth);
        const currentDay = new Date(data.initTime.getTime() - offsetDay * oneDayMillisecond);
        //计算当前时间相对于开始时间的距离
        const x = betweenMs(time, currentDay) * (data.dayWidth / oneDayMillisecond);
        //x坐标
        return coordinate.x + data.startOffSet.x + data.headWidth + x - data.border * 2;
    }

    /**
     * 根据x坐标获取时间
     * @param x x坐标
     */
    getTimeByX(x: number): Date {
        const data = this._data;
        const coordinate = this._data.context.drawContext.getFixedCoordinate();

        //当前的日期
        const offsetDay = -(coordinate.x / data.dayWidth);
        const currentDay = new Date(data.initTime.getTime() - offsetDay * oneDayMillisecond);

        //计算时间偏移量  （x坐标 - 起始x坐标 - 头部宽度）* （每个像素点代表的时间宽度）
        const time = (x - coordinate.x - data.startOffSet.x - data.headWidth + data.border * 2) * (oneDayMillisecond / data.dayWidth);
        //当前的时间（时间轴最左侧的时间）+时间偏移量
        return new Date(currentDay.getTime() + time);

    }

    /**
     * 获取当前的时间
     */
    getCurrentTime(): Date {
        const data = this._data;
        const coordinate = this._data.context.drawContext.getFixedCoordinate();
        return this.getTimeByX(coordinate.x + data.startOffSet.x + data.headWidth - data.border * 2)
    }

    /**
     * 监听比例尺
     */
    listenScale() {
        const dayWidth = this._data.dayWidth;
        this._scale.service.on(EVENT_TYPES.ScaleUpdate, () => {
            this._data.dayWidth = this._scale.data.scaleX * dayWidth;
        })

        this._scale.service.on(EVENT_TYPES.ScaleReDraw, () => {
            this._data.layer?.destroyChildren()
            this.draw()
        })
    }

    drawShadow() {
        const data = this._data;
        const coordinate = this._data.context.drawContext.getFixedCoordinate();
        //x坐标
        let x = coordinate.x + data.startOffSet.x + data.headWidth - data.border * 2;
        //y坐标
        const y = coordinate.y + data.startOffSet.y
        //绘制背景
        const background = new Konva.Rect({
            x: x,
            y: y,
            width: this._window.service.getVisualRange().width + this._window.data.border + data.border * 2,
            height: data.rowHeight * 3,
            fill: 'white',
            shadowColor: data.shadow.color,
            shadowBlur: data.shadow.blur,
            shadowOffset: data.shadow.offset,
            shadowOpacity: data.shadow.opacity,
            prefectDrawEnabled: false
        });
        data.layer?.add(background)
    }
}
