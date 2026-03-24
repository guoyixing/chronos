import {ChronosWindowDataType, ChronosWindowStyleType} from "../component/window/window.data"
import {ChronosGridDataType, ChronosGridBusinessType, ChronosGridStyleType} from "../component/grid/grid.data";
import {ChronosLaneGroupDataType, ChronosLaneGroupBusinessType, ChronosLaneGroupStyleType} from "../component/lane/group/lane-group.data";
import {ChronosLaneDisplayDataType, ChronosLaneDisplayBusinessType, ChronosLaneDisplayStyleType} from "../component/lane/display/lane-display.data";
import {ChronosToolbarDataType, ChronosToolbarBusinessType, ChronosToolbarStyleType} from "../component/toolbar/toolbar.data";
import {ChronosScaleDataType, ChronosScaleBusinessType, ChronosScaleStyleType} from "../component/scale/scale.data";
import {ChronosNodeTransformerDataType, ChronosNodeTransformerBusinessType, ChronosNodeTransformerStyleType} from "../component/node/operate/transformer/node-transformer.data";
import {ChronosNodeBarDataType, ChronosNodeBarBusinessType, ChronosNodeBarStyleType} from "../component/node/operate/bar/node-bar.data";
import {ChronosNodeGroupDataType, ChronosNodeGroupBusinessType, ChronosNodeGroupStyleType} from "../component/node/operate/group/node-group.data";
import {ChronosNodeDetailDataType, ChronosNodeDetailBusinessType, ChronosNodeDetailStyleType} from "../component/node/operate/detail/node-detail.data";
import {ChronosTimelineDataType, ChronosTimelineBusinessType, ChronosTimelineStyleType} from "../component/timeline/timeline.data";
import {ChronosTimelineControlDataType, ChronosTimelineControlBusinessType, ChronosTimelineControlStyleType} from "../component/timeline/control/timeline-control.data";
import {ChronosJumpTimelineDataType, ChronosJumpTimelineBusinessType, ChronosJumpTimelineStyleType} from "../component/timeline/jump/timeline-jump.data";
import {ChronosReviseDataType, ChronosReviseBusinessType, ChronosReviseStyleType} from "../component/revise/revise.data";
import {ChronosHolidayDataType, ChronosHolidayBusinessType, ChronosHolidayStyleType} from "../component/holiday/holiday.data";
import {ChronosWatermarkDataType, ChronosWatermarkBusinessType, ChronosWatermarkStyleType} from "../component/watermark/watermark.data";
import { ChronosPlugin } from "../plugin/plugin.interface";
import { HistoryOptions } from "../history/history.interface";

export type DataType = {
    "isEdit"?: boolean,
    "window"?: ChronosWindowDataType,
    "grid"?: ChronosGridDataType,
    "lane"?: ChronosLaneGroupDataType,
    "toolbar"?: ChronosToolbarDataType,
    "scale"?: ChronosScaleDataType,
    "transformer"?: ChronosNodeTransformerDataType,
    "timeline": ChronosTimelineDataType,
    "timelineControl"?: ChronosTimelineControlDataType,
    "jumpTimeline"?: ChronosJumpTimelineDataType,
    "bar"?: ChronosNodeBarDataType,
    "node"?: ChronosNodeGroupDataType,
    "detail"?: ChronosNodeDetailDataType,
    "nodeRevise"?: ChronosReviseDataType,
    "laneRevise"?: ChronosReviseDataType,
    "laneDisplay"?: ChronosLaneDisplayDataType,
    "holiday"?: ChronosHolidayDataType,
    "watermark"?: ChronosWatermarkDataType
}

/**
 * 业务数据类型 - 包含领域逻辑、标识符、关系
 * Business data types - 包含通用配置、关键标识符、数据关系
 * 
 * 样式数据类型 - 包含颜色、字体、边距、视觉外观
 * Style data types - 包含所有视觉展现配置（颜色、大小、间距等）
 * 
 * 注意：每个组件的 DataType = BusinessType & StyleType (向后兼容)
 * Note: Each component's DataType = BusinessType & StyleType (backward compatible)
 */

// ========== Lane Types ==========

export type {
    ChronosLaneEntryBusinessType,
    ChronosLaneEntryStyleType
} from "../component/lane/entry/lane-entry.data";

export type {
    ChronosLaneGroupBusinessType,
    ChronosLaneGroupStyleType
} from "../component/lane/group/lane-group.data";

export type {
    ChronosLaneDisplayBusinessType,
    ChronosLaneDisplayStyleType
} from "../component/lane/display/lane-display.data";

// ========== Node Types ==========

export type {
    ChronosNodeEntryBusinessType,
    ChronosNodeEntryStyleType
} from "../component/node/operate/entry/node-entry.data";

export type {
    ChronosNodeGroupBusinessType,
    ChronosNodeGroupStyleType
} from "../component/node/operate/group/node-group.data";

export type {
    ChronosNodeDetailBusinessType,
    ChronosNodeDetailStyleType
} from "../component/node/operate/detail/node-detail.data";

export type {
    ChronosNodeBarBusinessType,
    ChronosNodeBarStyleType
} from "../component/node/operate/bar/node-bar.data";

export type {
    ChronosNodeTransformerBusinessType,
    ChronosNodeTransformerStyleType
} from "../component/node/operate/transformer/node-transformer.data";

// ========== Timeline Types ==========

export type {
    ChronosTimelineBusinessType,
    ChronosTimelineStyleType
} from "../component/timeline/timeline.data";

export type {
    ChronosTimelineControlBusinessType,
    ChronosTimelineControlStyleType
} from "../component/timeline/control/timeline-control.data";

export type {
    ChronosJumpTimelineBusinessType,
    ChronosJumpTimelineStyleType
} from "../component/timeline/jump/timeline-jump.data";

// ========== UI Types ==========

export type {
    ChronosGridBusinessType,
    ChronosGridStyleType
} from "../component/grid/grid.data";

export type {
    ChronosToolbarBusinessType,
    ChronosToolbarStyleType
} from "../component/toolbar/toolbar.data";

export type {
    ChronosScaleBusinessType,
    ChronosScaleStyleType
} from "../component/scale/scale.data";

export type {
    ChronosReviseBusinessType,
    ChronosReviseStyleType
} from "../component/revise/revise.data";

export type {
    ChronosWatermarkBusinessType,
    ChronosWatermarkStyleType
} from "../component/watermark/watermark.data";

export type {
    ChronosHolidayBusinessType,
    ChronosHolidayStyleType
} from "../component/holiday/holiday.data";

export type {
    ChronosWindowStyleType
} from "../component/window/window.data";

// ========== Aggregate Types for Separated API ==========

/**
 * 业务数据聚合类型 - 所有组件的业务数据
 * Aggregate of all component business data types
 */
export type ChronosBusinessDataType = {
    isEdit?: boolean;
    grid?: ChronosGridBusinessType;
    lane?: ChronosLaneGroupBusinessType;
    toolbar?: ChronosToolbarBusinessType;
    scale?: ChronosScaleBusinessType;
    transformer?: ChronosNodeTransformerBusinessType;
    timeline: ChronosTimelineBusinessType;  // Required!
    timelineControl?: ChronosTimelineControlBusinessType;
    jumpTimeline?: ChronosJumpTimelineBusinessType;
    bar?: ChronosNodeBarBusinessType;
    node?: ChronosNodeGroupBusinessType;
    detail?: ChronosNodeDetailBusinessType;
    nodeRevise?: ChronosReviseBusinessType;
    laneRevise?: ChronosReviseBusinessType;
    laneDisplay?: ChronosLaneDisplayBusinessType;
    holiday?: ChronosHolidayBusinessType;
    watermark?: ChronosWatermarkBusinessType;
}

/**
 * 样式数据聚合类型 - 所有组件的样式数据
 * Aggregate of all component style data types
 */
export type ChronosStyleDataType = {
    window?: ChronosWindowStyleType;
    grid?: ChronosGridStyleType;
    lane?: ChronosLaneGroupStyleType;
    toolbar?: ChronosToolbarStyleType;
    scale?: ChronosScaleStyleType;
    transformer?: ChronosNodeTransformerStyleType;
    timeline?: ChronosTimelineStyleType;
    timelineControl?: ChronosTimelineControlStyleType;
    jumpTimeline?: ChronosJumpTimelineStyleType;
    bar?: ChronosNodeBarStyleType;
    node?: ChronosNodeGroupStyleType;
    detail?: ChronosNodeDetailStyleType;
    nodeRevise?: ChronosReviseStyleType;
    laneRevise?: ChronosReviseStyleType;
    laneDisplay?: ChronosLaneDisplayStyleType;
    holiday?: ChronosHolidayStyleType;
    watermark?: ChronosWatermarkStyleType;
}

/**
 * 分离数据类型 - 业务和样式分开传入
 * Separated input format with business and style keys
 */
export type ChronosSeparatedDataType = {
    business: ChronosBusinessDataType;
    style: ChronosStyleDataType;
}

/**
 * 输入类型 - 支持旧API和新API
 * Union type supporting both legacy and new API formats
 */
export type ChronosInputType = DataType | ChronosSeparatedDataType;

/**
 * Chronos 配置选项
 * Optional configuration for Chronos instance
 */
export type ChronosOptions = {
    /** 插件列表 */
    plugins?: ChronosPlugin[];
    /** 历史记录配置（撤销/重做） */
    history?: HistoryOptions;
}
