import Konva from "konva";
import {ChronosLaneEntryService} from "./service.entry.lane.component";

export class ChronosLaneEntryButton {

    private _service: ChronosLaneEntryService;

    constructor(service: ChronosLaneEntryService) {
        this._service = service;
    }

    /**
     * 绘制增加按钮
     */
    drawAddButton(height: number): Konva.Group {
        const data = this._service.data;
        //增加行按钮
        const addRow = this.drawButtonRect(height, data.button.leftMargin);
        const addRowText = this.drawButtonText(addRow, '+');
        const addRowGroup = new Konva.Group();
        addRowGroup.add(addRow);
        addRowGroup.add(addRowText);
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
        //减少行按钮
        const reduceRow = this.drawButtonRect(height, data.button.leftMargin * 2 + data.button.width);
        const reduceRowText = this.drawButtonText(reduceRow, '-');
        const reduceRowGroup = new Konva.Group();
        reduceRowGroup.add(reduceRow);
        reduceRowGroup.add(reduceRowText);
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
        //删除行按钮
        const deleteLane = this.drawButtonRect(height, data.button.leftMargin * 3 + data.button.width * 2);
        const deleteLaneText = this.drawButtonText(deleteLane, 'x');
        const deleteLaneGroup = new Konva.Group();
        deleteLaneGroup.add(deleteLane);
        deleteLaneGroup.add(deleteLaneText);
        //添加悬浮显示文字
        this.mouseOver(deleteLaneGroup, deleteLane, '删除泳道');
        //点击删除行
        this.clickDeleteLane(deleteLaneGroup);
        return deleteLaneGroup;
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
        });
    }

    /**
     * 点击删除用到
     */
    clickDeleteLane(buttonGroup: Konva.Group) {
        const group = this._service.group;
        buttonGroup.on('click', () => {
            group.service.removeLaneEntry(this._service.data.id);
            //
            //重新绘制泳道
            group.service.reDraw();
        });
    }

    /**
     * 绘制按钮
     */
    drawButtonRect(height: number, x: number): Konva.Rect {
        const data = this._service.data;

        return new Konva.Rect({
            x: x,
            y: data.startCoordinate.y + height - data.button.bottomMargin,
            width: data.button.width,
            height: data.button.height,
            fill: data.button.backgroundColor,
            stroke: data.button.borderColor,
            strokeWidth: data.button.border,
            cornerRadius: data.button.cornerRadius,
        });
    }

    /**
     * 绘制按钮文字
     */
    drawButtonText(buttonRect: Konva.Rect, text: string): Konva.Text {
        const data = this._service.data;
        //按钮文字
        const buttonText = new Konva.Text({
            x: 0,
            y: 0,
            text: text,
            fontSize: data.button.fontSize,
            fontFamily: data.button.fontFamily,
            fill: data.button.textColor,
        });
        buttonText.x(buttonRect.x() + buttonRect.width() / 2 - buttonText.width() / 2);
        buttonText.y(buttonRect.y() + buttonRect.height() / 2 - buttonText.height() / 2);
        return buttonText;
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
        const addRowHoverText = new Konva.Text({
            x: buttonRect.x(),
            y: buttonRect.y() - data.button.height,
            text: text,
            fontSize: data.button.hoverFontSize,
            fontFamily: data.button.fontFamily,
            fill: data.button.hoverTextColor,
        });
        button.on('mouseover', function () {
            button.add(addRowHoverText)
            buttonRect.fill(data.button.hoverBackgroundColor)
        });
        button.on('mouseout', function () {
            addRowHoverText.remove()
            buttonRect.fill(data.button.backgroundColor)
        })
    }

}

