/**
 * 生命周期接口
 */
export interface Lifecycle extends InitLifecycle, StartLifecycle, DestroyLifecycle {

}

/**
 * 初始化生命周期
 */
export interface InitLifecycle {
    /**
     * 顺序
     */
    order(): number;

    /**
     * 初始化
     */
    init(): void;
}

/**
 * 启动生命周期
 */
export interface StartLifecycle {
    /**
     * 顺序
     */
    order(): number;

    /**
     * 启动
     */
    start(): void;
}

/**
 * 销毁生命周期
 */
export interface DestroyLifecycle {
    /**
     * 顺序
     */
    order(): number;

    /**
     * 销毁
     */
    destroy(): void;
}


