import {Container} from "inversify";
import {DrawContext} from "./draw.context";
import {EventManager} from "../event/manager.event";
import {IHistoryManager} from "../../history/history.interface";

/**
 * 上下文
 */
export class Context {
    /**
     * ioc容器
     */
    readonly ioc: Container;

    /**
     * 绘画上下文
     */
    readonly drawContext: DrawContext;

    /**
     * 事件管理
     */
    eventManager?: EventManager;

    /**
     * 历史管理器（撤销/重做）
     * History manager for undo/redo operations
     */
    historyManager?: IHistoryManager;

    constructor(config: ContextConfig) {
        this.ioc = config.ioc;
        this.drawContext = config.drawContext;
    }
}

/**
 * 上下文配置
 */
type ContextConfig = {
    ioc: Container
    drawContext: DrawContext
}
