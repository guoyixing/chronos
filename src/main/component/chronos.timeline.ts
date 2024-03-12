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
 * 年月日的字和矩形
 */
type DrawList = {
    dayRectList: Konva.Rect[],
    monthRectList: Konva.Rect[],
    yearRectList: Konva.Rect[],
    dayTextList: Text[],
    monthTextList: Text[],
    yearTextList: Text[],
}

/**
 * 1天所需要的毫秒
 */
const oneDayMillisecond = 86400000;

export class ChronosTimeline implements DragListener {

    private readonly context: Context;

    private readonly _layer: Konva.Layer;

    private readonly years: number;

    private readonly headWidth: number = 20;

    private readonly grid: GridConfig;

    constructor(context: Context, years: number, headWidth?: number) {
        this.context = context;
        this.grid = this.context.stageConfig.grid;
        this._layer = this.context.applyLayer("timeline");
        this.years = years;
        this.headWidth = headWidth ?? this.headWidth;
        this.stageMoveListen();
    }

    get layer() {
        return this._layer;
    }

    /**
     * 先预处理再去绘画图形
     */
    stageMoveListen(): void {
        this.drawAll();
    }

    /**
     * 通过日期获滑动窗口边界，天数,以及每天对应的 x 坐标
     *
     * @param offset 可以多画多少格
     */
    processingBounds(offset?: number): [slidingWindowList: TimeStructure, coordinateXList: number[]] {
        const [width] = this.context.getSize();

        const coordinate = this.context.getFixedCoordinate();
        const x = coordinate.x - coordinate.x % this.grid.size;

        const rightWidth = x + width + this.grid.size + this.grid.size * (offset || 1);
        const leftWidth = x - this.grid.size * (offset || 1);

        const coordinateXList = [];
        for (let i = leftWidth; i < rightWidth; i += this.grid.size) {
            coordinateXList.push(i + this.headWidth);
        }

        const slidingWindowList = this.processingDateTime(leftWidth, rightWidth);
        return [slidingWindowList, coordinateXList];
    }

    /**
     * 构建滑动窗口区域内的日期，正负数不敏感
     */
    processingDateTime(leftWidth: number, rightWidth: number): TimeStructure {
        const grid = this.context.stageConfig.grid;

        // 从某年开始
        const thisYear = new Date(this.years, 0, 0).getTime();

        leftWidth /= grid.size;
        rightWidth /= grid.size;
        const newLeftWidth = thisYear + leftWidth * oneDayMillisecond;
        const newRightWidth = thisYear + rightWidth * oneDayMillisecond;

        const result: TimeStructure = {};
        // 步长是一天
        for (let timestamp = newLeftWidth; timestamp <= newRightWidth; timestamp += oneDayMillisecond) {
            const datetime = new Date(timestamp);
            const year = datetime.getFullYear();

            // 加1更好的操作月份
            const month = datetime.getMonth() + 1;

            result[year] = result[year] || {};

            result[year][month] = result[year][month] || [];

            result[year][month].push(datetime.getDate());
        }
        return result;
    }

    /**
     * 绘画年月日
     */
    drawAll() {
        const drawList = this.buildDrawList();

        this.drawYear(drawList);
        this.drawMonth(drawList);
        this.drawDay(drawList);

        // 渲染绘画
        Object.keys(drawList).forEach(key => {
            this._layer.add(...drawList[key as keyof DrawList]);
        });
    }

    drawYear(drawList: DrawList) {
        const [slidingWindowList, coordinateXList] = this.processingBounds();
        const coordinate = this.context.getFixedCoordinate();

        // 绘制年份的字
        let yearTextX = coordinate.x;

        // 上一个月份的坐标
        let yearNextX = 0;
        for (const year in slidingWindowList) {
            // 记录一下月份第一次绘制的坐标
            const beginYear = yearNextX;

            for (const month in slidingWindowList[year]) {
                yearNextX += slidingWindowList[year][month].length;
            }

            // 绘制年份的矩形
            const yearX = coordinateXList[beginYear];
            const yearWidth = yearNextX * this.grid.size;
            const yearRect = this.buildYearRect(yearX, coordinate.y, yearWidth, this.grid, "#ea6924");

            if (yearWidth > this.grid.size * 5) {
                const yearText = this.buildText(yearTextX + yearWidth / 2, coordinate.y, year + "年");
                drawList.yearTextList.push(yearText);
            }

            drawList.yearRectList.push(yearRect);
            yearTextX += yearWidth;
        }
    }

    drawMonth(drawList: DrawList) {
        const [slidingWindowList, coordinateXList] = this.processingBounds(20);
        const coordinate = this.context.getFixedCoordinate();

        // 上一个月份的坐标
        let monthNextX = 0;
        const monthY = coordinate.y + this.grid.size;

        // 绘制 [ 月 ]
        for (const year in slidingWindowList) {
            for (const month in slidingWindowList[year]) {
                // 这个月的天数
                const dayList = slidingWindowList[year][month];
                // 按每个月有多少天计算月份条的宽度
                const monthDrawWidth = (dayList.length) * this.grid.size;
                const monthX = coordinateXList[monthNextX];
                // 绘制月份
                const monthRect = this.buildMonthRect(monthX, monthY, monthDrawWidth, this.grid);
                const monthText = this.buildText(monthX + monthDrawWidth / 2, monthY, month + "月");

                drawList.monthRectList.push(monthRect);
                drawList.monthTextList.push(monthText);

                // 告诉下一个月我这次画了几天
                monthNextX += dayList.length;
            }
        }
    }

    drawDay(drawList: DrawList) {
        const [slidingWindowList, coordinateXList] = this.processingBounds();
        const coordinate = this.context.getFixedCoordinate();

        // 坐标系反转, 第N个 day 可以从表尾 pop
        const coordinateXListReverse = [...coordinateXList].reverse();
        const dayY = coordinate.y + this.grid.size * 2;

        // 绘制 [ 日 ] 三重for循环,但循环次数没有增加
        for (const year in slidingWindowList) {
            for (const month in slidingWindowList[year]) {
                // 斑马线
                const dayColor = parseInt(month) % 2 == 0 ? "#54A754" : "#359EE8";
                // 这个月的天数
                const dayList = slidingWindowList[year][month];
                // 搜集天和天数的框框
                for (const element of dayList) {
                    const dayX = coordinateXListReverse.pop();
                    const dayText = this.buildText(dayX!, dayY, String(element));
                    const dayRect = this.buildDayRect(dayX!, dayY, dayColor, this.grid);

                    drawList.dayRectList.push(dayRect);
                    drawList.dayTextList.push(dayText);
                }
            }
        }
    }

    /**
     * 绘画列表
     */
    private buildDrawList(): DrawList {
        return {
            dayRectList: [],
            monthRectList: [],
            yearRectList: [],
            dayTextList: [],
            yearTextList: [],
            monthTextList: [],
        };
    }

    private buildYearRect(x: number, y: number, width: number, grid: GridConfig, color: string) {
        return new Konva.Rect({
            x: x,
            y: y,
            width: width,
            height: grid.size,
            strokeWidth: grid.width,

            // todo style
            fill: color,
            stroke: "black",
        });
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

    private buildText(x: number, y: number, text: string) {
        return new Konva.Text({
            x: x,
            y: y,
            fill: "#000",
            text: text,

            // todo style
            padding: 4,
            fontFamily: "Calibre",
            align: "center",
        });
    }
}