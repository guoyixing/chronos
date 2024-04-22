import {ChronosHolidayData} from "./data.holiday.component";
import {ChronosHolidayService} from "./service.holiday.component";
import {BaseComponent} from "../component";
import {inject, injectable} from "inversify";
import {Lifecycle} from "../../core/lifecycle/lifecycle";
import {TYPES} from "../../config/inversify.config";

/**
 * 假期-组件
 */
@injectable()
export class ChronosHolidayComponent extends BaseComponent<ChronosHolidayData, ChronosHolidayService>
    implements Lifecycle {

    /**
     * 组件名称
     */
    name = () => "holiday"

    constructor(@inject(TYPES.ChronosHolidayData) data: ChronosHolidayData,
                @inject(TYPES.ChronosHolidayService) service: ChronosHolidayService) {
        super(data, service);
    }

    init() {
        this.data.layer = this.data.context.drawContext.rootLayer
    }

}
