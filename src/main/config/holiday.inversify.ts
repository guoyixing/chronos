import {Container} from "inversify";
import {DataType} from "./data.type";
import {bindComponent, bindLifecycle, TYPES} from "./inversify.config";
import {Context} from "../core/context/context";
import {ChronosHolidayData} from "../component/holiday/holiday.data";
import {ChronosHolidayService} from "../component/holiday/holiday.service";
import {ChronosHolidayComponent} from "../component/holiday/holiday.component";
import {ToolbarPlugRegister} from "../component/toolbar/toolbar-plug.component";

export class HolidayConfig {
    constructor(chronosContainer: Container, divElement: HTMLDivElement, data: DataType) {
        const holiday = data.holiday;

        chronosContainer.bind<ChronosHolidayData>(TYPES.ChronosHolidayData).toConstantValue(new ChronosHolidayData(chronosContainer.get<Context>(TYPES.Context), holiday));
        chronosContainer.bind<ChronosHolidayService>(TYPES.ChronosHolidayService).to(ChronosHolidayService);
        chronosContainer.bind<ChronosHolidayComponent>(TYPES.ChronosHolidayComponent).to(ChronosHolidayComponent);

        chronosContainer.bind<ToolbarPlugRegister>(TYPES.ToolbarPlugRegister).to(ChronosHolidayComponent);

        bindComponent(chronosContainer, ChronosHolidayComponent)
        bindLifecycle(chronosContainer, ChronosHolidayComponent)
    }
}
