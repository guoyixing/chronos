import {ChronosNodeDetailData} from "./data.detail.node.component";
import {ComponentService} from "../../../service.component";
import {inject, injectable} from "inversify";
import {TYPES} from "../../../../config/inversify.config";
import Konva from "konva";
import {ChronosNodeGroupComponent} from "../group/group.node.component";
import {ChronosNodeEntryComponent} from "../entry/entry.node.component";

/**
 * 节点详情-组件服务
 */
@injectable()
export class ChronosNodeDetailService implements ComponentService {

    /**
     * 数据
     */
    private _data: ChronosNodeDetailData;

    /**
     * 节点组
     */
    private _nodeGroup: ChronosNodeGroupComponent;

    constructor(@inject(TYPES.ChronosNodeDetailData) data: ChronosNodeDetailData,
                @inject(TYPES.ChronosNodeGroupComponent) nodeGroup: ChronosNodeGroupComponent) {
        this._data = data;
        this._nodeGroup = nodeGroup;
    }

    /**
     * 绘制
     */
    draw(): void {
        const data = this._data;
        //原本的节点详情
        this.clear()

        //绑定节点
        if (data.bindNodeId) {
            data.bindNode = this._nodeGroup.service.getNodeEntryByNodeId(data.bindNodeId)
        }
        const node = data.bindNode;
        if (!node) {
            return;
        }

        //获取鼠标位置
        const pointerPosition = data.context.drawContext.stage.getPointerPosition();
        if (!pointerPosition) {
            return
        }
        const fixedCoordinate = this._data.context.drawContext.getFixedCoordinate();
        const mouseX = pointerPosition.x + fixedCoordinate.x;
        const mouseY = pointerPosition.y + fixedCoordinate.y;

        //详细信息
        const text = this.drawText(node);
        //背景
        const background = this.drawBackground(text);
        //标题
        const title = this.drawTitle();
        //标题文字
        const titleText = this.drawTitleText();

        const group = new Konva.Group({
            x: mouseX + data.mouseOffset.x,
            y: mouseY + data.mouseOffset.y
        });
        data.graphics = group
        group.add(background);
        group.add(title);
        group.add(titleText);
        group.add(text);
        data.layer?.add(group);
    }

    /**
     * 绘制文字
     * @param node 节点信息
     */
    private drawText(node: ChronosNodeEntryComponent) {
        const data = this._data;
        let text  = '名称：' + node.data.name + '\n' +
            '开始时间：' + node.data.startTime.toLocaleString()
        if (node.data.finishTime) {
            text += '\n结束时间：' + node.data.finishTime.toLocaleString()
        }

        return new Konva.Text({
            x: data.textLeftMargin,
            y: data.titleHeight + data.textTopMargin,
            text: text,
            fontSize: data.textFontSize,
            fill: data.textFontColor,
            width: data.width,
            align: 'left',
            verticalAlign: 'top',
            fontFamily: data.textFontFamily,
            lineHeight: data.textLineHeight,
        });
    }

    /**
     * 绘制标题文字
     */
    private drawTitleText() {
        const data = this._data;
        return new Konva.Text({
            x: 0,
            y: 0,
            text: data.titleText,
            fontSize: data.titleFontSize,
            fill: data.titleFontColor,
            width: data.width,
            height: data.titleHeight,
            fontFamily: data.titleFontFamily,
            align: 'center',
            verticalAlign: 'middle',
        });
    }

    /**
     * 绘制标题
     */
    private drawTitle() {
        const data = this._data;
        return new Konva.Rect({
            x: 0,
            y: 0,
            width: data.width,
            height: data.titleHeight,
            fill: data.titleBackgroundColor,
            stroke: data.borderColor,
            strokeWidth: data.border,
        });
    }

    /**
     * 绘制背景
     * @param text 文字图形
     */
    drawBackground(text: Konva.Text) {
        const data = this._data;
        return new Konva.Rect({
            x: 0,
            y: 0,
            width: data.width,
            height: text.height() + 50,
            fill: data.backgroundColor,
            stroke: data.borderColor,
            strokeWidth: data.border,
        });
    }

    /**
     * 清除节点详情
     */
    clear() {
        this._data.graphics?.children.forEach((children) => {
            children.destroy()
        })
        this._data.graphics?.destroy()
    }
}