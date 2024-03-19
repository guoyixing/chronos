import {DestroyLifecycle, InitLifecycle, Lifecycle, StartLifecycle} from "../core/lifecycle/lifecycle";
import {Container, interfaces} from "inversify";
import {BaseComponent, Component} from "../component/component";
import Newable = interfaces.Newable;

export const TYPES = {
    Context: Symbol.for("Context"),
    DrawContext: Symbol.for("DrawContext"),

    Lifecycle: Symbol.for("Lifecycle"),
    InitLifecycle: Symbol.for("InitLifecycle"),
    StartLifecycle: Symbol.for("StartLifecycle"),
    DestroyLifecycle: Symbol.for("DestroyLifecycle"),

    StageDragListener: Symbol.for("StageDragListener"),
    MouseMoveListener: Symbol.for("MouseMoveListener"),

    Component: Symbol.for("Component"),
    BaseComponent: Symbol.for("BaseComponent"),

    ChronosWindowData: Symbol.for("ChronosWindowData"),
    ChronosWindowService: Symbol.for("ChronosWindowService"),
    ChronosWindowComponent: Symbol.for("ChronosWindowComponent"),

    ChronosGridData: Symbol.for("ChronosGridData"),
    ChronosGridService: Symbol.for("ChronosGridService"),
    ChronosGridComponent: Symbol.for("ChronosGridComponent")
};

/**
 * 生命周期绑定容器
 * @param container 容器
 * @param constructor 构造函数
 */
export function bindLifecycle(container: Container, constructor: Newable<any>) {
    container.bind<Lifecycle>(TYPES.Lifecycle).to(constructor);
    container.bind<InitLifecycle>(TYPES.InitLifecycle).to(constructor);
    container.bind<StartLifecycle>(TYPES.StartLifecycle).to(constructor);
    container.bind<DestroyLifecycle>(TYPES.DestroyLifecycle).to(constructor);
}

/**
 * 组件绑定容器
 * @param container 容器
 * @param constructor 构造函数
 */
export function bindComponent(container: Container, constructor: Newable<any>) {
    container.bind<Component<any, any>>(TYPES.Component).to(constructor);
    container.bind<BaseComponent<any, any>>(TYPES.BaseComponent).to(constructor);
}

