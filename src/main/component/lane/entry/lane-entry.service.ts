import {ComponentService} from "../../component-service.interface";
import {ChronosLaneEntryData} from "./lane-entry.data";
import {ChronosWindowComponent} from "../../window/window.component";
import {ChronosLaneGroupComponent} from "../group/lane-group.component";
import Konva from "konva";
import {EVENT_TYPES, EventPublisher} from "../../../core/event/event";
import {ChronosLaneEntryButton} from "./lane-entry-button.component";
import {Callback} from "../../../core/event/callback/callback";
import {ChronosLaneReviseComponent} from "../../revise/lane/lane-revise.component";

/**
 * 泳道条目-组件服务
 */
export class ChronosLaneEntryService implements ComponentService, EventPublisher {

    id: string

    /**
     * 数据
     */
    data: ChronosLaneEntryData

    /**
     * 回调
     */
    private _callback: Callback

    /**
     * 泳道组
     */
    group: ChronosLaneGroupComponent

    /**
     * 窗体
     */
    private _window: ChronosWindowComponent

    /**
     * 泳道条目按钮
     */
    private _laneEntryButton: ChronosLaneEntryButton

    /**
     * 修订窗
     */
    private _laneRevise: ChronosLaneReviseComponent

    constructor(data: ChronosLaneEntryData,
                callback: Callback,
                window: ChronosWindowComponent,
                group: ChronosLaneGroupComponent,
                laneRevise: ChronosLaneReviseComponent) {
        this.data = data;
        this._callback = callback;
        this._window = window;
        this.group = group;
        this._laneRevise = laneRevise
        this.id = "laneEntry" + this.data.id
        this._laneEntryButton = new ChronosLaneEntryButton(this);
    }

    /**
     * 绘制
     */
    draw(): void {
        //泳道条目数据
        const data = this.data;
        const edit = data.context.drawContext.isEdit;
        //泳道组数据
        const groupData = this.group.data;
        const laneEntryButton = this._laneEntryButton;

        //泳道宽度
        const {width} = this._window.service.getVisualRange()
        //泳道高度
        const height = data.rowNum * groupData.rowHeight;

        //设置row
        data.row = [];
        for (let i = 0; i < data.rowNum; i++) {
            data.row.push(data.startCoordinate.y + i * groupData.rowHeight + groupData.rowHeight / 2);
        }

        //绘制边线
        if (this.data.laneLineGraphics) {
            this.data.laneLineGraphics.destroy()
        }
        const [drawBorderTop, drawBorderBottom] = this.drawBorder(width, height);
        const laneLineGroup = new Konva.Group({
            x: data.startCoordinate.x
        });
        laneLineGroup.add(drawBorderTop);
        laneLineGroup.add(drawBorderBottom);
        this.data.laneLineGraphics = laneLineGroup
        groupData.context.drawContext.rootLayer?.add(laneLineGroup);

        laneLineGroup.moveToTop()

        const group = new Konva.Group({
            x: data.startCoordinate.x,
            draggable: edit,
            //只允许沿着y轴拖动
            dragBoundFunc: function (pos) {
                return {
                    x: this.getAbsolutePosition().x,
                    y: pos.y
                };
            }
        });

        let drawLeft: Konva.Rect

        if (!data.hideLeft) {
            //左侧泳道分割块绘制
            drawLeft = this.drawLeft(height);
            //监听双击
            this.listenDblClick(drawLeft)

            //绘制泳道名
            const drawName = this.drawName(height);
            group.add(drawLeft);
            group.add(drawName);
            if (edit) {
                //绘制添加删除按钮
                const topAddLaneGroup = laneEntryButton.drawTopAddButton(height);
                const bottomAddLaneGroup = laneEntryButton.drawBottomAddButton(height);
                const addRowGroup = laneEntryButton.drawAddButton(height)
                const reduceRowGroup = laneEntryButton.drawReduceButton(height);
                const deleteLaneGroup = laneEntryButton.drawDeleteButton(height);

                group.add(addRowGroup);
                group.add(reduceRowGroup);
                group.add(deleteLaneGroup);
                group.add(topAddLaneGroup);
                group.add(bottomAddLaneGroup);

                group.on('mouseover', function () {
                    document.body.style.cursor = 'pointer';
                    addRowGroup.visible(true);
                    reduceRowGroup.visible(true);
                    deleteLaneGroup.visible(true);
                    topAddLaneGroup.visible(true);
                    bottomAddLaneGroup.visible(true);
                });
                group.on('mouseout', function () {
                    document.body.style.cursor = 'default';
                    addRowGroup.visible(false);
                    reduceRowGroup.visible(false);
                    deleteLaneGroup.visible(false);
                    topAddLaneGroup.visible(false);
                    bottomAddLaneGroup.visible(false);
                });
            }
        }

        //拖动开始
        group.on('dragstart', () => {
            //浮动到最上层
            group.moveToTop();
            laneLineGroup.moveTo(group)
            //添加选中效果
            if (drawLeft) {
                drawLeft.fill(data.hoverLeftBackgroundColor);
            }
        });

        //拖动结束
        group.on('dragend', () => {
            this.moveIndex();
            this.group.service.reDraw()
        });

        this.data.graphics = group
        groupData.layer?.add(group);

        //设置泳道数据
        data.height = height;
    }

    /**
     * 移动x坐标
     */
    moveX(x: number): void {
        this.data.laneLineGraphics?.x(x)
        this.data.graphics?.x(x)
        //重绘名称
        const data = this.data
        const groupData = this.group.data
        const height = data.rowNum * groupData.rowHeight;
        const drawName = this.drawName(height);
        this.data.graphics?.findOne('.drawName')?.destroy()
        this.data.graphics?.add(drawName);
    }

    /**
     * 根据行号获取泳道的y坐标
     */
    getYByRow(row: number): number | undefined {
        if (row < 0 || row >= this.data.rowNum) {
            return undefined
        }
        return this.data.row[row];
    }

    /**
     * 根据y坐标获取泳道的行号
     */
    getRowByY(y: number): number {
        if (y < this.data.startCoordinate.y || y > this.data.startCoordinate.y + this.data.rowNum * this.group.data.rowHeight) {
            throw new Error('y坐标超出范围')
        }
        //在row中找到最接近的行
        let row = 0;
        let min = Math.abs(y - this.data.row[0]);
        for (let i = 1; i < this.data.row.length; i++) {
            if (Math.abs(y - this.data.row[i]) < min) {
                min = Math.abs(y - this.data.row[i]);
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
    moveIndex() {
        const data = this.data;
        const groupData = this.group.data;

        //调整移动泳道的顺序
        //获取当前鼠标的位置
        const pointerPosition = data.context.drawContext.stage.getPointerPosition();
        if (pointerPosition) {
            const fixedCoordinate = data.context.drawContext.getFixedCoordinate();
            //鼠标的y坐标
            const mouseY = pointerPosition.y + fixedCoordinate.y;

            //泳道需要移动到的索引
            let index = data.index;

            //计算当前鼠标停留的泳道，倒叙遍历
            for (let i = groupData.laneGroup.length - 1; i >= 0; i--) {
                //遍历的泳道
                const laneEntry = groupData.laneGroup[i];
                if (mouseY > laneEntry.data.startCoordinate.y) {
                    //获取鼠标移动到的泳道的索引
                    index = laneEntry.data.index;
                    break;
                }
            }

            //移动泳道
            if (index !== data.index) {
                const laneEntry = groupData.laneGroup.splice(data.index, 1);
                groupData.laneGroup.splice(index, 0, laneEntry[0]);
            }
        }
    }

    /**
     * 绘制泳道名
     * @param height 泳道高度
     * @private
     */
    drawName(height: number): Konva.Text {
        const data = this.data;
        const groupData = this.group.data;

        //固定坐标
        const fixedCoordinate = data.context.drawContext.getFixedCoordinate();
        //底部泳道分割横线，y坐标
        const yBottom = data.startCoordinate.y + height;
        //在左边框与分割线中间位置，绘制泳道名
        const laneName = new Konva.Text({
            name: "drawName",
            x: data.textLeftMargin,
            y: data.startCoordinate.y + data.textTopMargin,
            text: data.name,
            fontSize: data.fontSize,
            fontFamily: data.fontFamily,
            fill: data.textColor,
        });
        //泳道组原始左上角y坐标的相对位置（相对窗口的位置）
        const laneGroupLeftTopY = fixedCoordinate.y + groupData.startOffSet.y;
        if (data.startCoordinate.y >= laneGroupLeftTopY) {
            //当泳道左上角y坐标 大于等于 泳道组原始左上角y坐标的相对位置时，泳道名字需要再初始化的位置
            laneName.y(data.startCoordinate.y + data.textTopMargin);

        } else if (data.startCoordinate.y < laneGroupLeftTopY
            && yBottom - (data.textTopMargin + data.textBottomMargin) - laneName.height() >= laneGroupLeftTopY) {
            //当泳道左上角y坐标 小于 泳道组原始左上角y坐标的相对位置时，并且 当泳道左上角y坐标 大于等于 泳道底边-边框-文字高度的位置时，
            //泳道名字需要在泳道组原始左上角y坐标的相对位置+边框的位置
            laneName.y(laneGroupLeftTopY + data.textTopMargin);

        } else {
            //其他时候，泳道名字需要在泳道底边-边框-文字高度的位置
            laneName.y(yBottom - data.textBottomMargin - laneName.height());
        }

        return laneName;
    }

    /**
     * 绘制左侧泳道分割块
     * @param height 泳道高度
     * @private
     */
    drawLeft(height: number): Konva.Rect {
        const data = this.data;
        const y = data.startCoordinate.y;

        //左侧泳道分割块绘制
        return new Konva.Rect({
            x: 0,
            y: y,
            width: this.group.data.laneLeftWidth,
            height: height,
            fill: data.leftBackgroundColor,
            cornerRadius: data.radius,
            stroke: data.borderColor,
            strokeWidth: 0,
            shadowColor: data.shadow.color,
            shadowBlur: data.shadow.blur,
            shadowOffset: data.shadow.offset,
            shadowOpacity: data.shadow.opacity,
            prefectDrawEnabled: false
        });
    }

    /**
     * 绘制边线
     * @param width 泳道宽度
     * @param height 泳道高度
     */
    drawBorder(width: number, height: number): Konva.Line[] {
        const data = this.data;

        //底部泳道分割横线，y坐标
        const yBottom = data.startCoordinate.y + height;

        //顶部泳道分割横线绘制
        const laneTop = new Konva.Line({
            points: [0, data.startCoordinate.y, width, data.startCoordinate.y],
            stroke: data.borderColor,
            strokeWidth: data.border
        });

        //底部泳道分割横线绘制
        const laneBottom = new Konva.Line({
            points: [0, yBottom, width, yBottom],
            stroke: data.borderColor,
            strokeWidth: data.border
        });

        return [laneTop, laneBottom];
    }

    /**
     * 跟随泳道移动
     */
    follow(id: string, getY: () => number | undefined, setY: (y: number) => void): void {
        const data = this.data;
        //原始位置
        let originalPosition: number | undefined;

        //监听移动开始
        data.graphics?.on('dragstart.followLane' + id, () => {
            originalPosition = getY();
        });

        //监听泳道的移动
        data.graphics?.on('dragmove.followLane' + id, () => {
            const offSetY = data.graphics?.y();
            if (originalPosition != undefined && offSetY != undefined) {
                setY(originalPosition + offSetY)
            }
        });
    }

    /**
     * 清除跟随泳道移动
     */
    clearFollow(id: string): void {
        const data = this.data;
        data.graphics?.off('dragstart.followLane' + id);
        data.graphics?.off('dragmove.followLane' + id);
    }

    /**
     * 清除
     */
    clear(): void {
        const data = this.data;
        data.laneLineGraphics?.destroy()
        data.graphics?.destroy()
        this.group.data.originalLaneEntryData.splice(data.index, 1);
        this.group.data.laneGroup.splice(data.index, 1);
        this.publishAndPop(EVENT_TYPES.Delete)
        this._callback.laneDelete && this._callback.laneDelete(data, this.group);
    }

    /**
     * 事件绑定
     * @param event 事件名称
     * @param callback 回调
     */
    on(event: symbol, callback: (data?: any) => void): void {
        const eventManager = this.data.context.eventManager;
        eventManager?.listen(this, event, callback)
    }

    /**
     * 发布事件
     * @param event 事件名称
     */
    publishAndPop(event: symbol): void {
        const eventManager = this.data.context.eventManager;
        eventManager?.publish(this, event)
    }

    /**
     * 监听双击
     * @param drawLeft 左侧泳道分割块
     */
    listenDblClick(drawLeft: Konva.Rect) {
        if (!this.data.context.drawContext.isEdit) {
            return
        }
        drawLeft?.on('dblclick', () => {
            this._laneRevise.service.close()
            this._laneRevise.data.bindId = this.data.id;
            this._laneRevise.service.open()
            this._callback.laneDoubleClick && this._callback.laneDoubleClick(this.data, this.group)
        })
    }
}
