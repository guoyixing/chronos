import {injectable} from "inversify";
import {BaseComponent} from "../component.interface";
import {Lifecycle} from "../../core/lifecycle/lifecycle";
import {StageDragListener} from "../../core/event/event";
import {ChronosReviseData} from "./revise.data";
import {ChronosReviseService} from "./revise.service";
import {TYPES} from "../../config/inversify.config";
import {ChronosWindowComponent} from "../window/window.component";
import {ComponentData} from "../component-data.interface";
import {ComponentService} from "../component-service.interface";

/**
 * 修订窗绑定的组件类型
 */
export type ReviseBindComponent = BaseComponent<ComponentData, ComponentService>;

/**
 * 修订窗-组件
 */
@injectable()
export abstract class ChronosReviseComponent<T extends ReviseBindComponent, D extends ChronosReviseData<T>, S extends ChronosReviseService<T>> extends BaseComponent<D, S>
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
    init(): void {
        const window = this.data.context.ioc.get<ChronosWindowComponent>(TYPES.ChronosWindowComponent);
        this.data.layer = window.data.layer
    }

    /**
     * 启动
     */
    start(): void {
        !this.data.hide && super.start();
    }

    order(): number {
        return 9999
    }

    /**
     * 销毁
     */
    destroy(): void {
        this.service.close();
        super.destroy();
    }
}
