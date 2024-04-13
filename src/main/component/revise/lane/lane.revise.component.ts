import {inject, injectable} from "inversify";
import {ChronosReviseComponent} from "../revise.component";
import {Lifecycle} from "../../../core/lifecycle/lifecycle";
import {StageDragListener} from "../../../core/event/event";
import {TYPES} from "../../../config/inversify.config";
import {ChronosLaneEntryComponent} from "../../lane/entry/entry.lane.component";
import {ChronosLaneReviseData} from "./data.lane.revise.component";
import {ChronosLaneReviseService} from "./service.lane.revise.component";

@injectable()
export class ChronosLaneReviseComponent extends ChronosReviseComponent<ChronosLaneEntryComponent, ChronosLaneReviseData, ChronosLaneReviseService>
    implements Lifecycle, StageDragListener {

    /**
     * 组件名称
     */
    name = () => "node-revise";

    constructor(@inject(TYPES.ChronosLaneReviseData) data: ChronosLaneReviseData,
                @inject(TYPES.ChronosLaneReviseService) service: ChronosLaneReviseService) {
        super(data, service);
    }

}
