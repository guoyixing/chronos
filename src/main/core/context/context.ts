import {Container} from "inversify";
import {DrawContext} from "./draw.context";

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
