import {Container} from "inversify";
import {Context} from "../core/context/context";
import {bindComponent, bindLifecycle, TYPES} from "./inversify.config";
import {ChronosNodeGroupData} from "../component/node/operate/group/data.group.node.component";
import {ChronosNodeGroupComponent} from "../component/node/operate/group/group.node.component";
import {ChronosNodeGroupService} from "../component/node/operate/group/service.group.node.component";
import {ChronosNodeEntryData} from "../component/node/operate/entry/data.entry.node.component";

/**
 * 节点配置
 */
export class NodeConfig {

    constructor(chronosContainer: Container, divElement: HTMLDivElement) {

        const context = chronosContainer.get<Context>(TYPES.Context);

        const entryData = new ChronosNodeEntryData(context, '1', '节点1', 'star', new Date('2023-12-12 00:00:00'), '1', 2);
        entryData.moveRangeColor = 'rgba(255,0,0,0.3)';

        const entry = [
            new ChronosNodeEntryData(context, '1', '节点1', 'star', new Date('2023-12-03 00:00:00'), '1', 2),
            entryData,
        ]


        const data = new ChronosNodeGroupData(
            context,
            entry,
        )

        chronosContainer.bind<ChronosNodeGroupData>(TYPES.ChronosNodeGroupData).toConstantValue(data);
        chronosContainer.bind<ChronosNodeGroupService>(TYPES.ChronosNodeGroupService).to(ChronosNodeGroupService);
        chronosContainer.bind<ChronosNodeGroupComponent>(TYPES.ChronosNodeGroupComponent).to(ChronosNodeGroupComponent);

        bindComponent(chronosContainer, ChronosNodeGroupComponent)
        bindLifecycle(chronosContainer, ChronosNodeGroupComponent)
    }

}
