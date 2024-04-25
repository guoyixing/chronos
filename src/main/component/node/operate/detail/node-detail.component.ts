import {BaseComponent} from "../../../component.interface";
import {Lifecycle} from "../../../../core/lifecycle/lifecycle";
import {ChronosNodeDetailData} from "./node-detail.data";
import {ChronosNodeDetailService} from "./node-detail.service";
import {inject, injectable} from "inversify";
import {TYPES} from "../../../../config/inversify.config";
import {ChronosLaneGroupComponent} from "../../../lane/group/lane-group.component";

/**
 * 详情节点-组件
 */
@injectable()
export class ChronosNodeDetailComponent extends BaseComponent<ChronosNodeDetailData, ChronosNodeDetailService>
    implements Lifecycle {
    name = () => "node-detail"


    constructor(@inject(TYPES.ChronosNodeDetailData) data: ChronosNodeDetailData,
                @inject(TYPES.ChronosNodeDetailService) service: ChronosNodeDetailService) {
        super(data, service);
    }

    /**
     * 初始化
     */
    init() {
        const laneGroup = this.data.context.ioc.get<ChronosLaneGroupComponent>(TYPES.ChronosLaneGroupComponent);
        this.data.layer = laneGroup.data.layer
    }

    /**
     * 开始
     */
    start() {

    }
}
