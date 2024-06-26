import {inject, injectable} from "inversify";
import {ComponentService} from "../component-service.interface";
import {ChronosHolidayData} from "./holiday.data";
import {TYPES} from "../../config/inversify.config";
import {ChronosTimelineComponent} from "../timeline/timeline.component";
import {ChronosLaneGroupComponent} from "../lane/group/lane-group.component";
import Konva from "konva";
import {ChronosScaleComponent} from "../scale/scale.component";
import {EVENT_TYPES} from "../../core/event/event";

/**
 * 假期-组件服务
 */
@injectable()
export class ChronosHolidayService implements ComponentService {

    /**
     * 数据
     */
    _data: ChronosHolidayData

    /**
     * 时间轴
     */
    private _timeLine: ChronosTimelineComponent

    /**
     * 泳道组
     */
    private _laneGroup: ChronosLaneGroupComponent

    /**
     * 比例尺
     */
    private _scale: ChronosScaleComponent

    constructor(@inject(TYPES.ChronosHolidayData) data: ChronosHolidayData,
                @inject(TYPES.ChronosTimelineComponent) timeLine: ChronosTimelineComponent,
                @inject(TYPES.ChronosLaneGroupComponent) laneGroup: ChronosLaneGroupComponent,
                @inject(TYPES.ChronosScaleComponent) scale: ChronosScaleComponent) {
        this._data = data;
        this._timeLine = timeLine;
        this._laneGroup = laneGroup
        this._scale = scale
    }

    /**
     * 绘制
     */
    draw(): void {
        const data = this._data;
        if (data.hide) {
            return
        }

        const laneGroupData = this._laneGroup.data;
        const timeline = this._timeLine.service

        //获取泳道的高度
        const height = laneGroupData.height;

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
                y: 0
            });

            for (let i = 0; i < interval; i++) {
                const text = new Konva.Text({
                    x: offSetX,
                    y: i * data.text.density,
                    text: data.text.content,
                    fontSize: data.text.size,
                    fontFamily: data.text.font,
                    fill: data.text.color,
                    rotation: data.text.rotation,
                    prefectDrawEnabled: false
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
                opacity: data.opacity,
                prefectDrawEnabled: false
            })
            entryGroup.add(rect)
            entryGroup.clipFunc((ctx) => {
                ctx.rect(0, 0, width, height);
            });
            group.add(entryGroup)
        }

        data.graphics = group
        data.layer?.add(group)
        group.moveToBottom()
    }

    open() {
        this._data.hide = false;
        this.draw()
    }

    close() {
        this._data.hide = true;
        this._data.graphics?.destroy();
    }

    /**
     * 监听比例尺
     */
    listenScale() {
        this._scale.service.on(EVENT_TYPES.ScaleReDraw, () => {
            this._data.graphics?.destroy()
            this.draw()
        })
    }

    /**
     * 监听泳道组
     */
    listenLaneGroup() {
        this._laneGroup.service.on(EVENT_TYPES.ReDraw, () => {
            this._data.graphics?.destroy()
            this.draw()
        })
    }

    /**
     * 获取两个时间中休假日天数
     */
    getHolidayDays(startTime: Date, endTime: Date) {
        //休息总时长
        let total = 0;
        //获取这两个时间之间的所有的休息时间
        this._data.holiday.forEach((entry) => {
            //获取两个时间断相交的时间长度
            const start = Math.max(startTime.getTime(), entry.startTime.getTime());
            const end = Math.min(endTime.getTime(), entry.endTime.getTime());
            if (start < end) {
                total += (end - start)
            }
        })
        return total / 1000 / 60 / 60 / 24
    }
}
