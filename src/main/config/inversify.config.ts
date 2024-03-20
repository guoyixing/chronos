import {DestroyLifecycle, InitLifecycle, Lifecycle, StartLifecycle} from "../core/lifecycle/lifecycle";
import {Container, interfaces} from "inversify";
import {BaseComponent, Component} from "../component/component";
import {ChronosLaneEntryData} from "../component/lane/entry/data.entry.lane.component";
import Newable = interfaces.Newable;

export const TYPES = {
    //上下文
    Context: Symbol.for("Context"),
    DrawContext: Symbol.for("DrawContext"),

    //生命周期
    Lifecycle: Symbol.for("Lifecycle"),
    InitLifecycle: Symbol.for("InitLifecycle"),
    StartLifecycle: Symbol.for("StartLifecycle"),
    DestroyLifecycle: Symbol.for("DestroyLifecycle"),

    //事件
    StageDragListener: Symbol.for("StageDragListener"),
    MouseMoveListener: Symbol.for("MouseMoveListener"),

    //组件
    Component: Symbol.for("Component"),
    BaseComponent: Symbol.for("BaseComponent"),

    //组件-窗体
    ChronosWindowData: Symbol.for("ChronosWindowData"),
    ChronosWindowService: Symbol.for("ChronosWindowService"),
    ChronosWindowComponent: Symbol.for("ChronosWindowComponent"),

    //组件-网格
    ChronosGridData: Symbol.for("ChronosGridData"),
    ChronosGridService: Symbol.for("ChronosGridService"),
    ChronosGridComponent: Symbol.for("ChronosGridComponent"),

    //组件-泳道-条目
    ChronosLaneEntryData: Symbol.for("ChronosLaneEntryData"),
    ChronosLaneEntryService: Symbol.for("ChronosLaneEntryService"),
    ChronosLaneEntryComponent: Symbol.for("ChronosLaneEntryComponent"),

    //组件-泳道-组
    ChronosLaneGroupData: Symbol.for("ChronosLaneGroupData"),
    ChronosLaneGroupService: Symbol.for("ChronosLaneGroupService"),
    ChronosLaneGroupComponent: Symbol.for("ChronosLaneGroupComponent"),
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

