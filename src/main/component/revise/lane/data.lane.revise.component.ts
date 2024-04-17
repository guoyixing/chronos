import {injectable} from "inversify";
import {ChronosReviseData, ChronosReviseDataType} from "../data.revise.component";
import {Context} from "../../../core/context/context";
import {ChronosLaneEntryComponent} from "../../lane/entry/entry.lane.component";

@injectable()
export class ChronosLaneReviseData extends ChronosReviseData<ChronosLaneEntryComponent> {

    /**
     * 组件名称
     */
    name = () => "lane-revise";


    constructor(context: Context, data?: ChronosReviseDataType) {
        super(context, data);
    }
}
