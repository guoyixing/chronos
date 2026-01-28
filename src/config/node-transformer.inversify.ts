import {Container} from "inversify";
import {Context} from "../core/context/context";
import {bindComponent, TYPES} from "./inversify.config";
import {ChronosNodeBarComponent} from "../component/node/operate/bar/node-bar.component";
import {ChronosNodeTransformerService} from "../component/node/operate/transformer/node-transformer.service";
import {ChronosNodeTransformerComponent} from "../component/node/operate/transformer/node-transformer.component";
import {ChronosNodeTransformerData} from "../component/node/operate/transformer/node-transformer.data";
import {DataType} from "./data.type";

/**
 * 节点变形器配置
 */
export class NodeTransformerConfig {
    constructor(chronosContainer: Container, divElement: HTMLDivElement, data: DataType) {
        const transformer = data.transformer;

        chronosContainer.bind<ChronosNodeTransformerData>(TYPES.ChronosNodeTransformerData).toConstantValue(
            new ChronosNodeTransformerData(chronosContainer.get<Context>(TYPES.Context), transformer)
        );
        chronosContainer.bind<ChronosNodeTransformerService>(TYPES.ChronosNodeTransformerService).to(ChronosNodeTransformerService);
        chronosContainer.bind<ChronosNodeTransformerComponent>(TYPES.ChronosNodeTransformerComponent).to(ChronosNodeTransformerComponent);

        bindComponent(chronosContainer, ChronosNodeBarComponent)
    }
}
