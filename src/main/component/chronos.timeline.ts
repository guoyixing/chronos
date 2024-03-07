import {Context} from "../context/context";
import Konva from "konva";
import {DragListener} from "../context/drag.event";

interface TimelineProps {
    years: Array<number>
}

export class ChronosTimeline implements DragListener {

    private readonly context: Context

    private readonly lineProps: TimelineProps

    constructor(context: Context, lineProps: TimelineProps) {
        this.context = context;
        this.lineProps = lineProps;
        this.stageMoveListen()
    }

    get layer() {
        return this.context.rootLayer
    }

    stageMoveListen(): void {
        const {rootLayer} = this.context;

        const [width, height] = this.context.getSize()
        const coordinate = this.context.getFixedCoordinate()

        for (let i = 0; i < this.lineProps.years.length; i++) {
            const rect = new Konva.Rect({
                x: coordinate.x,
                y: coordinate.y,
                width: width,

                // 待配置
                height: height / 10,
                stroke: 'red',
                strokeWidth: 1
            });
            rootLayer.add(rect)
        }
    }
}