/**
 * 舞台拖动事件接口
 */
export interface StageDragListener {

    /**
     * 舞台拖动事件监听
     */
    stageDragListen(): void

}

/**
 * 鼠标移动事件接口
 */
export interface MouseMoveListener {

    /**
     * 鼠标移动事件监听
     */
    mouseMoveListen(): void
}

/**
 * 事件发布者
 */
export interface EventPublisher {

    id: string

    /**
     * 事件绑定
     * @param event 事件名称
     * @param callback 回调
     */
    on(event: symbol, callback: (data?: any) => void): void

    /**
     * 发布事件
     * @param event 事件名称
     */
    publish(event: symbol): void
}

/**
 * 事件类型
 */
export const EVENT_TYPES = {
    //图形销毁事件
    GraphicsDestroy: Symbol.for("GraphicsDestroy"),
    //重绘事件
    ReDraw: Symbol.for("ReDraw"),
    //删除事件
    Delete: Symbol.for("Delete"),
    //拖拽事件
    Drag: Symbol.for("Drag"),
    //比例尺更新
    ScaleUpdate: Symbol.for("ScaleUpdate"),
    //比例尺重绘
    ScaleReDraw: Symbol.for("ScaleReDraw"),
}