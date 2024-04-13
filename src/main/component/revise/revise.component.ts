import {injectable} from "inversify";
import {BaseComponent} from "../component";
import {Lifecycle} from "../../core/lifecycle/lifecycle";
import {StageDragListener} from "../../core/event/event";
import {ChronosReviseData} from "./data.revise.component";
import {ChronosReviseService} from "./serivce.revise.component";

@injectable()
export abstract class ChronosReviseComponent<T extends BaseComponent<any, any>, D extends ChronosReviseData<T>, S extends ChronosReviseService<T>> extends BaseComponent<D, S>
    implements Lifecycle, StageDragListener {

    constructor(data: D, service: S) {
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
