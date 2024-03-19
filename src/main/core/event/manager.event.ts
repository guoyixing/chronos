import {Container} from "inversify";
import {Context} from "../context/context";
import {TYPES} from "../../config/inversify.config";
import {MouseMoveListener, StageDragListener} from "./event";
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

    constructor(chronosContainer: Container) {
        this.ioc = chronosContainer;
        const context = chronosContainer.get<Context>(TYPES.Context);
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
}
