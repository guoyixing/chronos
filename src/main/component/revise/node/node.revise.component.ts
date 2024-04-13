import {ChronosNodeReviseData} from "./data.node.revise.component";
import {ChronosNodeReviseService} from "./service.node.revise.component";
import {inject, injectable} from "inversify";
import {Lifecycle} from "../../../core/lifecycle/lifecycle";
import {StageDragListener} from "../../../core/event/event";
import {TYPES} from "../../../config/inversify.config";
import {ChronosReviseComponent} from "../revise.component";
import {ChronosNodeEntryComponent} from "../../node/operate/entry/entry.node.component";

/**
 * 节点修订窗-组件
 */
@injectable()
export class ChronosNodeReviseComponent extends ChronosReviseComponent<ChronosNodeEntryComponent, ChronosNodeReviseData, ChronosNodeReviseService>
    implements Lifecycle, StageDragListener {

    /**
     * 组件名称
     */
    name = () => "node-revise";

    constructor(@inject(TYPES.ChronosNodeReviseData) data: ChronosNodeReviseData,
                @inject(TYPES.ChronosNodeReviseService) service: ChronosNodeReviseService) {
        super(data, service);
    }

}
