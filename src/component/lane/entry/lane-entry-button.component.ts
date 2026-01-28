import Konva from "konva";
import {ChronosLaneEntryService} from "./lane-entry.service";
import {Callback} from "../../../core/event/callback/callback";
import {TYPES} from "../../../config/inversify.config";

export class ChronosLaneEntryButton {

    private _service: ChronosLaneEntryService;

    private _callback: Callback

    constructor(service: ChronosLaneEntryService) {
        this._service = service;
        this._callback = service.data.context.ioc.get<Callback>(TYPES.Callback);
    }

    /**
     * 绘制增加按钮
     */
    drawAddButton(height: number): Konva.Group {
        const data = this._service.data;
        const buttonStroke = data.button.stroke;
        //增加行按钮
        const addRow = this.drawButtonBackground(height - buttonStroke.margin.bottom * 2, buttonStroke.margin.left);

        //画一个+
        const line = buttonStroke.length;
        const path = `M${line / 2} ${-line / 2}v${line}M0 0h${line}`
        const addRowIcon = this.drawButtonIcon(addRow, path)

        const addRowGroup = new Konva.Group({name: 'addGroup', visible: false});
        addRowGroup.add(addRow);
        addRowGroup.add(addRowIcon);
        //添加悬浮显示文字
        this.mouseOver(addRowGroup, addRow, '增加行');
        //点击增加行
        this.clickAddRow(addRowGroup);
        return addRowGroup;
    }

    /**
     * 绘制减少按钮
     */
    drawReduceButton(height: number): Konva.Group {
        const data = this._service.data;
        const buttonStroke = data.button.stroke;
        //减少行按钮
        const reduceRow = this.drawButtonBackground(
            height - buttonStroke.margin.bottom * 2, buttonStroke.margin.left * 2 + data.button.background.width);

        //画一个-
        const line = buttonStroke.length;
        const path = `M0 0h${line}`
        const reduceRowIcon = this.drawButtonIcon(reduceRow, path)

        const reduceRowGroup = new Konva.Group({name: 'reduceGroup', visible: false});
        reduceRowGroup.add(reduceRow);
        reduceRowGroup.add(reduceRowIcon);
        //添加悬浮显示文字
        this.mouseOver(reduceRowGroup, reduceRow, '减少行');
        //点击删除行
        this.clickReduceRow(reduceRowGroup);
        return reduceRowGroup;
    }

    /**
     * 绘制删除按钮
     */
    drawDeleteButton(height: number): Konva.Group {
        const data = this._service.data;
        const buttonStroke = data.button.stroke;
        //删除行按钮
        const deleteLane = this.drawButtonBackground(
            height - buttonStroke.margin.bottom * 2, buttonStroke.margin.left * 3 + data.button.background.width * 2);

        //画一个x
        const line = buttonStroke.length;
        const path = `M${line} ${line / 2}l${-line} ${-line}M${line} ${-line / 2}l${-line} ${line}`
        const deleteLaneIcon = this.drawButtonIcon(deleteLane, path)
        const deleteLaneGroup = new Konva.Group({name: 'deleteGroup', visible: false});
        deleteLaneGroup.add(deleteLane);
        deleteLaneGroup.add(deleteLaneIcon);
        //添加悬浮显示文字
        this.mouseOver(deleteLaneGroup, deleteLane, '删除泳道');
        //点击删除行
        this.clickDeleteLane(deleteLaneGroup);
        return deleteLaneGroup;
    }

    /**
     * 绘制上方添加泳道按钮
     */
    drawTopAddButton(height: number): Konva.Group {
        const data = this._service.data;
        const buttonStroke = data.button.stroke;
        //删除行按钮
        const width = data.button.background.width * 1.6
        const topAddLane = this.drawButtonBackground(
            height - buttonStroke.margin.bottom, buttonStroke.margin.left, width);

        //画一个∧+
        const line = buttonStroke.length;
        const path = `
        M0 ${line / 2}l${line / 1.6 / 2} ${-line}l${line / 1.6 / 2} ${line}
        M${line + line / 1.6 / 2} ${-line / 2}v${line}M${line + line / 1.6 / 2 - line / 2} 0h${line}
        `
        const topAddLaneIcon = this.drawButtonIcon(topAddLane, path, buttonStroke.length * 1.6)
        const topAddLaneGroup = new Konva.Group({name: 'topAddLaneGroup', visible: false});
        topAddLaneGroup.add(topAddLane);
        topAddLaneGroup.add(topAddLaneIcon);
        //添加悬浮显示文字
        this.mouseOver(topAddLaneGroup, topAddLane, '上方添加泳道');
        this.clickTopAddLane(topAddLaneGroup);
        return topAddLaneGroup;
    }

    /**
     * 绘制下方添加泳道按钮
     */
    drawBottomAddButton(height: number): Konva.Group {
        const data = this._service.data;
        const buttonStroke = data.button.stroke;
        //删除行按钮
        const width = data.button.background.width * 1.6
        const bottomAddLane = this.drawButtonBackground(
            height - buttonStroke.margin.bottom, buttonStroke.margin.left * 2 + width, width);

        //画一个∨+
        const line = buttonStroke.length;
        const path = `
        M0 ${-line / 2}l${line / 1.6 / 2} ${line}l${line / 1.6 / 2} ${-line}
        M${line + line / 1.6 / 2} ${-line / 2}v${line}M${line + line / 1.6 / 2 - line / 2} 0h${line}
        `
        const bottomAddLaneIcon = this.drawButtonIcon(bottomAddLane, path, buttonStroke.length * 1.6)
        const bottomAddLaneGroup = new Konva.Group({name: 'bottomAddLaneGroup', visible: false});
        bottomAddLaneGroup.add(bottomAddLane);
        bottomAddLaneGroup.add(bottomAddLaneIcon);
        //添加悬浮显示文字
        this.mouseOver(bottomAddLaneGroup, bottomAddLane, '下方添加泳道');
        this.clickBottomAddLane(bottomAddLaneGroup);
        return bottomAddLaneGroup;
    }

    /**
     * 点击增加行
     * @param buttonGroup 按钮组
     */
    clickAddRow(buttonGroup: Konva.Group) {
        const data = this._service.data;
        buttonGroup.on('click', () => {
            data.rowNum = data.rowNum + 1;
            //重新绘制泳道
            this._service.group.service.reDraw();
            this._callback.laneAddRow && this._callback.laneAddRow(data, this._service.group);
        });
    }

    /**
     * 点击减少行
     */
    clickReduceRow(buttonGroup: Konva.Group) {
        const data = this._service.data;
        buttonGroup.on('click', () => {
            if (data.rowNum <= 1) {
                return
            }
            data.rowNum = data.rowNum - 1;
            //重新绘制泳道
            this._service.group.service.reDraw();
            this._callback.laneReduceRow && this._callback.laneReduceRow(data, this._service.group);
        });
    }

    /**
     * 点击删除泳道
     */
    clickDeleteLane(buttonGroup: Konva.Group) {
        const group = this._service.group;
        buttonGroup.on('click', () => {
            group.service.removeLaneEntry(this._service.data.id);
        });
    }

    /**
     * 点击上方添加泳道
     */
    clickTopAddLane(buttonGroup: Konva.Group) {
        const group = this._service.group;
        buttonGroup.on('click', () => {
            const component = group.service.addLaneEntry(this._service.data.id, 0);
            if (component) {
                this._callback.laneAdd && this._callback.laneAdd(component.data, group);
            }
        });
    }

    /**
     * 点击下方添加泳道
     */
    clickBottomAddLane(buttonGroup: Konva.Group) {
        const group = this._service.group;
        buttonGroup.on('click', () => {
            const component = group.service.addLaneEntry(this._service.data.id, 1);
            if (component) {
                this._callback.laneAdd && this._callback.laneAdd(component.data, group);
            }
        });
    }

    /**
     * 绘制按钮
     */
    drawButtonBackground(height: number, x: number, width?: number): Konva.Rect {
        const data = this._service.data;
        return new Konva.Rect({
            x: x,
            y: data.startCoordinate.y + height,
            width: width || data.button.background.width,
            height: data.button.background.height,
            fill: data.button.background.color,
            stroke: data.button.background.strokeColor,
            strokeWidth: data.button.background.stroke,
            cornerRadius: data.button.background.radius,
        });
    }

    /**
     * 绘制按钮图标
     */
    drawButtonIcon(buttonRect: Konva.Rect, path: string, length?: number): Konva.Path {
        const data = this._service.data;
        if (!length) {
            length = data.button.stroke.length
        }
        //按钮图标
        const buttonIcon = new Konva.Path({
            x: 0,
            y: 0,
            data: path,
            stroke: data.button.stroke.color,
            strokeWidth: data.button.stroke.width,
            lineCap: 'round',
            lineJoin: 'round'
        })
        buttonIcon.x(buttonRect.x() + buttonRect.width() / 2 - length / 2);
        buttonIcon.y(buttonRect.y() + buttonRect.height() / 2);
        return buttonIcon;
    }

    /**
     * 添加悬浮显示文字
     * @param button 按钮
     * @param buttonRect 按钮矩形
     * @param text 文字
     */
    mouseOver(button: Konva.Group, buttonRect: Konva.Rect, text: string) {
        const data = this._service.data;
        //添加悬浮显示文字
        const rowHoverText = new Konva.Text({
            x: 0,
            y: 0,
            text: text,
            fontSize: data.button.text.fontSize,
            fontFamily: data.button.text.fontFamily,
            fill: data.button.text.color,
        });

        //文字背景
        const textBackground = new Konva.Rect({
            x: -1,
            y: -2,
            width: rowHoverText.width() + 2,
            height: rowHoverText.height() + 3,
            fill: data.button.background.hoverColor,
            cornerRadius: data.button.background.radius,
        });
        const buttonGroup = new Konva.Group();
        buttonGroup.add(textBackground);
        buttonGroup.add(rowHoverText);
        buttonGroup.x(buttonRect.x());
        buttonGroup.y(buttonRect.y() - data.button.background.height);

        button.on('mouseover', function () {
            button.add(buttonGroup)
            buttonRect.fill(data.button.background.hoverColor)
        });
        button.on('mouseout', function () {
            buttonGroup.remove()
            buttonRect.fill(data.button.background.color)
        })
    }

}

