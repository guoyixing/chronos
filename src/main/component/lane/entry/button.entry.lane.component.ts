import Konva from "konva";
import {ChronosLaneEntryService} from "./service.entry.lane.component";

export class ChronosLaneEntryButton {

    private _service: ChronosLaneEntryService;

    constructor(service: ChronosLaneEntryService) {
        this._service = service;
    }

    /**
     * 绘制添加按钮
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
        this.mouseOver(addRowGroup, addRow, '添加行');
        //点击增加行
        this.clickAddRow(addRowGroup);
        return addRowGroup;
    }

    /**
     * 绘制删除按钮
     */
    drawDeleteButton(height: number): Konva.Group {
        const data = this._service.data;
        //删除行按钮
        const deleteRow = this.drawButtonRect(height, data.button.leftMargin + data.button.width + data.button.leftMargin);
        const deleteRowText = this.drawButtonText(deleteRow, '-');
        const deleteRowGroup = new Konva.Group();
        deleteRowGroup.add(deleteRow);
        deleteRowGroup.add(deleteRowText);
        //添加悬浮显示文字
        this.mouseOver(deleteRowGroup, deleteRow, '删除行');
        //点击删除行
        this.clickDeleteRow(deleteRowGroup);
        return deleteRowGroup;
    }

    /**
     * 点击增加行
     * @param rowGroup
     */
    clickAddRow(rowGroup: Konva.Group) {
        const data = this._service.data;
        rowGroup.on('click', () => {
            data.rowNum = data.rowNum + 1;
            //重新绘制泳道
            this._service.group.service.reDraw();
        });
    }

    /**
     * 点击删除行
     */
    clickDeleteRow(rowGroup: Konva.Group) {
        const data = this._service.data;
        rowGroup.on('click', () => {
            if (data.rowNum <= 1) {
                return
            }
            data.rowNum = data.rowNum - 1;
            //重新绘制泳道
            this._service.group.service.reDraw();
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
     * @param data 泳道数据
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
            addRowHoverText.destroy()
            buttonRect.fill(data.button.backgroundColor)
        })
    }

}

