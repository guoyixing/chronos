import {Container} from "inversify";
import {DataType} from "./data.type";
import {ChronosNodeReviseData} from "../component/node/operate/revise/data.revise.node.component";
import {bindComponent, bindLifecycle, TYPES} from "./inversify.config";
import {Context} from "../core/context/context";
import {ChronosNodeReviseService} from "../component/node/operate/revise/serivce.revise.node.component";
import {ChronosNodeReviseComponent} from "../component/node/operate/revise/revise.node.component";
import {StageDragListener} from "../core/event/event";

/**
 * 节点修订窗配置
 */
export class NodeReviseConfig {
    constructor(chronosContainer: Container, divElement: HTMLDivElement, data: DataType) {
        const revise = data.revise;

        chronosContainer.bind<ChronosNodeReviseData>(TYPES.ChronosNodeReviseData).toConstantValue(
            new ChronosNodeReviseData(chronosContainer.get<Context>(TYPES.Context), revise)
        );
        chronosContainer.bind<ChronosNodeReviseService>(TYPES.ChronosNodeReviseService).to(ChronosNodeReviseService);
        chronosContainer.bind<ChronosNodeReviseComponent>(TYPES.ChronosNodeReviseComponent).to(ChronosNodeReviseComponent);

        chronosContainer.bind<StageDragListener>(TYPES.StageDragListener).to(ChronosNodeReviseComponent);

        bindComponent(chronosContainer, ChronosNodeReviseComponent)
        bindLifecycle(chronosContainer, ChronosNodeReviseComponent)
    }
}