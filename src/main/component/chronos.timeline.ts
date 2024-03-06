import {Context} from "../context/context";
import Konva from "konva";

interface TimelineProps {
    years: Array<number>
}

export class ChronosTimeline {

    private readonly renderer: Context

    private readonly lineProps: TimelineProps

    constructor(renderer: Context, lineProps: TimelineProps) {
        this.renderer = renderer;
        this.lineProps = lineProps;
        this.drawTimeline()
    }

    drawTimeline() {
        const {
            rootLayer
        } = this.renderer;

        // 按年份平均分
        let [width] = this.renderer.getSize();
        width = width / this.lineProps.years.length

        const border = this.renderer.getRelativeY()
        for (let i = 0; i < this.lineProps.years.length; i++) {
            const rect = new Konva.Rect({
                x: width * i,
                y: border,
                width: width,

                // 待配置
                height: 50,
                stroke: 'black',
                strokeWidth: 1
            });
            console.log(width * i)
            rootLayer.add(rect)
        }
    }

}