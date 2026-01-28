import {BaseComponent} from "../../../component.interface";
import {ChronosNodeTransformerService} from "./node-transformer.service";
import {ChronosNodeTransformerData} from "./node-transformer.data";
import {TYPES} from "../../../../config/inversify.config";
import {inject, injectable} from "inversify";

/**
 * 节点变形器-组件
 */
@injectable()
export class ChronosNodeTransformerComponent
    extends BaseComponent<ChronosNodeTransformerData, ChronosNodeTransformerService> {
    /**
     * 组件名称
     */
    name = () => "node-transformer"

    constructor(@inject(TYPES.ChronosNodeTransformerData) data: ChronosNodeTransformerData,
                @inject(TYPES.ChronosNodeTransformerService) service: ChronosNodeTransformerService) {
        super(data, service);
    }

    /**
     * 初始化
     */
    init() {
    }

}
