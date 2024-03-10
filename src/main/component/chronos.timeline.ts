import {Context} from "../context/context";
import Konva from "konva";
import {DragListener} from "../context/drag.event";
import {Text} from "konva/lib/shapes/Text";
import {GridConfig} from "../metadata/config/config.stage.grid";

/** example:
 * {
 *   2023:{
 *        1: [14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
 *        2: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
 *   },
 *   2022: {
 *       11:[1,2,3],
 *       12:[28,29,30]
 *   }
 * }
 */
type TimeStructure = {
    [years: number]: { [month: number]: number[], }
}

/**
 * 1天所需要的毫秒
 */
const oneDayMillisecond = 86400000;

export class ChronosTimeline implements DragListener {

    private readonly context: Context;

    private readonly _layer: Konva.Layer;

    private readonly years: number;

    constructor(context: Context,years:number) {
        this.context = context;
        this._layer = this.context.applyLayer("timeline");
        this.years = years;
        this.stageMoveListen();
    }

    get layer() {
        return this._layer;
    }

    /**
     * 先预处理再去绘画图形
     */
    stageMoveListen(): void {
        const [slidingWindowList, coordinateXList] = this.preprocessing();
        this.drawAll(slidingWindowList, coordinateXList);
    }

    /**
     * 预处理数据
     *
     * 处理滑动窗口内的天数,以及每天对应的 x 坐标
     */
    preprocessing(): [slidingWindowList: TimeStructure, coordinateXList: number[]] {
        const [width] = this.context.getSize();
        const grid = this.context.stageConfig.grid;

        const coordinate = this.context.getFixedCoordinate();
        const x = coordinate.x - coordinate.x % grid.size;

        // grid.size * 2 向右多画一格
        const rightWidth = x + width + grid.size * 2;
        const leftWidth = x - grid.size;

        const coordinateXList = [];
        for (let i = leftWidth; i < rightWidth; i += grid.size) {
            coordinateXList.push(i);
        }

        const slidingWindowList = this.processingSlidingWindowDate(leftWidth, rightWidth);

        return [slidingWindowList, coordinateXList];
    }

    /**
     * 构建滑动窗口区域内的日期，正负数不敏感
     */
    processingSlidingWindowDate(leftWidth: number, rightWidth: number): TimeStructure {
        const grid = this.context.stageConfig.grid;

        // 从某年开始
        const thisYear = new Date(this.years, 0, 0).getTime();

        // 最左网格数 * 天， +1 是提前向左绘画一天
        const newLeftWidth = thisYear + (leftWidth / grid.size + 1) * oneDayMillisecond;
        const newRightWidth = thisYear + (rightWidth / grid.size) * oneDayMillisecond;

        const result: TimeStructure = {};

        // 步长是一天
        for (let timestamp = newLeftWidth; timestamp <= newRightWidth; timestamp += oneDayMillisecond) {
            const datetime = new Date(timestamp);
            const year = datetime.getFullYear();

            // 加1更好的操作月份
            const month = datetime.getMonth() + 1;

            result[year] = result[year] ? result[year] : {};
            result[year][month] = result[year][month] ? result[year][month] : [];

            result[year][month].push(datetime.getDate());
        }
        return result;
    }

    /**
     * 绘画年月日
     *
     * @param slidingWindowList 滑动窗口的时间集合
     * @param coordinateXList   预处理好的 x 坐标集合
     */
    drawAll(slidingWindowList: TimeStructure, coordinateXList: number[]) {
        const grid = this.context.stageConfig.grid;
        const coordinate = this.context.getFixedCoordinate();

        const dayY = coordinate.y + grid.size * 2;
        const monthY = dayY - grid.size;

        // 坐标系反转, 第N个 day 可以从表尾 pop
        const coordinateXListReverse = coordinateXList.reverse();

        // 扩展运算符克隆回来
        coordinateXList = [...coordinateXListReverse].reverse();

        // 最终绘画的对象
        const drawList: {
            dayTextList: Text[],
            monthTextList: Text[],
            dayRectList: Konva.Rect[],
            monthRectList: Konva.Rect[],
        } = {monthRectList: [], monthTextList: [], dayTextList: [], dayRectList: []};

        // 绘制月份的坐标
        let monthNextX = 0;

        // 虽然长得很可疑但是很合理
        // 重量级三重for循环,但循环次数没有增加
        for (const year in slidingWindowList) {
            for (const month in slidingWindowList[year]) {

                // 斑马线
                const dayColor = parseInt(month) % 2 == 0 ? "#54A754" : "#359EE8";

                // 这个月的天数
                const dayList = slidingWindowList[year][month];

                // 搜集天和天数的框框
                for (let i = 0; i < dayList.length; i++) {
                    const x = coordinateXListReverse.pop();

                    const dayText = this.buildText(x!, dayY, String(dayList[i]), grid.width);
                    const rect = this.buildDayRect(x!, dayY, dayColor, grid);

                    drawList.dayRectList.push(rect);
                    drawList.dayTextList.push(dayText);
                }

                const monthDrawWidth = (dayList.length) * grid.size;
                const monthX = coordinateXList[monthNextX];

                const monthText = this.buildText(monthX, monthY, month + "月", monthDrawWidth);
                const monthRect = this.buildMonthRect(monthX, monthY, monthDrawWidth, grid);

                drawList.monthTextList.push(monthText);
                drawList.monthRectList.push(monthRect);

                monthNextX += dayList.length;
            }
        }

        this._layer.add(...drawList.dayRectList);
        this._layer.add(...drawList.dayTextList);

        this._layer.add(...drawList.monthRectList);
        this._layer.add(...drawList.monthTextList);
    }

    private buildMonthRect(x: number, y: number, width: number, grid: GridConfig) {
        return new Konva.Rect({
            x: x,
            y: y,
            width: width,
            height: grid.size,
            strokeWidth: grid.width,

            // todo style
            fill: "#E8B732",
            stroke: "black",
        });
    }

    private buildDayRect(x: number, y: number, color: string, grid: GridConfig) {
        return new Konva.Rect({
            x: x,
            y: y,
            width: grid.size,
            height: grid.size,
            strokeWidth: grid.width,

            // todo style
            fill: color,
            stroke: "black",
        });
    }

    private buildText(x: number, y: number, text: string, width: number) {
        return new Konva.Text({
            x: x,
            y: y,
            fill: "#000",
            text: text,
            strokeWidth: width,

            // todo style
            padding: 4,
            fontFamily: "Calibre",
            align: "center",
        });
    }
}