import {injectable} from "inversify";
import {ChronosReviseData, ChronosReviseDataType} from "../revise.data";
import {Context} from "../../../core/context/context";
import {ChronosLaneEntryComponent} from "../../lane/entry/lane-entry.component";

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
