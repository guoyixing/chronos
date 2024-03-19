import {DestroyLifecycle, InitLifecycle, Lifecycle, StartLifecycle} from "./lifecycle";
import {Container} from "inversify";
import {TYPES} from "../../config/inversify.config";

/**
 * 生命周期管理器
 */
export class LifecycleManager {

    /**
     * ioc容器
     */
    private ioc: Container;

    constructor(chronosContainer: Container) {
        this.ioc = chronosContainer;
    }

    /**
     * 排序
     */
    sort(lifecycles: Lifecycle[] | InitLifecycle[] | StartLifecycle[] | DestroyLifecycle[]) {
        lifecycles.sort((a, b) => a.order() - b.order());
    }

    /**
     * 获取生命周期对象
     */
    get lifecycle(): Lifecycle[] {
        return this.ioc.getAll<Lifecycle>(TYPES.Lifecycle);
    }

    /**
     * 初始化
     */
    init() {
        const lifecycle = this.ioc.getAll<InitLifecycle>(TYPES.InitLifecycle);
        this.sort(lifecycle);
        lifecycle.forEach(lifecycle => lifecycle.init());
    }

    /**
     * 启动
     */
    start() {
        const lifecycle = this.ioc.getAll<StartLifecycle>(TYPES.StartLifecycle);
        this.sort(lifecycle);
        lifecycle.forEach(lifecycle => lifecycle.start());
    }

    /**
     * 销毁
     */
    destroy() {
        const lifecycle = this.ioc.getAll<DestroyLifecycle>(TYPES.DestroyLifecycle);
        this.sort(lifecycle);
        lifecycle.forEach(lifecycle => lifecycle.destroy());
    }
}
