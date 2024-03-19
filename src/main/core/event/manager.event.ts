import {Container} from "inversify";
import {Context} from "../context/context";
import {TYPES} from "../../config/inversify.config";
import {StageDragListener} from "./event";
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
    private stageDragEventPublisher: (event: string, func: (e: any) => void) => void;

    constructor(chronosContainer: Container) {
        this.ioc = chronosContainer;
        const context = chronosContainer.get<Context>(TYPES.Context);
        this.stageDragEventPublisher = context.drawContext.stage.on.bind(context.drawContext.stage)
        this.publishStageDragEvent()
    }

    /**
     * 监听拖拽
     */
    publishStageDragEvent() {
        const listeners = this.ioc.getAll<StageDragListener>(TYPES.StageDragListener);
        this.stageDragEventPublisher('dragmove', (e) => {
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
}
