import {ChronosNodeReviseData} from "./data.revise.node.component";
import {ChronosNodeReviseService} from "./serivce.revise.node.component";
import {inject, injectable} from "inversify";
import {BaseComponent} from "../../../component";
import {Lifecycle} from "../../../../core/lifecycle/lifecycle";
import {StageDragListener} from "../../../../core/event/event";
import {TYPES} from "../../../../config/inversify.config";

/**
 * 节点修订窗-组件
 */
@injectable()
export class ChronosNodeReviseComponent extends BaseComponent<ChronosNodeReviseData, ChronosNodeReviseService>
    implements Lifecycle, StageDragListener {

    /**
     * 组件名称
     */
    name = () => "node-revise";

    constructor(@inject(TYPES.ChronosNodeReviseData) data: ChronosNodeReviseData,
                @inject(TYPES.ChronosNodeReviseService) service: ChronosNodeReviseService) {
        super(data, service);
    }


    /**
     * 舞台拖拽监听
     */
    stageDragListen(): void {
        const data = this.data;
        if (!data.hide) {
            const fixedCoordinate = data.context.drawContext.getFixedCoordinate();
            data.graphics?.x(data.startOffSet.x + fixedCoordinate.x)
            data.graphics?.y(data.startOffSet.y + fixedCoordinate.y)
        }
    }

    /**
     * 启动
     */
    start() {
        !this.data.hide && super.start();
    }

    order(): number {
        return 9999
    }
}
