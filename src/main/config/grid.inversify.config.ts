import {Container} from "inversify";
import {Context} from "../core/context/context";
import {bindComponent, bindLifecycle, TYPES} from "./inversify.config";
import {MouseMoveListener, StageDragListener} from "../core/event/event";
import {ChronosGridService} from "../component/grid/service.grid.component";
import {ChronosGridComponent} from "../component/grid/grid.component";
import {ChronosGridData} from "../component/grid/data.grid.component";

/**
 * 网格配置
 */
export class GridConfig {
    constructor(chronosContainer: Container, divElement: HTMLDivElement) {

        const data: ChronosGridData = new ChronosGridData(chronosContainer.get<Context>(TYPES.Context));
        // data.hidePoint = false;

        chronosContainer.bind<ChronosGridData>(TYPES.ChronosGridData).toConstantValue(data);
        chronosContainer.bind<ChronosGridService>(TYPES.ChronosGridService).to(ChronosGridService);
        chronosContainer.bind<ChronosGridComponent>(TYPES.ChronosGridComponent).to(ChronosGridComponent);

        chronosContainer.bind<StageDragListener>(TYPES.StageDragListener).to(ChronosGridComponent);
        chronosContainer.bind<MouseMoveListener>(TYPES.MouseMoveListener).to(ChronosGridComponent);

        bindComponent(chronosContainer, ChronosGridComponent)
        bindLifecycle(chronosContainer, ChronosGridComponent)
    }
}
