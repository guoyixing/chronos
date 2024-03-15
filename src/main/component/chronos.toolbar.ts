import {Context} from "../context/context";
import Konva from "konva";
import {DragListener} from "../context/drag.event";

/**
 * 工具栏注册
 */
export interface ToolbarRegister {
    toolbar: ChronosTool
}

/**
 * 工具栏
 */
export class ChronosToolbar implements DragListener {
    /**
     * 图层
     */
    private readonly _layer: Konva.Layer

    /**
     * 上下文
     */
    readonly context: Context

    /**
     * 工具组
     */
    toolGroup: Array<ChronosTool> = []

    /**
     * 渲染起始坐标
     */
    startOffSet: { x: number, y: number }

    /**
     * 宽度
     */
    width: number = 41

    constructor(context: Context,
                startOffSet: {
                    x: number;
                    y: number
                }, width?: number) {
        this.context = context;
        this.startOffSet = startOffSet;
        //申请图层
        this._layer = this.context.applyLayer('toolbar')
        this.width = width ?? this.width;
        //初始化工具组
        this.initToolGroup();
        //绘制
        this.stageMoveListen();
    }

    stageMoveListen(): void {
        this.draw();
    }

    draw() {
        //绘制背景
        this.drawBackground();
        //绘制工具组
        this.drawToolbarGroup();
    }

    /**
     * 绘制工具组
     * @private
     */
    private drawToolbarGroup() {
        const fixedCoordinate = this.context.getFixedCoordinate();
        //下一个元素的y坐标
        let nextY = 0;
        //绘制工具
        this.toolGroup.forEach((tool) => {
            const text = new Konva.TextPath({
                x: this.startOffSet.x + fixedCoordinate.x + this.width / 2,
                y: this.startOffSet.y + fixedCoordinate.y + nextY + 10,
                text: tool.name,
                fontSize: 16,
                fill: 'black',
                data: 'M0 0 L0 200'
            });
            text.on('click', () => {
                tool.callback();
            });

            text.on('mouseover', () => {
                document.body.style.cursor = 'pointer';
                text.fill('#359EE8');
            });

            text.on('mouseout', () => {
                document.body.style.cursor = 'default';
                text.fill('black');
            });

            this._layer.add(text);
            nextY += text.text().length * 16 + 10;
        });
    }

    /**
     * 绘制背景
     */
    private drawBackground() {
        //获取固定坐标
        const fixedCoordinate = this.context.getFixedCoordinate();
        //绘制工具栏底色
        const rect = new Konva.Rect({
            x: this.startOffSet.x + fixedCoordinate.x,
            y: this.startOffSet.y + fixedCoordinate.y,
            width: this.width,
            height: this.context.stageConfig.size.height,
            fill: 'lightgray',
            stroke: 'black',
            strokeWidth: 1
        });
        this._layer.add(rect);
        return fixedCoordinate;
    }

    get layer(): Konva.Layer {
        return this._layer;
    }

    /**
     * 初始化工具组
     */
    private initToolGroup() {
        //从上下文中获取注册的工具
        this.context.componentIndex.forEach((component) => {
            if (this.isToolbarRegister(component)) {
                this.toolGroup.push(component.toolbar);
            }
        });
    }

    private isToolbarRegister(component: any): component is ToolbarRegister {
        return 'toolbar' in component;
    }
}

/**
 * 工具
 */
export class ChronosTool {

    /**
     * 名称
     */
    name: string

    /**
     * 鼠标点时候的回调方法
     */
    callback: () => void

    constructor(name: string, callback: () => void) {
        this.name = name;
        this.callback = callback;
    }
}