import {Context} from "../context/context";
import Konva from "konva";
import {DragListener} from "../context/drag.event";

interface TimelineProps {
    years: Array<number>
}

export class ChronosTimeline implements DragListener {

    private readonly context: Context

    private readonly lineProps: TimelineProps

    private readonly _layer: Konva.Layer

    constructor(context: Context, lineProps: TimelineProps) {
        this.context = context;
        this._layer = this.context.applyLayer('timeline')
        this.lineProps = lineProps;
        this.stageMoveListen()
    }

    get layer() {
        return this._layer
    }

    /**
     * 困了想不出来算法了，这里留给我写，明天精神好摸鱼就写
     */
    stageMoveListen(): void {

        const [width, height] = this.context.getSize()
        const coordinate = this.context.getFixedCoordinate()

        const years = this.lineProps.years
        const leftMax = width
        const min = width / 10
        const color = ['red', 'green', 'blue']

        let nextWith = 0
        for (let i = 1; i < years.length +1; i++) {
            let w = width - nextWith

            if (w > leftMax) {
                w = leftMax
            }

            if (w < min) {
                w = min * i;
            }

            const rect = new Konva.Rect({
                x: coordinate.x + nextWith,
                y: coordinate.y,
                width: w,
                height: height / 10,
                stroke: color[i],
                strokeWidth: 2
            });
            this._layer.add(rect)

            nextWith -= coordinate.x
        }
    }
}