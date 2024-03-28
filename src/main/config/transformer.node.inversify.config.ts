import {Container} from "inversify";
import {Context} from "../core/context/context";
import {bindComponent, TYPES} from "./inversify.config";
import {ChronosNodeBarComponent} from "../component/node/operate/bar/bar.node.component";
import {ChronosNodeTransformerService} from "../component/node/operate/transformer/service.transformer.node.component";
import {ChronosNodeTransformerComponent} from "../component/node/operate/transformer/transformer.node.component";
import {ChronosNodeTransformerData} from "../component/node/operate/transformer/data.transformer.node.component";

/**
 * 节点变形器配置
 */
export class NodeTransformerConfig {
    constructor(chronosContainer: Container, divElement: HTMLDivElement) {
        const data = new ChronosNodeTransformerData(chronosContainer.get<Context>(TYPES.Context));

        chronosContainer.bind<ChronosNodeTransformerData>(TYPES.ChronosNodeTransformerData).toConstantValue(data);
        chronosContainer.bind<ChronosNodeTransformerService>(TYPES.ChronosNodeTransformerService).to(ChronosNodeTransformerService);
        chronosContainer.bind<ChronosNodeTransformerComponent>(TYPES.ChronosNodeTransformerComponent).to(ChronosNodeTransformerComponent);

        bindComponent(chronosContainer, ChronosNodeBarComponent)
    }
}