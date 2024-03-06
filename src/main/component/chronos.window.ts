import Konva from "konva";
import {Context} from "../context/context";
import KonvaEventObject = Konva.KonvaEventObject;

/**
 * 窗口渲染器,网格
 */
export class ChronosWindow {

    private readonly renderer: Context

    constructor(renderer: Context) {
        this.renderer = renderer;
        this.drawGrid();
    }

    /**
     * 绘制网格
     */
    drawGrid() {
        const {stage, stageConfig, rootLayer} = this.renderer;
        const [width, height] = this.renderer.getSize()
        const grid = stageConfig.grid;

        //绘制纵线
        for (let i = 0; i < width; i += grid.size) {
            rootLayer.add(new Konva.Line({
                points: [i, 0, i, height],
                stroke: grid.color,
                strokeWidth: grid.width,
            }));
        }

        //绘制横线
        for (let j = 0; j < height; j += grid.size) {
            rootLayer.add(new Konva.Line({
                points: [0, j, width, j],
                stroke: grid.color,
                strokeWidth: grid.width,
            }));
        }

        const pointer = new Konva.Rect({
            width: 20,
            height: 20,
            fill: 'red',
            stroke: 'black',
            strokeWidth: 4
        })

        stage.on('click', (ev: KonvaEventObject<MouseEvent>) => {
            console.log(ev.evt)
            console.log(pointer)
            pointer.setPosition({
                x: ev.evt.offsetX - pointer.width() / 2,
                y: ev.evt.offsetY - pointer.height() / 2
            })
            rootLayer.add(pointer)
        })

    }
}