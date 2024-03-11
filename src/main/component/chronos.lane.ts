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
    private readonly _startOffSet: { x: number, y: number }

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
        this._rowHeight = rowHeight ?? this._rowHeight;
        this._laneLeftWidth = laneLeftWidth ?? this._laneLeftWidth;
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
        const [_, height] = this.context.getSize()

        //计算泳道组起始坐标，y坐标是不变的，x坐标是根据舞台位置计算的
        const fixedCoordinate = this.context.getFixedCoordinate();

        //泳道组起始坐标
        const startX = fixedCoordinate.x + this._startOffSet.x;

        //绘制泳道
        this._height = this._startOffSet.y;
        for (let i = 0; i < this._laneGroup.length; i++) {
            const lane = this._laneGroup[i];
            lane.index = i;
            lane.startCoordinate = {x: startX, y: this._height}
            this._height += lane.draw().height;
        }

        //修改舞台移动限制
        this.context.stageMoveLimit.yTop = -(this._height - height);
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
            this._laneGroup.push(new ChronosLane(i + '', '泳道' + i, i, {
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


    get startOffSet(): { x: number; y: number } {
        return this._startOffSet;
    }


    get laneGroup(): Array<ChronosLane> {
        return this._laneGroup;
    }

    set laneGroup(value: Array<ChronosLane>) {
        this._laneGroup = value;
    }
}

/**
 * 泳道
 */
export class ChronosLane {

    /**
     * 泳道名称
     */
    private readonly _id: string

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

    /**
     * 索引
     * 当前泳道在泳道组中的索引
     */
    private _index: number;


    constructor(id: string, name: string, index: number, startCoordinate: {
        x: number,
        y: number
    }, group: ChronosLaneGroup, rowNum?: number,) {
        this._id = id;
        this._name = name;
        this._index = index;
        this._group = group;
        this._rowNum = rowNum ?? this._rowNum;
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

        //绘制边线
        const [drawBorderTop, drawBorderBottom] = this.drawBorder(width, height);

        //左侧泳道分割块绘制
        const drawLeft = this.drawLeft(height);

        //绘制泳道名
        const drawName = this.drawName(height);

        const group = new Konva.Group({
            draggable: true,
            //只允许沿着y轴拖动
            dragBoundFunc: function (pos) {
                return {
                    x: this.getAbsolutePosition().x,
                    y: pos.y
                };
            }
        });
        group.add(drawBorderTop);
        group.add(drawBorderBottom);
        group.add(drawLeft);
        group.add(drawName);

        group.on('mouseover', function () {
            document.body.style.cursor = 'pointer';
        });
        group.on('mouseout', function () {
            document.body.style.cursor = 'default';
        });

        //拖动开始
        group.on('dragstart', () => {
            //浮动到最上层
            group.moveToTop();
            //添加选中效果
            drawLeft.fill('#e0e0e0');
        });

        //拖动结束
        group.on('dragend', () => {
            this.moveIndex();
            this._group.layer.destroyChildren();
            this._group.draw();
        });



        this._group.layer.add(group);

        return {height: height};
    }

    /**
     * 移动索引
     * 移动当前泳道，在泳道组中的位置
     * @private
     */
    private moveIndex() {
        //调整移动泳道的顺序
        //获取当前鼠标的位置
        const pointerPosition = this._group.context.stage.getPointerPosition();
        if (pointerPosition) {
            const fixedCoordinate = this._group.context.getFixedCoordinate();
            //鼠标的y坐标
            const mouseY = pointerPosition.y + fixedCoordinate.y;

            //泳道需要移动到的索引
            let index = this._index;

            //计算当前鼠标停留的泳道，倒叙遍历
            for (let i = this._group.laneGroup.length - 1; i >= 0; i--) {
                //遍历的泳道
                const lane = this._group.laneGroup[i];
                if (mouseY > lane.startCoordinate.y) {
                    //获取鼠标移动到的泳道的索引
                    index = lane._index;
                    break;
                }
            }

            //移动泳道
            if (index !== this._index) {
                this._group.laneGroup.splice(this._index, 1);
                this._group.laneGroup.splice(index, 0, this);
            }
        }
    }

    /**
     * 绘制泳道名
     * @param height 泳道高度
     * @private
     */
    private drawName(height: number): Konva.Text {
        //固定坐标
        const fixedCoordinate = this._group.context.getFixedCoordinate();
        //底部泳道分割横线，y坐标
        const yBottom = this._startCoordinate.y + height;
        //在左边框与分割线中间位置，绘制泳道名
        const laneName = new Konva.Text({
            x: this._startCoordinate.x + 10,
            y: this._startCoordinate.y + 10,
            text: this._name,
            fontSize: 16,
            fontFamily: 'Calibri',
            fill: '#555',
        });
        //泳道组原始左上角y坐标的相对位置（相对窗口的位置）
        const laneGroupLeftTopY = fixedCoordinate.y + this._group.startOffSet.y;
        if (this._startCoordinate.y >= laneGroupLeftTopY) {
            //当泳道左上角y坐标 大于等于 泳道组原始左上角y坐标的相对位置时，泳道名字需要再初始化的位置
            laneName.y(this._startCoordinate.y + 10);

        } else if (this._startCoordinate.y < laneGroupLeftTopY
            && yBottom - 20 - laneName.height() >= laneGroupLeftTopY) {
            //当泳道左上角y坐标 小于 泳道组原始左上角y坐标的相对位置时，并且 当泳道左上角y坐标 大于等于 泳道底边-边框-文字高度的位置时，
            //泳道名字需要在泳道组原始左上角y坐标的相对位置+边框的位置
            laneName.y(laneGroupLeftTopY + 10);

        } else {
            //其他时候，泳道名字需要在泳道底边-边框-文字高度的位置
            laneName.y(yBottom - 10 - laneName.height());
        }

        return laneName;
    }

    /**
     * 绘制左侧泳道分割块
     * @param height 泳道高度
     * @private
     */
    private drawLeft(height: number): Konva.Rect {
        const x = this._startCoordinate.x;
        const y = this._startCoordinate.y;

        //左侧泳道分割块绘制
        return new Konva.Rect({
            x: x,
            y: y,
            width: this._group.laneLeftWidth,
            height: height,
            fill: '#f0f0f0',
            stroke: 'black',
            strokeWidth: 1,
        });
    }

    /**
     * 绘制边线
     * @param width 泳道宽度
     * @param height 泳道高度
     */
    drawBorder(width: number, height: number): Konva.Line[] {
        //泳道分割横线，xEnd坐标
        const xEnd = this._startCoordinate.x + width;
        //底部泳道分割横线，y坐标
        const yBottom = this._startCoordinate.y + height;

        //顶部泳道分割横线绘制
        const laneTop = new Konva.Line({
            points: [this._startCoordinate.x, this._startCoordinate.y, xEnd, this._startCoordinate.y],
            stroke: 'black',
            strokeWidth: 1
        });
        this._group.layer.add(laneTop);

        //底部泳道分割横线绘制
        const laneBottom = new Konva.Line({
            points: [this._startCoordinate.x, yBottom, xEnd, yBottom],
            stroke: 'black',
            strokeWidth: 1
        });

        return [laneTop, laneBottom];
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


    get index(): number {
        return this._index;
    }

    set index(value: number) {
        this._index = value;
    }
}
