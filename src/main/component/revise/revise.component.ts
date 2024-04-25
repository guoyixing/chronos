import {injectable} from "inversify";
import {BaseComponent} from "../component.interface";
import {Lifecycle} from "../../core/lifecycle/lifecycle";
import {StageDragListener} from "../../core/event/event";
import {ChronosReviseData} from "./revise.data";
import {ChronosReviseService} from "./revise.service";
import {TYPES} from "../../config/inversify.config";
import {ChronosWindowComponent} from "../window/window.component";

/**
 * 修订窗-组件
 */
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
     * 初始化
     */
    init() {
        const window = this.data.context.ioc.get<ChronosWindowComponent>(TYPES.ChronosWindowComponent);
        this.data.layer = window.data.layer
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
