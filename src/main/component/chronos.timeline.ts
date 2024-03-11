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

    private readonly headWidth: number = 80;

    constructor(context: Context, years: number, headWidth?: number) {
        this.context = context;
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
        const rightWidth = x + width + grid.size;
        const leftWidth = x - grid.size;

        const coordinateXList = [];
        for (let i = leftWidth; i < rightWidth; i += grid.size) {
            coordinateXList.push(i + this.headWidth);
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
     *
     * @param slidingWindowList 滑动窗口的时间集合
     * @param coordinateXList   预处理好的 x 坐标集合
     */
    drawAll(slidingWindowList: TimeStructure, coordinateXList: number[]) {
        const grid = this.context.stageConfig.grid;
        const coordinate = this.context.getFixedCoordinate();

        // 坐标系反转, 第N个 day 可以从表尾 pop
        const coordinateXListReverse = [...coordinateXList].reverse();

        const drawList = this.buildDrawList();

        // 上一个月份的坐标
        let monthNextX = 0;
        const dayY = coordinate.y + grid.size * 2;
        const monthY = dayY - grid.size;
        const yearY = coordinate.y;

        const yearWidthList: {
            [year: string]: number
        } = {};

        // 绘制 [ 月, 日 ] 三重for循环,但循环次数没有增加,虽然长得很可疑但是很合理
        for (const year in slidingWindowList) {
            // 记录一下月份第一次绘制的坐标
            const beginYear = monthNextX;

            for (const month in slidingWindowList[year]) {
                // 斑马线
                const dayColor = parseInt(month) % 2 == 0 ? "#54A754" : "#359EE8";

                // 这个月的天数
                const dayList = slidingWindowList[year][month];

                // 搜集天和天数的框框
                for (const element of dayList) {
                    const dayX = coordinateXListReverse.pop();
                    const dayText = this.buildText(dayX!, dayY, String(element));
                    const dayRect = this.buildDayRect(dayX!, dayY, dayColor, grid);

                    drawList.dayRectList.push(dayRect);
                    drawList.dayTextList.push(dayText);
                }

                // 按每个月有多少天计算月份条的宽度
                const monthDrawWidth = (dayList.length) * grid.size;
                const monthX = coordinateXList[monthNextX];

                // 绘制月份
                const monthRect = this.buildMonthRect(monthX, monthY, monthDrawWidth, grid);
                drawList.monthRectList.push(monthRect);

                // 小于两个方格不绘画
                if (monthDrawWidth > 2 * grid.size) {
                    const monthText = this.buildText(monthX + monthDrawWidth / 2, monthY, month + "月");
                    drawList.monthTextList.push(monthText);
                }

                // 增加这个年的宽度
                yearWidthList[year] = yearWidthList[year] || 0;
                yearWidthList[year] += dayList.length * grid.size;

                // 告诉下一个月我这次画了几天
                monthNextX += dayList.length;
            }

            // 绘制年份的矩形
            const yearWidth = monthNextX * grid.size;
            const yearRect = this.buildYearRect(coordinateXList[beginYear], yearY, yearWidth, grid, "#ea6924");
            drawList.yearRectList.push(yearRect);
        }

        // 绘制年份的字
        let yearTextX = coordinate.x;
        const [windowWidth] = this.context.getSize();
        for (const year in slidingWindowList) {
            // 窗口和月份长度的比例 * 窗口的大小
            const yearTextWidth = windowWidth * (yearWidthList[year] / (monthNextX * grid.size)) + this.headWidth;
            const center = yearTextWidth / 2;

            if (yearTextWidth > windowWidth / 4) {
                const yearText = this.buildText(yearTextX + center, yearY, year + "年");
                drawList.yearTextList.push(yearText);
            }

            yearTextX += yearTextWidth;
        }

        // 渲染绘画
        Object.keys(drawList).forEach(key => {
            // 使用JS的语法糖屏蔽一下报错
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            const listElement = drawList[key];
            this._layer.add(...listElement);
        });
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