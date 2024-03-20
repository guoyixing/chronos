import {injectable} from "inversify";
import {ComponentData} from "./data.component";
import {ComponentService} from "./service.component";

/**
 * 组件接口
 */
export interface Component<D extends ComponentData, S extends ComponentService> {

    /**
     * 组件名称
     */
    name(): string

    /**
     * 数据
     */
    get data(): D

    /**
     * 服务
     */
    get service(): S

}

/**
 * 组件基类
 * 抽象类
 */
@injectable()
export abstract class BaseComponent<D extends ComponentData, S extends ComponentService> implements Component<D, S> {

    /**
     * 数据
     */
    data: D

    /**
     * 服务
     */
    service: S


    constructor(data: D, service: S) {
        this.data = data;
        this.service = service;
    }

    /**
     * 组件名称
     */
    abstract name(): string

    /**
     * 排序
     */
    order(): number {
        return 0;
    }

    /**
     * 初始化
     */
    init(): void {
        this.data.layer = this.data.context.drawContext.applyLayer(this.name())
    }

    /**
     * 启动
     */
    start(): void {
        this.service.draw()
    }

    /**
     * 销毁
     */
    destroy(): void {

    }

}
