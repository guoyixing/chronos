import {Container} from "inversify";
import {Context} from "../context/context";
import {TYPES} from "../../config/inversify.config";
import {EventPublisher, MouseMoveListener, StageDragListener} from "./event";
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
    private stageEventPublisher: (event: string, func: (e: any) => void) => void;

    /**
     * 事件
     * @private
     */
    private events: { [key: string]: Array<(data?: any) => void> } = {};

    constructor(chronosContainer: Container) {
        this.ioc = chronosContainer;
        const context = chronosContainer.get<Context>(TYPES.Context);
        context.eventManager = this
        this.stageEventPublisher = context.drawContext.stage.on.bind(context.drawContext.stage)
        this.publishStageDragEvent()
        this.publishMouseMoveEvent()
    }

    /**
     * 发布舞台拖拽事件
     */
    publishStageDragEvent() {
        const listeners = this.ioc.getAll<StageDragListener>(TYPES.StageDragListener);
        this.stageEventPublisher('dragmove', (e) => {
            if (e.target instanceof Konva.Stage) {
                listeners.forEach((listener) => {
                    try {
                        listener.stageDragListen();
                    } catch (e) {
                        const error = e as Error
                        console.error(`Drag move error : ${error.message}`)
                    }
                })
            }
        })
    }

    /**
     * 发布鼠标移动事件
     */
    publishMouseMoveEvent() {
        const listeners = this.ioc.getAll<MouseMoveListener>(TYPES.MouseMoveListener);
        this.stageEventPublisher('mousemove', (e) => {
            if (e.target instanceof Konva.Stage) {
                listeners.forEach((listener) => {
                    try {
                        listener.mouseMoveListen();
                    } catch (e) {
                        const error = e as Error
                        console.error(`Drag move error : ${error.message}`)
                    }
                })
            }
        })
    }

    /**
     * 监听事件
     * @param publisher 事件发布者
     * @param event 事件名称
     * @param callback 事件回调
     */
    listen(publisher: EventPublisher, event: symbol, callback: (data?: any) => void) {
        const eventId = publisher.id + event.toString();
        if (!this.events[eventId]) {
            this.events[eventId] = [];
        }
        this.events[eventId].push(callback);
    }

    /**
     * 触发事件
     * @param publisher 事件发布者
     * @param event 事件名称
     * @param data 事件数据
     */
    publish(publisher: EventPublisher, event: symbol, data?: any) {
        const eventId = publisher.id + event.toString();
        const callbacks = this.events[eventId];
        if (callbacks) {
            callbacks.forEach(callback => callback(data));
        }
    }

    /**
     * 触发事件，并终止事件传播
     */
    publishAndPop(publisher: EventPublisher, event: symbol, data?: any) {
        const eventId = publisher.id + event.toString();
        const callbacks: Array<(data?: any) => void> = [];

        while (this.events[eventId] && this.events[eventId].length > 0) {
            const callback = this.events[eventId].pop();
            callback && callbacks.push(callback);
            console.log(callbacks.length)
        }

        while (callbacks.length > 0) {
            const callback = callbacks.pop();
            callback && callback(data);
        }
    }
}
