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
 * 视口尺寸变化事件接口
 * 当窗口尺寸发生变化时（如全屏切换）触发
 */
export interface ResizeListener {

    /**
     * 视口尺寸变化事件监听
     * @param width 新的宽度
     * @param height 新的高度
     */
    resizeListen(width: number, height: number): void
}

/**
 * 事件回调类型
 */
export type EventCallback<T = unknown> = (data?: T) => void;

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
    on<T = unknown>(event: symbol, callback: EventCallback<T>): void

    /**
     * 发布事件
     * @param event 事件名称
     */
    publishAndPop(event: symbol): void
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
    //变形
    Transform: Symbol.for("Transform"),
    //比例尺更新
    ScaleUpdate: Symbol.for("ScaleUpdate"),
    //比例尺重绘
    ScaleReDraw: Symbol.for("ScaleReDraw"),
    //视口变更
    ViewportChanged: Symbol.for("ViewportChanged"),
    //泳道添加
    LaneAdded: Symbol.for("LaneAdded"),
    //泳道删除
    LaneRemoved: Symbol.for("LaneRemoved"),
    //泳道更新
    LaneUpdated: Symbol.for("LaneUpdated"),
    //节点添加
    NodeAdded: Symbol.for("NodeAdded"),
    //节点删除
    NodeRemoved: Symbol.for("NodeRemoved"),
    //节点移动
    NodeMoved: Symbol.for("NodeMoved"),
    //节点缩放
    NodeResized: Symbol.for("NodeResized"),
    //选择变更
    SelectionChanged: Symbol.for("SelectionChanged"),
}
