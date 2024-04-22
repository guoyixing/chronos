import {inject, injectable} from "inversify";
import {ComponentService} from "../service.component";
import {ChronosHolidayData} from "./data.holiday.component";
import {TYPES} from "../../config/inversify.config";
import {ChronosTimelineComponent} from "../timeline/timeline.component";
import {ChronosLaneGroupComponent} from "../lane/group/group.lane.component";
import Konva from "konva";

/**
 * 假期-组件服务
 */
@injectable()
export class ChronosHolidayService implements ComponentService {

    /**
     * 数据
     */
    private _data: ChronosHolidayData

    /**
     * 时间轴
     */
    private _timeLine: ChronosTimelineComponent

    /**
     * 泳道组
     */
    private _laneGroup: ChronosLaneGroupComponent

    constructor(@inject(TYPES.ChronosHolidayData) data: ChronosHolidayData,
                @inject(TYPES.ChronosTimelineComponent) timeLine: ChronosTimelineComponent,
                @inject(TYPES.ChronosLaneGroupComponent) laneGroup: ChronosLaneGroupComponent) {
        this._data = data;
        this._timeLine = timeLine;
        this._laneGroup = laneGroup
    }

    /**
     * 绘制
     */
    draw(): void {
        const laneGroupData = this._laneGroup.data;
        const data = this._data;
        const timeline = this._timeLine.service

        if (data.hide) {
            return
        }

        //获取泳道的高度
        const height = laneGroupData.height;
        //获取y轴起始位置
        const y = laneGroupData.startOffSet.y;

        const group = new Konva.Group();

        const interval = height / data.text.density;

        for (let entry of data.holiday) {
            if (entry.hide) {
                continue
            }
            //获取x轴的位置
            const startX = timeline.getXByTime(entry.startTime);
            const endX = timeline.getXByTime(entry.endTime);
            const width = endX - startX;
            let offSetX = 0;

            const entryGroup = new Konva.Group({
                x: startX,
                y: y
            });

            for (let i = 0; i < interval; i++) {
                const text = new Konva.Text({
                    x: offSetX,
                    y: i * data.text.density,
                    text: data.text.content,
                    fontSize: data.text.size,
                    fontFamily: data.text.font,
                    fill: data.text.color,
                    rotation: data.text.rotation
                })
                if (offSetX < width - text.width()) {
                    offSetX += text.width()
                } else {
                    offSetX = 0
                }
                entryGroup.add(text)

            }
            const rect = new Konva.Rect({
                x: 0,
                y: 0,
                width: width,
                height: height,
                fill: data.color,
                stroke: data.borderColor,
                strokeWidth: data.border,
                opacity: data.opacity
            })
            entryGroup.add(rect)
            entryGroup.clipFunc((ctx) => {
                ctx.rect(0, 0, width, height);
            });
            group.add(entryGroup)
        }

        data.graphics = group
        data.layer?.add(group)
    }
}
