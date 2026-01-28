import {Container} from "inversify";
import {Context} from "../core/context/context";
import {bindComponent, bindLifecycle, TYPES} from "./inversify.config";
import {StageDragListener} from "../core/event/event";
import {ChronosToolbarComponent} from "../component/toolbar/toolbar.component";
import {ChronosToolbarService} from "../component/toolbar/toolbar.service";
import {ChronosToolbarData} from "../component/toolbar/toolbar.data";
import {DataType} from "./data.type";

/**
 * 工具栏配置
 */
export class ToolbarConfig {
    constructor(chronosContainer: Container, divElement: HTMLDivElement, data: DataType) {
        const toolbar = data.toolbar;

        chronosContainer.bind<ChronosToolbarData>(TYPES.ChronosToolbarData).toConstantValue(
            new ChronosToolbarData(chronosContainer.get<Context>(TYPES.Context), toolbar));
        chronosContainer.bind<ChronosToolbarService>(TYPES.ChronosToolbarService).to(ChronosToolbarService);
        chronosContainer.bind<ChronosToolbarComponent>(TYPES.ChronosToolbarComponent).to(ChronosToolbarComponent);

        chronosContainer.bind<StageDragListener>(TYPES.StageDragListener).to(ChronosToolbarComponent);

        bindComponent(chronosContainer, ChronosToolbarComponent)
        bindLifecycle(chronosContainer, ChronosToolbarComponent)
    }
}
