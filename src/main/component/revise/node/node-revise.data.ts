import {injectable} from "inversify";
import {ChronosNodeEntryComponent} from "../../node/operate/entry/node-entry.component";
import {ChronosReviseData, ChronosReviseDataType} from "../revise.data";
import {Context} from "../../../core/context/context";

/**
 * 节点修订窗-组件数据
 */
@injectable()
export class ChronosNodeReviseData extends ChronosReviseData<ChronosNodeEntryComponent> {

    /**
     * 组件名称
     */
    name = () => "node-revise";


    constructor(context: Context, data?: ChronosReviseDataType) {
        super(context, data);
    }
}
