import {Container} from "inversify";
import {Context} from "../core/context/context";
import {bindComponent, bindLifecycle, TYPES} from "./inversify.config";
import {ChronosNodeGroupData} from "../component/node/operate/group/data.group.node.component";
import {ChronosNodeGroupComponent} from "../component/node/operate/group/group.node.component";
import {ChronosNodeGroupService} from "../component/node/operate/group/service.group.node.component";
import {DataType} from "./data.type";
import {ToolbarPlugRegister} from "../component/toolbar/plug.toolbar.component";

/**
 * 节点配置
 */
export class NodeConfig {

    constructor(chronosContainer: Container, divElement: HTMLDivElement, data: DataType) {
        const node = data.node;
        const context = chronosContainer.get<Context>(TYPES.Context);
        chronosContainer.bind<ChronosNodeGroupData>(TYPES.ChronosNodeGroupData).toConstantValue(new ChronosNodeGroupData(context, node));
        chronosContainer.bind<ChronosNodeGroupService>(TYPES.ChronosNodeGroupService).to(ChronosNodeGroupService);
        chronosContainer.bind<ChronosNodeGroupComponent>(TYPES.ChronosNodeGroupComponent).to(ChronosNodeGroupComponent);

        chronosContainer.bind<ToolbarPlugRegister>(TYPES.ToolbarPlugRegister).to(ChronosNodeGroupComponent);

        bindComponent(chronosContainer, ChronosNodeGroupComponent)
        bindLifecycle(chronosContainer, ChronosNodeGroupComponent)
    }

}
