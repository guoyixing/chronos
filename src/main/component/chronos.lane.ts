import {DragListener} from "../context/drag.event";
import Konva from "konva";
import {Context} from "../context/context";
import {ChronosTool, ToolbarRegister} from "./chronos.toolbar";
import {ChronosNodeEntry} from "./node/chronos.node.entry";

/**
 * 泳道组
 */
export class ChronosLaneGroup implements DragListener, ToolbarRegister {

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
    laneGroup: Array<ChronosLane> = []

    /**
     * 元素行高
     */
    rowHeight: number = 40

    /**
     * 泳道左侧宽度
     */
    laneLeftWidth: number = 80

    /**
     * 渲染起始坐标
     */
    startOffSet: { x: number, y: number }

    /**
     * 高度
     */
    height: number = 0

    /**
     * 是否绘制左侧
     */
    private _isDrawLeft: boolean = true;

    constructor(context: Context, startOffSet: {
                    x: number;
                    y: number
                }, rowHeight?: number, laneLeftWidth?: number,
    ) {
        this.context = context;
        this.rowHeight = rowHeight ?? this.rowHeight;
        this.laneLeftWidth = laneLeftWidth ?? this.laneLeftWidth;
        this.startOffSet = startOffSet;
        //申请图层
        this._layer = this.context.applyLayer('lane')
        //注册
        this.context.registerComponent("lane", this);
        //初始化泳道组
        this.initLaneGroup();
        //注册监听
        this.stageMoveListen();
    }

    get toolbar(): ChronosTool {
        return new ChronosTool("泳道", () => {
            this._isDrawLeft = !this._isDrawLeft;
            //重新绘制
            this._layer.destroyChildren();
            this.draw()
        })
    }

    /**
     * 绘制泳道组
     */
    draw() {
        const [_, height] = this.context.getSize()

        //计算泳道组起始坐标，y坐标是不变的，x坐标是根据舞台位置计算的
        const fixedCoordinate = this.context.getFixedCoordinate();

        //泳道组起始坐标
        const startX = fixedCoordinate.x + this.startOffSet.x;

        //绘制泳道
        this.height = this.startOffSet.y;
        for (let i = 0; i < this.laneGroup.length; i++) {
            const lane = this.laneGroup[i];
            lane.index = i;
            lane.startCoordinate = {x: startX, y: this.height}
            this.height += lane.draw(this._isDrawLeft).height;
        }

        //修改舞台移动限制
        this.context.stageMoveLimit.yTop = -(this.height - height);
        this.context.stageMoveLimit.yBottom = 0;
    }

    /**
     * 根据id获取泳道
     * @param id 泳道id
     */
    laneById(id: string): ChronosLane | undefined {
        for (let chronosLane of this.laneGroup) {
            if (chronosLane.id === id) {
                return chronosLane;
            }
        }
    }

    /**
     * 根据y轴坐标获取泳道
     * @param y y轴坐标
     */
    laneByY(y: number): ChronosLane | undefined {
        for (let i = this.laneGroup.length - 1; i >= 0; i--) {
            //遍历的泳道
            const lane = this.laneGroup[i];
            if (y === lane.startCoordinate.y) {
                throw new Error('y坐标在泳道分割线上，无法获取泳道')
            }
            if (y > lane.startCoordinate.y) {
                //获取鼠标移动到的泳道的索引
                return lane;
            }
        }
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
            this.laneGroup.push(new ChronosLane(i + '', '泳道' + i, i, {
                x: this.startOffSet.x,
                y: this.startOffSet.y + i * rowNum * this.rowHeight
            }, this, rowNum));
        }
    }

    get layer(): Konva.Layer {
        return this._layer;
    }
}

/**
 * 泳道
 */
export class ChronosLane {

    /**
     * 泳道id
     */
    readonly id: string

    /**
     * 泳道名称
     */
    name: string

    /**
     * 泳道行数
     */
    rowNum: number = 2

    /**
     * 渲染起始坐标
     */
    startCoordinate: { x: number, y: number }

    /**
     * 泳道组
     */
    group: ChronosLaneGroup;

    /**
     * 索引
     * 当前泳道在泳道组中的索引
     */
    index: number;

    /**
     * 泳道行
     * 可以存放节点的行对应的y坐标
     * 均为单数行
     */
    private row: number[] = []

    /**
     * 泳道中的节点
     */
    node: Array<ChronosNodeEntry> = []


    constructor(id: string, name: string, index: number, startCoordinate: {
        x: number,
        y: number
    }, group: ChronosLaneGroup, rowNum?: number,) {
        this.id = id;
        this.name = name;
        this.index = index;
        this.group = group;
        this.rowNum = rowNum ?? this.rowNum;
        this.startCoordinate = startCoordinate;
    }

    /**
     * 绘制泳道
     * @return 泳道高度
     */
    draw(isDrawLeft: boolean): { height: number } {
        //泳道宽度
        const [width] = this.group.context.getSize()
        //泳道高度
        const height = this.rowNum * this.group.rowHeight;

        //设置row
        this.row = [];
        for (let i = 0; i < this.rowNum; i++) {
            this.row.push(this.startCoordinate.y + i * this.group.rowHeight + this.group.rowHeight / 2);
        }

        //绘制边线
        const [drawBorderTop, drawBorderBottom] = this.drawBorder(width, height);
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

        let drawLeft: Konva.Rect
        if (isDrawLeft) {
            //左侧泳道分割块绘制
            drawLeft = this.drawLeft(height);

            //绘制泳道名
            const drawName = this.drawName(height);
            group.add(drawLeft);
            group.add(drawName);
        }

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
            if (drawLeft) {
                drawLeft.fill('#e0e0e0');
            }
        });

        //拖动结束
        group.on('dragend', () => {
            this.moveIndex();
            this.group.layer.destroyChildren();
            this.group.draw();
        });


        this.group.layer.add(group);

        return {height: height};
    }

    /**
     * 根据行号获取泳道的y坐标
     */
    getYByRow(row: number): number {
        if (row < 0 || row >= this.rowNum) {
            throw new Error('行号超出范围')
        }
        return this.row[row];
    }

    /**
     * 根据y坐标获取泳道的行号
     */
    getRowByY(y: number): number {
        if (y < this.startCoordinate.y || y > this.startCoordinate.y + this.rowNum * this.group.rowHeight) {
            throw new Error('y坐标超出范围')
        }
        //在row中找到最接近的行
        let row = 0;
        let min = Math.abs(y - this.row[0]);
        for (let i = 1; i < this.row.length; i++) {
            if (Math.abs(y - this.row[i]) < min) {
                min = Math.abs(y - this.row[i]);
                row = i;
            }
        }
        return row;
    }

    /**
     * 移动索引
     * 移动当前泳道，在泳道组中的位置
     * @private
     */
    private moveIndex() {
        //调整移动泳道的顺序
        //获取当前鼠标的位置
        const pointerPosition = this.group.context.stage.getPointerPosition();
        if (pointerPosition) {
            const fixedCoordinate = this.group.context.getFixedCoordinate();
            //鼠标的y坐标
            const mouseY = pointerPosition.y + fixedCoordinate.y;

            //泳道需要移动到的索引
            let index = this.index;

            //计算当前鼠标停留的泳道，倒叙遍历
            for (let i = this.group.laneGroup.length - 1; i >= 0; i--) {
                //遍历的泳道
                const lane = this.group.laneGroup[i];
                if (mouseY > lane.startCoordinate.y) {
                    //获取鼠标移动到的泳道的索引
                    index = lane.index;
                    break;
                }
            }

            //移动泳道
            if (index !== this.index) {
                this.group.laneGroup.splice(this.index, 1);
                this.group.laneGroup.splice(index, 0, this);
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
        const fixedCoordinate = this.group.context.getFixedCoordinate();
        //底部泳道分割横线，y坐标
        const yBottom = this.startCoordinate.y + height;
        //在左边框与分割线中间位置，绘制泳道名
        const laneName = new Konva.Text({
            x: this.startCoordinate.x + 10,
            y: this.startCoordinate.y + 10,
            text: this.name,
            fontSize: 16,
            fontFamily: 'Calibri',
            fill: '#555',
        });
        //泳道组原始左上角y坐标的相对位置（相对窗口的位置）
        const laneGroupLeftTopY = fixedCoordinate.y + this.group.startOffSet.y;
        if (this.startCoordinate.y >= laneGroupLeftTopY) {
            //当泳道左上角y坐标 大于等于 泳道组原始左上角y坐标的相对位置时，泳道名字需要再初始化的位置
            laneName.y(this.startCoordinate.y + 10);

        } else if (this.startCoordinate.y < laneGroupLeftTopY
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
        const x = this.startCoordinate.x;
        const y = this.startCoordinate.y;

        //左侧泳道分割块绘制
        return new Konva.Rect({
            x: x,
            y: y,
            width: this.group.laneLeftWidth,
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
        const xEnd = this.startCoordinate.x + width;
        //底部泳道分割横线，y坐标
        const yBottom = this.startCoordinate.y + height;

        //顶部泳道分割横线绘制
        const laneTop = new Konva.Line({
            points: [this.startCoordinate.x, this.startCoordinate.y, xEnd, this.startCoordinate.y],
            stroke: 'black',
            strokeWidth: 1
        });
        this.group.layer.add(laneTop);

        //底部泳道分割横线绘制
        const laneBottom = new Konva.Line({
            points: [this.startCoordinate.x, yBottom, xEnd, yBottom],
            stroke: 'black',
            strokeWidth: 1
        });

        return [laneTop, laneBottom];
    }
}
