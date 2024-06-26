import {DestroyLifecycle, InitLifecycle, Lifecycle, StartLifecycle} from "../core/lifecycle/lifecycle";
import {Container, interfaces} from "inversify";
import {BaseComponent, Component} from "../component/component.interface";
import Newable = interfaces.Newable;

export const TYPES = {
    //节点图形
    NodeShape: Symbol.for("NodeShape"),

    //上下文
    Context: Symbol.for("Context"),
    DrawContext: Symbol.for("DrawContext"),

    //回调
    Callback: Symbol.for("Callback"),

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

    //组件-节点详情
    ChronosNodeDetailData: Symbol.for("ChronosNodeDetailData"),
    ChronosNodeDetailService: Symbol.for("ChronosNodeDetailService"),
    ChronosNodeDetailComponent: Symbol.for("ChronosNodeDetailComponent"),

    //组件-比例尺
    ChronosScaleData: Symbol.for("ChronosScaleData"),
    ChronosScaleService: Symbol.for("ChronosScaleService"),
    ChronosScaleComponent: Symbol.for("ChronosScaleComponent"),

    //组件-节点修订窗
    ChronosNodeReviseData: Symbol.for("ChronosNodeReviseData"),
    ChronosNodeReviseService: Symbol.for("ChronosNodeReviseService"),
    ChronosNodeReviseComponent: Symbol.for("ChronosNodeReviseComponent"),

    //组件-泳道修订窗
    ChronosLaneReviseData: Symbol.for("ChronosLaneReviseData"),
    ChronosLaneReviseService: Symbol.for("ChronosLaneReviseService"),
    ChronosLaneReviseComponent: Symbol.for("ChronosLaneReviseComponent"),

    //组件-泳道显示管理器
    ChronosLaneDisplayData: Symbol.for("ChronosLaneDisplayData"),
    ChronosLaneDisplayService: Symbol.for("ChronosLaneDisplayService"),
    ChronosLaneDisplayComponent: Symbol.for("ChronosLaneDisplayComponent"),

    //组件-时间轴跳转
    ChronosJumpTimelineData: Symbol.for("ChronosJumpTimelineData"),
    ChronosJumpTimelineService: Symbol.for("ChronosJumpTimelineService"),
    ChronosJumpTimelineComponent: Symbol.for("ChronosJumpTimelineComponent"),

    //组件-假期
    ChronosHolidayData: Symbol.for("ChronosHolidayData"),
    ChronosHolidayService: Symbol.for("ChronosHolidayService"),
    ChronosHolidayComponent: Symbol.for("ChronosHolidayComponent"),

    //组件-水印
    ChronosWatermarkData: Symbol.for("ChronosWatermarkData"),
    ChronosWatermarkService: Symbol.for("ChronosWatermarkService"),
    ChronosWatermarkComponent: Symbol.for("ChronosWatermarkComponent"),
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

