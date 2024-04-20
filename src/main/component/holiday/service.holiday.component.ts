import {inject, injectable} from "inversify";
import {ComponentService} from "../service.component";
import {ChronosHolidayData} from "./data.holiday.component";
import {TYPES} from "../../config/inversify.config";
import {ChronosTimelineComponent} from "../timeline/timeline.component";

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

    constructor(@inject(TYPES.ChronosHolidayData) data: ChronosHolidayData,
                @inject(TYPES.ChronosTimelineComponent) timeLine: ChronosTimelineComponent) {
        this._data = data;
        this._timeLine = timeLine;
    }

    /**
     * 绘制
     */
    draw(): void {



    }
}
