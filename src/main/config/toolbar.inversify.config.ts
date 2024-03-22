import {Container} from "inversify";
import {Context} from "../core/context/context";
import {bindComponent, bindLifecycle, TYPES} from "./inversify.config";
import {StageDragListener} from "../core/event/event";
import {ChronosToolbarComponent} from "../component/toolbar/toolbar.component";
import {ChronosToolbarService} from "../component/toolbar/service.toolbar.component";
import {ChronosToolbarData} from "../component/toolbar/data.toolbar.component";

/**
 * 工具栏配置
 */
export class ToolbarConfig {
    constructor(chronosContainer: Container, divElement: HTMLDivElement) {

        const data: ChronosToolbarData = new ChronosToolbarData(
            chronosContainer.get<Context>(TYPES.Context),
            {y: 1, x: 1}
        );

        chronosContainer.bind<ChronosToolbarData>(TYPES.ChronosToolbarData).toConstantValue(data);
        chronosContainer.bind<ChronosToolbarService>(TYPES.ChronosToolbarService).to(ChronosToolbarService);
        chronosContainer.bind<ChronosToolbarComponent>(TYPES.ChronosToolbarComponent).to(ChronosToolbarComponent);

        chronosContainer.bind<StageDragListener>(TYPES.StageDragListener).to(ChronosToolbarComponent);

        bindComponent(chronosContainer, ChronosToolbarComponent)
        bindLifecycle(chronosContainer, ChronosToolbarComponent)
    }
}
