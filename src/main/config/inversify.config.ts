import {DestroyLifecycle, InitLifecycle, Lifecycle, StartLifecycle} from "../core/lifecycle/lifecycle";
import {Container, interfaces} from "inversify";
import {BaseComponent, Component} from "../component/component";
import {ChronosLaneEntryData} from "../component/lane/entry/data.entry.lane.component";
import {ToolbarPlugRegister} from "../component/toolbar/plug.toolbar.component";
import Newable = interfaces.Newable;

export const TYPES = {
    //节点图形
    NodeShape: Symbol.for("NodeShape"),

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

    //组件-工具栏
    ChronosToolbarData: Symbol.for("ChronosToolbarData"),
    ChronosToolbarService: Symbol.for("ChronosToolbarService"),
    ChronosToolbarComponent: Symbol.for("ChronosToolbarComponent"),
    ToolbarPlugRegister: Symbol.for("ToolbarPlugRegister"),

    //组件-时间轴
    ChronosTimelineData: Symbol.for("ChronosTimelineData"),
    ChronosTimelineService: Symbol.for("ChronosTimelineService"),
    ChronosTimelineComponent: Symbol.for("ChronosTimelineComponent"),

    //组件-节点导航窗
    ChronosNodeBarData: Symbol.for("ChronosNodeBarData"),
    ChronosNodeBarService: Symbol.for("ChronosNodeBarService"),
    ChronosNodeBarComponent: Symbol.for("ChronosNodeBarComponent"),

    //组件-节点条目
    ChronosNodeEntryData: Symbol.for("ChronosNodeEntryData"),
    ChronosNodeEntryService: Symbol.for("ChronosNodeEntryService"),
    ChronosNodeEntryComponent: Symbol.for("ChronosNodeEntryComponent"),

    //组件-节点组
    ChronosNodeGroupData: Symbol.for("ChronosNodeGroupData"),
    ChronosNodeGroupService: Symbol.for("ChronosNodeGroupService"),
    ChronosNodeGroupComponent: Symbol.for("ChronosNodeGroupComponent"),

    //组件-节点变形器
    ChronosNodeTransformerData: Symbol.for("ChronosNodeTransformerData"),
    ChronosNodeTransformerService: Symbol.for("ChronosNodeTransformerService"),
    ChronosNodeTransformerComponent: Symbol.for("ChronosNodeTransformerComponent"),
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

