import {ComponentService} from "../../service.component";
import {ChronosLaneEntryData} from "./data.entry.lane.component";
import {ChronosWindowComponent} from "../../window/window.component";
import {ChronosLaneGroupComponent} from "../group/group.lane.component";
import Konva from "konva";
import {EventPublisher} from "../../../core/event/event";

/**
 * 泳道条目-组件服务
 */
export class ChronosLaneEntryService implements ComponentService, EventPublisher {

    id: string

    /**
     * 数据
     */
    private _data: ChronosLaneEntryData

    /**
     * 窗体
     */
    private _window: ChronosWindowComponent

    /**
     * 泳道组
     */
    private _group: ChronosLaneGroupComponent

    constructor(data: ChronosLaneEntryData,
                window: ChronosWindowComponent,
                group: ChronosLaneGroupComponent) {
        this._data = data;
        this._window = window;
        this._group = group;
        this.id = "laneEntry" + this._data.id
    }

    /**
     * 绘制
     */
    draw(): void {
        //泳道条目数据
        const data = this._data;
        //泳道组数据
        const groupData = this._group.data;

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
        const [drawBorderTop, drawBorderBottom] = this.drawBorder(width, height);
        const group = new Konva.Group({
            x: data.startCoordinate.x,
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
        if (!data.hideLeft) {
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
            this._group.service.reDraw()
        });

        this._data.graphics = group
        groupData.layer?.add(group);

        //设置泳道数据
        data.height = height;
    }

    /**
     * 移动x坐标
     */
    moveX(x: number): void {
        this._data.graphics?.x(x)
        //重绘名称
        const data = this._data
        const groupData = this._group.data
        const height = data.rowNum * groupData.rowHeight;
        const drawName = this.drawName(height);
        this._data.graphics?.findOne('Text')?.destroy()
        this._data.graphics?.add(drawName);
    }

    /**
     * 根据行号获取泳道的y坐标
     */
    getYByRow(row: number): number {
        if (row < 0 || row >= this._data.rowNum) {
            throw new Error('行号超出范围')
        }
        return this._data.row[row];
    }

    /**
     * 根据y坐标获取泳道的行号
     */
    getRowByY(y: number): number {
        if (y < this._data.startCoordinate.y || y > this._data.startCoordinate.y + this._data.rowNum * this._group.data.rowHeight) {
            throw new Error('y坐标超出范围')
        }
        //在row中找到最接近的行
        let row = 0;
        let min = Math.abs(y - this._data.row[0]);
        for (let i = 1; i < this._data.row.length; i++) {
            if (Math.abs(y - this._data.row[i]) < min) {
                min = Math.abs(y - this._data.row[i]);
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
        const data = this._data;
        const groupData = this._group.data;

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
        const data = this._data;
        const groupData = this._group.data;

        //固定坐标
        const fixedCoordinate = data.context.drawContext.getFixedCoordinate();
        //底部泳道分割横线，y坐标
        const yBottom = data.startCoordinate.y + height;
        //在左边框与分割线中间位置，绘制泳道名
        const laneName = new Konva.Text({
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

        this.dbClickLaneName(laneName);

        return laneName;
    }

    /**
     * 监听双击泳道名
     * @param laneName 泳道名
     */
    private dbClickLaneName(laneName: Konva.Text) {
        const data = this._data;
        //监听泳道名双击
        laneName.on('dblclick', () => {
            // 创建一个HTML的<input>元素
            let textPosition = laneName.getAbsolutePosition();
            let stageBox = data.context.drawContext.stage.container().getBoundingClientRect();
            let areaPosition = {
                x: stageBox.left + textPosition.x,
                y: stageBox.top + textPosition.y,
            };

            let textarea = document.createElement('input');
            document.body.appendChild(textarea);

            // 设置<input>元素的位置和样式
            textarea.style.position = 'absolute';
            textarea.style.top = areaPosition.y + 'px';
            textarea.style.left = areaPosition.x + 'px';
            textarea.style.width = laneName.width() - laneName.padding() + 'px';
            textarea.style.height = laneName.height() - laneName.padding() + 'px';
            textarea.style.fontSize = laneName.fontSize() + 'px';
            textarea.style.border = 'none';
            textarea.style.padding = '0px';
            textarea.style.margin = '0px';
            textarea.style.overflow = 'hidden';
            textarea.style.background = 'none';
            textarea.style.outline = 'none';
            textarea.style.resize = 'none';

            // 设置<input>元素的值并聚焦
            textarea.value = laneName.text();
            textarea.focus();

            laneName.text("")

            textarea.addEventListener('keydown', (e) => {
                // 当用户完成输入并离开<input>元素时，更新Konva.Text对象的文本并删除<input>元素
                if (e.key === 'Enter') {
                    if (textarea.value === '') {
                        textarea.value = data.name;
                    }
                    laneName.text(textarea.value);
                    data.name = textarea.value;
                    document.body.removeChild(textarea);
                }
            });

            textarea.addEventListener('blur', function () {
                // 当文本框失去焦点时，更新Konva.Text对象的文本并删除<input>元素
                if (textarea.value === '') {
                    textarea.value = data.name;
                }
                laneName.text(textarea.value);
                data.name = textarea.value;
                document.body.removeChild(textarea);
            });
        });
    }

    /**
     * 绘制左侧泳道分割块
     * @param height 泳道高度
     * @private
     */
    drawLeft(height: number): Konva.Rect {
        const data = this._data;
        const y = data.startCoordinate.y;

        //左侧泳道分割块绘制
        return new Konva.Rect({
            x: 0,
            y: y,
            width: this._group.data.laneLeftWidth,
            height: height,
            fill: data.leftBackgroundColor,
            stroke: data.borderColor,
            strokeWidth: data.border,
        });
    }

    /**
     * 绘制边线
     * @param width 泳道宽度
     * @param height 泳道高度
     */
    drawBorder(width: number, height: number): Konva.Line[] {
        const data = this._data;

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
    follow(id: String, getY: () => number | undefined, setY: (y: number) => void): void {
        const data = this._data;
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
    clearFollow(id: String): void {
        const data = this._data;
        data.graphics?.off('dragstart.followLane' + id);
        data.graphics?.off('dragmove.followLane' + id);
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
