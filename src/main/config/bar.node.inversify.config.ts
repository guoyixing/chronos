import {Container} from "inversify";
import {bindComponent, bindLifecycle, TYPES} from "./inversify.config";
import {ChronosNodeBarComponent} from "../component/node/operate/bar/bar.node.component";
import {StageDragListener} from "../core/event/event";
import {ToolbarPlugRegister} from "../component/toolbar/plug.toolbar.component";
import {ChronosNodeBarData} from "../component/node/operate/bar/data.bar.node.component";
import {ChronosNodeBarService} from "../component/node/operate/bar/service.bar.node.component";
import {Context} from "../core/context/context";
import {StarNodeShape} from "../component/node/board/shape/StarNodeShape";
import {ArrowNodeShape} from "../component/node/board/shape/ArrowNodeShape";
import {DataType} from "./data.type";

/**
 * 节点导航窗配置
 */
export class NodeBarConfig {
    constructor(chronosContainer: Container, divElement: HTMLDivElement, data: DataType) {
        const bar = data.bar;

        const barData: ChronosNodeBarData = new ChronosNodeBarData(chronosContainer.get<Context>(TYPES.Context), bar);
        barData.candidateNode.set("star", StarNodeShape);
        barData.candidateTransformableNode.set("arrow", ArrowNodeShape);

        chronosContainer.bind<ChronosNodeBarData>(TYPES.ChronosNodeBarData).toConstantValue(barData);
        chronosContainer.bind<ChronosNodeBarService>(TYPES.ChronosNodeBarService).to(ChronosNodeBarService);
        chronosContainer.bind<ChronosNodeBarComponent>(TYPES.ChronosNodeBarComponent).to(ChronosNodeBarComponent);

        chronosContainer.bind<StageDragListener>(TYPES.StageDragListener).to(ChronosNodeBarComponent);
        chronosContainer.bind<ToolbarPlugRegister>(TYPES.ToolbarPlugRegister).to(ChronosNodeBarComponent);

        bindComponent(chronosContainer, ChronosNodeBarComponent)
        bindLifecycle(chronosContainer, ChronosNodeBarComponent)
    }
}
