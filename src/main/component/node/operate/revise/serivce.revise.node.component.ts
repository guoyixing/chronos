import {ComponentService} from "../../../service.component";
import {inject, injectable} from "inversify";
import Konva from "konva";
import {ChronosNodeReviseData} from "./data.revise.node.component";
import {TYPES} from "../../../../config/inversify.config";
import {Callback} from "../../../../core/event/callback/callback";
import {ChronosNodeGroupComponent} from "../group/group.node.component";
import Group = Konva.Group;

/**
 * 节点修订窗-组件服务
 */
@injectable()
export class ChronosNodeReviseService implements ComponentService {

    /**
     * 数据
     */
    private _data: ChronosNodeReviseData

    /**
     * 回调
     */
    private _callback: Callback

    /**
     * 节点组
     */
    private _nodeGroup: ChronosNodeGroupComponent;


    constructor(@inject(TYPES.ChronosNodeReviseData) data: ChronosNodeReviseData,
                @inject(TYPES.Callback) callback: Callback,
                @inject(TYPES.ChronosNodeGroupComponent) nodeGroup: ChronosNodeGroupComponent) {
        this._data = data;
        this._callback = callback;
        this._nodeGroup = nodeGroup;
    }

    /**
     * 绘制
     */
    draw(): void {
        //获取节点
        if (this._data.bindNodeId) {
            this._data.bindNode = this._nodeGroup.service.getNodeEntryByNodeId(this._data.bindNodeId);
        }

        //绘制背景
        const background = this.drawBackground();
        //绘制确定按钮
        const confirmButton = this.drawButton("确定");
        //确定按钮绑定事件
        confirmButton.on('click', () => {
            if (!this._data.bindNode) {
                throw Error("绑定的节点不存在")
            }
            this._callback.reviseConfirm && this._callback.reviseConfirm(this._data.bindNode.data, this._data.bindNode)
            this._data.bindNode?.service.reDraw()
            this.close();
        })
        //绘制取消按钮
        const cancelButton = this.drawButton("取消", confirmButton.width() + this._data.button.margin.right);
        //取消按钮绑定事件
        cancelButton.on('click', () => {
            this.close();
        })

        const data = this._data;
        const fixedCoordinate = this._data.context.drawContext.getFixedCoordinate();
        const group = new Group({
            x: data.startOffSet.x + fixedCoordinate.x,
            y: data.startOffSet.y + fixedCoordinate.y,
            width: data.width,
            height: data.height,
        });
        group.add(background)
        group.add(confirmButton)
        group.add(cancelButton)

        //绘制表单
        this.drawForm();

        data.graphics = group;
        data.layer?.add(group);
    }


    /**
     * 绘制背景
     */
    drawBackground(): Konva.Rect {
        const data = this._data;
        return new Konva.Rect({
            x: 0,
            y: 0,
            width: data.width,
            height: data.height,
            fill: data.backgroundColor,
            stroke: data.borderColor,
            strokeWidth: data.border,
            cornerRadius: 5,
            shadowColor: data.shadow.color,
            shadowBlur: data.shadow.blur,
            shadowOffset: data.shadow.offset,
            shadowOpacity: data.shadow.opacity
        })
    }

    /**
     * 绘制按钮
     */
    drawButton(textStr: string, offSetX?: number) {
        const data = this._data;
        const button = data.button;

        const background = new Konva.Rect({
            x: 0,
            y: 0,
            width: button.background.width,
            height: button.background.height,
            fill: button.background.color,
            stroke: button.background.strokeColor,
            strokeWidth: button.background.stroke,
            cornerRadius: button.background.radius
        });

        const text = new Konva.Text({
            x: 0,
            y: button.background.stroke,
            text: textStr,
            width: button.background.width,
            height: button.background.height,
            fontSize: button.text.fontSize,
            fontFamily: button.text.fontFamily,
            fill: button.text.color,
            align: 'center',
            verticalAlign: 'middle'
        });

        if (!offSetX) {
            offSetX = 0
        }
        const group = new Group({
            x: data.width - button.background.width - button.margin.right - offSetX,
            y: data.height - button.background.height - button.margin.bottom,
            width: button.background.width,
            height: button.background.height,
        });
        group.add(background);
        group.add(text);
        group.on('mouseover', () => {
            background.fill(button.background.hoverColor)
            text.fill(button.text.hoverColor)
        })
        group.on('mouseout', () => {
            background.fill(button.background.color)
            text.fill(button.text.color)
        })

        return group
    }

    drawForm() {
        const data = this._data;
        if (!data.form) {
            return
        }
        data.form.style.display = 'block';

        const stagePosition = data.context.drawContext.stage.container().getBoundingClientRect();
        // 创建一个div元素作为容器
        let div = document.createElement('div');
        div.id = 'konva-container';
        div.style.position = 'absolute';
        div.style.left = data.startOffSet.x + stagePosition.x + 'px';
        div.style.top = data.startOffSet.y + stagePosition.y + 'px';
        div.style.width = data.width + 'px';
        div.style.height = data.height - data.button.background.height - data.button.margin.bottom + 'px';
        div.style.display = 'flex';
        div.style.justifyContent = 'center';
        div.style.alignItems = 'center';

        div.appendChild(data.form)
        // 将主容器添加到DOM中
        document.body.appendChild(div);

    }

    /**
     * 关闭图层
     */
    close() {
        this._data.hide = true;
        if (this._data.form) {
            this._data.form.style.display = 'none';
        }
        document.getElementById('konva-container')?.remove();
        this._data.graphics?.destroy();
    }

    /**
     * 开启图层
     */
    open() {
        this._data.hide = false;
        if (this._data.form) {
            this._data.form.style.display = 'block';
        }
        this.draw();
    }

}