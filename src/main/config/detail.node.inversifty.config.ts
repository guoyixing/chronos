import {Container} from "inversify";
import {Context} from "../core/context/context";
import {bindComponent, bindLifecycle, TYPES} from "./inversify.config";
import {ChronosNodeDetailData} from "../component/node/operate/detail/data.detail.node.component";
import {ChronosNodeDetailService} from "../component/node/operate/detail/service.detail.node.component";
import {ChronosNodeDetailComponent} from "../component/node/operate/detail/detail.node.component";
import {DataType} from "./data.type";

/**
 * 节点详情配置
 */
export class NodeDetailConfig {
    constructor(chronosContainer: Container, divElement: HTMLDivElement, data: DataType) {
        const detail = data.detail;

        chronosContainer.bind<ChronosNodeDetailData>(TYPES.ChronosNodeDetailData).toConstantValue(
            new ChronosNodeDetailData(chronosContainer.get<Context>(TYPES.Context), detail));
        chronosContainer.bind<ChronosNodeDetailService>(TYPES.ChronosNodeDetailService).to(ChronosNodeDetailService);
        chronosContainer.bind<ChronosNodeDetailComponent>(TYPES.ChronosNodeDetailComponent).to(ChronosNodeDetailComponent);

        bindComponent(chronosContainer, ChronosNodeDetailComponent)
        bindLifecycle(chronosContainer, ChronosNodeDetailComponent)
    }
}
