import {Container} from "inversify";
import {Context} from "../core/context/context";
import {bindComponent, bindLifecycle, TYPES} from "./inversify.config";
import {MouseMoveListener, StageDragListener} from "../core/event/event";
import {ChronosGridService} from "../component/grid/grid.service";
import {ChronosGridComponent} from "../component/grid/grid.component";
import {ChronosGridData} from "../component/grid/grid.data";
import {ToolbarPlugRegister} from "../component/toolbar/toolbar-plug.component";
import {DataType} from "./data.type";

/**
 * 网格配置
 */
export class GridConfig {
    constructor(chronosContainer: Container, divElement: HTMLDivElement, data: DataType) {
        const grid = data.grid;

        chronosContainer.bind<ChronosGridData>(TYPES.ChronosGridData).toConstantValue(new ChronosGridData(chronosContainer.get<Context>(TYPES.Context), grid));
        chronosContainer.bind<ChronosGridService>(TYPES.ChronosGridService).to(ChronosGridService);
        chronosContainer.bind<ChronosGridComponent>(TYPES.ChronosGridComponent).to(ChronosGridComponent);

        chronosContainer.bind<StageDragListener>(TYPES.StageDragListener).to(ChronosGridComponent);
        chronosContainer.bind<MouseMoveListener>(TYPES.MouseMoveListener).to(ChronosGridComponent);
        chronosContainer.bind<ToolbarPlugRegister>(TYPES.ToolbarPlugRegister).to(ChronosGridComponent);

        bindComponent(chronosContainer, ChronosGridComponent)
        bindLifecycle(chronosContainer, ChronosGridComponent)
    }
}
