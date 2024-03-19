import {injectable} from "inversify";

/**
 * 组件接口
 */
export interface Component<D, S> {

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
export abstract class BaseComponent<D, S> implements Component<D, S> {

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

}