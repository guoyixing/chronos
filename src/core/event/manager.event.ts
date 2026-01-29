import {Container} from "inversify";
import {Context} from "../context/context";
import {TYPES} from "../../config/inversify.config";
import {EventCallback, EventPublisher, MouseMoveListener, StageDragListener} from "./event";
import Konva from "konva";

/**
 * 事件管理器
 */
export class EventManager {

    /**
     * ioc容器
     */
    private ioc: Container;

    /**
     * 舞台拖拽事件发布者
     */
    stageEventPublisher: (event: string, func: (e: Konva.KonvaEventObject<MouseEvent>) => void) => void;

    /**
     * 事件
     * @private
     */
    private events: { [key: string]: Array<EventCallback<unknown>> } = {};

    /**
     * 鼠标移动节流标志
     */
    private mouseMoveThrottled: boolean = false;

    constructor(chronosContainer: Container) {
        this.ioc = chronosContainer;
        const context = chronosContainer.get<Context>(TYPES.Context);
        context.eventManager = this
        this.stageEventPublisher = context.drawContext.stage.on.bind(context.drawContext.stage)
        this.listenStageDragEvent()
        this.listenMouseMoveEvent()
    }

    /**
     * 监听舞台拖拽事件
     */
    listenStageDragEvent(): void {
        const listeners = this.ioc.getAll<StageDragListener>(TYPES.StageDragListener);
        this.stageEventPublisher('dragmove', (e: Konva.KonvaEventObject<MouseEvent>) => {
            if (e.target instanceof Konva.Stage) {
                listeners.forEach((listener) => {
                    try {
                        listener.stageDragListen();
                    } catch (err) {
                        const error = err as Error
                        console.error(`Drag move error : ${error.message}`)
                    }
                })
            }
        })
    }

    /**
     * 监听鼠标移动事件（带节流）
     */
    listenMouseMoveEvent(): void {
        const listeners = this.ioc.getAll<MouseMoveListener>(TYPES.MouseMoveListener);
        this.stageEventPublisher('mousemove', (e: Konva.KonvaEventObject<MouseEvent>) => {
            // 节流：使用 requestAnimationFrame 限制回调频率
            if (this.mouseMoveThrottled) {
                return;
            }
            this.mouseMoveThrottled = true;

            requestAnimationFrame(() => {
                if (e.target instanceof Konva.Stage) {
                    listeners.forEach((listener) => {
                        try {
                            listener.mouseMoveListen();
                        } catch (err) {
                            const error = err as Error
                            console.error(`Mouse move error : ${error.message}`)
                        }
                    })
                }
                this.mouseMoveThrottled = false;
            });
        })
    }

    /**
     * 监听事件
     * @param publisher 事件发布者
     * @param event 事件名称
     * @param callback 事件回调
     */
    listen<T = unknown>(publisher: EventPublisher, event: symbol, callback: EventCallback<T>): void {
        const eventId = publisher.id + event.toString();
        if (!this.events[eventId]) {
            this.events[eventId] = [];
        }
        this.events[eventId].push(callback as EventCallback<unknown>);
    }

    /**
     * 触发事件
     * @param publisher 事件发布者
     * @param event 事件名称
     * @param data 事件数据
     */
    publish<T = unknown>(publisher: EventPublisher, event: symbol, data?: T): void {
        const eventId = publisher.id + event.toString();
        const callbacks = this.events[eventId];
        if (callbacks) {
            callbacks.forEach(callback => callback(data));
        }
    }

    /**
     * 触发事件，并终止事件传播
     */
    publishAndPop<T = unknown>(publisher: EventPublisher, event: symbol, data?: T): void {
        const eventId = publisher.id + event.toString();
        const callbacks: Array<EventCallback<unknown>> = [];

        while (this.events[eventId] && this.events[eventId].length > 0) {
            const callback = this.events[eventId].pop();
            callback && callbacks.push(callback);
        }

        while (callbacks.length > 0) {
            const callback = callbacks.pop();
            callback && callback(data);
        }
    }

    /**
     * 移除事件监听
     * @param publisher 事件发布者
     * @param event 事件名称
     */
    removeListeners(publisher: EventPublisher, event: symbol): void {
        const eventId = publisher.id + event.toString();
        delete this.events[eventId];
    }

    /**
     * 移除发布者的所有事件监听
     * @param publisher 事件发布者
     */
    removeAllListeners(publisher: EventPublisher): void {
        const prefix = publisher.id;
        Object.keys(this.events)
            .filter(key => key.startsWith(prefix))
            .forEach(key => delete this.events[key]);
    }
}
