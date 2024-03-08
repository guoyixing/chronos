import {DragListener} from "../context/drag.event";
import Konva from "konva";
import {Context} from "../context/context";

/**
 * 泳道组
 */
export class ChronosLaneGroup implements DragListener {

    /**
     * 图层
     */
    private readonly _layer: Konva.Layer

    /**
     * 上下文
     */
    readonly context: Context

    /**
     * 泳道组
     */
    private _laneGroup: Array<ChronosLane> = []

    /**
     * 元素行高
     */
    private _rowHeight: number = 40

    /**
     * 泳道左侧宽度
     */
    private _laneLeftWidth: number = 80

    /**
     * 渲染起始坐标
     */
    private _startOffSet: { x: number, y: number }

    /**
     * 高度
     */
    private _height: number = 0

    constructor(context: Context, startOffSet: {
                    x: number;
                    y: number
                }, rowHeight?: number, laneLeftWidth?: number,
    ) {
        this.context = context;
        this._rowHeight = rowHeight || this._rowHeight;
        this._laneLeftWidth = laneLeftWidth || this._laneLeftWidth;
        this._startOffSet = startOffSet;
        //申请图层
        this._layer = this.context.applyLayer('lane')
        //初始化泳道组
        this.initLaneGroup();
        //注册监听
        this.stageMoveListen();
    }

    /**
     * 绘制泳道组
     */
    draw() {
        const [width, height] = this.context.getSize()

        //计算泳道组起始坐标，y坐标是不变的，x坐标是根据舞台位置计算的
        const fixedCoordinate = this.context.getFixedCoordinate();

        //泳道组起始坐标
        const startX = fixedCoordinate.x + this._startOffSet.x;

        //左侧泳道分割矩形，x坐标
        const x = startX + this._laneLeftWidth
        //左侧泳道分割矩形，y开始坐标
        const y = this._startOffSet.y + fixedCoordinate.y
        //左侧泳道分割竖线，y结束坐标
        const yEnd = this._startOffSet.y + height + fixedCoordinate.y
        //左侧泳道分割竖线绘制
        const laneLeft = new Konva.Rect({
            x: startX,
            y: y,
            width: this._laneLeftWidth,
            height: height,
            fill: '#f0f0f0',
            stroke: 'black',
            strokeWidth: 1
        });
        this._layer.add(laneLeft);

        //绘制泳道
        this._height = 0;
        for (const lane of this._laneGroup) {
            lane.startCoordinate = {x: startX, y: lane.startCoordinate.y}
            this._height += lane.draw().height;
        }

        //修改舞台移动限制
        this.context.stageMoveLimit.yTop = - (this._height + this._startOffSet.y - height);
        this.context.stageMoveLimit.yBottom = 0;
    }

    /**
     * 舞台移动监听
     */
    stageMoveListen(): void {
        this.draw();
    }

    /**
     * 初始化泳道组
     */
    initLaneGroup() {
        //TODO 临时模拟数据
        const rowNum = 3;
        for (let i = 0; i < 7; i++) {
            this._laneGroup.push(new ChronosLane(i + '', '泳道' + i, {
                x: this._startOffSet.x,
                y: this._startOffSet.y + i * rowNum * this._rowHeight
            }, this, rowNum));
        }
    }

    get layer(): Konva.Layer {
        return this._layer;
    }

    get laneLeftWidth(): number {
        return this._laneLeftWidth;
    }

    set laneLeftWidth(value: number) {
        this._laneLeftWidth = value;
    }


    get rowHeight(): number {
        return this._rowHeight;
    }

    set rowHeight(value: number) {
        this._rowHeight = value;
    }
}

/**
 * 泳道
 */
export class ChronosLane {

    /**
     * 泳道名称
     */
    private _id: string

    /**
     * 泳道名称
     */
    private _name: string

    /**
     * 泳道行数
     */
    private _rowNum: number = 1

    /**
     * 渲染起始坐标
     */
    private _startCoordinate: { x: number, y: number }

    /**
     * 泳道组
     */
    private _group: ChronosLaneGroup;


    constructor(id: string, name: string, startCoordinate: {
        x: number,
        y: number
    }, group: ChronosLaneGroup, rowNum?: number,) {
        this._id = id;
        this._name = name;
        this._group = group;
        this._rowNum = rowNum || this._rowNum;
        this._startCoordinate = startCoordinate;
    }

    /**
     * 绘制泳道
     * @return 泳道高度
     */
    draw(): { height: number } {
        //泳道宽度
        const [width] = this._group.context.getSize()
        //泳道高度
        const height = this._rowNum * this._group.rowHeight;

        //底部泳道分割横线，y坐标
        const yBottom = this._startCoordinate.y + height;
        //底部泳道分割横线，xEnd坐标
        const xBottomEnd = this._startCoordinate.x + width;
        //底部泳道分割横线绘制
        const laneBottom = new Konva.Line({
            points: [this._startCoordinate.x, yBottom, xBottomEnd, yBottom],
            stroke: 'black',
            strokeWidth: 1
        });
        this._group.layer.add(laneBottom);


        //在左边框与分割线中间位置，绘制泳道名
        const laneName = new Konva.Text({
            x: this._startCoordinate.x + 10,
            y: this._startCoordinate.y + 10,
            text: this._name,
            fontSize: 16,
            fontFamily: 'Calibri',
            fill: '#555',
        });

        this._group.layer.add(laneName);
        return {height: height};
    }

    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get rowNum(): number {
        return this._rowNum;
    }

    set rowNum(value: number) {
        this._rowNum = value;
    }


    get startCoordinate(): { x: number; y: number } {
        return this._startCoordinate;
    }

    set startCoordinate(value: { x: number; y: number }) {
        this._startCoordinate = value;
    }
}