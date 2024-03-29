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

        const entryData = new ChronosNodeEntryData(context, '2', '节点2', 'star', new Date('2023-12-12 00:00:00'), '1', 2);
        entryData.moveRangeColor = 'rgba(255,0,0,0.3)';

        const arrowEntryData = new ChronosNodeEntryData(context, '3', '节点3', 'arrow', new Date('2023-12-04 00:00:00'), '2', 2)
        arrowEntryData.finishTime = new Date('2023-12-09 00:00:00');

        const arrowEntryData2 = new ChronosNodeEntryData(context, '4', '节点4', 'arrow', new Date('2023-12-27 00:00:00'), '3', 0)
        arrowEntryData2.finishTime = new Date('2024-01-06 00:00:00');

        const entry = [
            new ChronosNodeEntryData(context, '1', '节点1', 'star', new Date('2023-12-03 00:00:00'), '1', 2),
            entryData,
            arrowEntryData,
            arrowEntryData2,
        ]

        // const entry2 = []
        // for (let l = 1; l < 9; l++) {
        //     for (let j = 0; j < 3; j++) {
        //         let time = new Date('2023-12-01 00:00:00').getTime();
        //         for (let i = 0; i < 100; i++) {
        //             const chronosNodeEntryData = new ChronosNodeEntryData(context, l + "" + j + "" + i, '节点' + j + "" + i, 'arrow', new Date(time), l + "", j);
        //             time += 1000 * 60 * 60 * 24 * 7;
        //             chronosNodeEntryData.finishTime = new Date(time);
        //             entry2.push(chronosNodeEntryData)
        //         }
        //     }
        // }


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
