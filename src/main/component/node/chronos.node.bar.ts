import {DragListener} from "../../context/drag.event";
import {ChronosTool, ToolbarRegister} from "../chronos.toolbar";
import {Context} from "../../context/context";
import Konva from "konva";
import {ChronosNodeEntry} from "./chronos.node.entry";

/**
 * 节点选取箱
 */
export class ChronosNodeBar implements DragListener, ToolbarRegister {

    /**
     * 上下文
     */
    private readonly context: Context

    /**
     * 图层
     */
    private _layer: Konva.Layer

    /**
     * 渲染起始坐标
     */
    startOffSet: { x: number, y: number }

    /**
     * 宽度
     */
    width: number = 200

    /**
     * 高度
     */
    height: number = 320

    /**
     * 是否显示
     */
    isShow: boolean = false


    constructor(context: Context, startOffSet?: { x: number, y: number }, width?: number, height?: number) {
        this.context = context;
        this._layer = this.context.applyLayer('nodeBar')
        const size = this.context.stageConfig.size;
        this.startOffSet = startOffSet ?? {
            x: size.width / 2,
            y: size.height / 3
        };
        this.width = width ?? this.width;
        this.height = height ?? this.height;
        //注册
        this.context.registerComponent("nodeBar", this);
    }

    draw() {
        const fixedCoordinate = this.context.getFixedCoordinate();
        //绘制背景
        const background = new Konva.Rect({
            x: this.startOffSet.x + fixedCoordinate.x,
            y: this.startOffSet.y + fixedCoordinate.y,
            width: this.width,
            height: this.height,
            fill: 'white',
            stroke: 'black',
            strokeWidth: 1,
        });


        //绘制窗体头
        const windowHead = new Konva.Rect({
            x: this.startOffSet.x + fixedCoordinate.x,
            y: this.startOffSet.y + fixedCoordinate.y,
            width: this.width,
            height: 20,
            fill: 'lightgray',
            stroke: 'black',
            strokeWidth: 1,
        });

        //绘制关闭按钮
        const close = new Konva.Text({
            x: this.startOffSet.x + fixedCoordinate.x + this.width - 20,
            y: this.startOffSet.y + fixedCoordinate.y + 5,
            text: 'X',
            fontSize: 15,
            fill: 'black',
        });
        //监听关闭按钮
        close.on('click', () => {
            this.close();
        });

        const group = new Konva.Group({
            draggable: true,
        });
        group.add(background);
        group.add(windowHead);
        group.add(close);

        this._layer?.add(group);

        //移动前的位置
        let x: number = 0;
        let y: number = 0;
        //监听移动开始
        group.on('dragstart', () => {
            x = group.x();
            y = group.y()
        });
        //监听移动结束
        group.on('dragend', () => {
            this.startOffSet = {
                x: this.startOffSet.x + group.x() - x,
                y: this.startOffSet.y + group.y() - y
            }
        });
    }

    /**
     * 关闭图层
     */
    close() {
        this.isShow = false;
        this._layer.destroyChildren();
    }

    /**
     * 开启图层
     */
    open() {
        this.isShow = true;
        this.draw();
    }

    /**
     * 工具栏
     */
    get toolbar(): ChronosTool {
        return new ChronosTool("节点", () => {
            if (this.isShow) {
                this.close()
            } else {
                this.open()
            }
        })
    };

    /**
     * 根据节点获取一个图形
     */
    getGraphicsByNode(node:ChronosNodeEntry) {
        if (node.type === 'star') {
            return new Konva.Star({
                x: node.startTime.x,
                y: node.lane.y,
                numPoints: 5,
                innerRadius: 5,
                outerRadius: 10,
                fill: 'yellow',
                stroke: 'black',
                strokeWidth: 1,
                draggable: true,
            });
        }
        throw new Error('未知的节点类型')
    }

    /**
     * 舞台移动监听
     */
    stageMoveListen() {
        if (this.isShow) {
            this.draw();
        }
    }

    get layer() {
        return this._layer
    }
}
