import {BaseComponent} from "../../../component";
import {ChronosNodeTransformerService} from "./service.transformer.node.component";
import {ChronosNodeTransformerData} from "./data.transformer.node.component";
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