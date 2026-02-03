import {ChronosWindowDataType, ChronosWindowStyleType} from "../component/window/window.data"
import {ChronosGridDataType, ChronosGridBusinessType, ChronosGridStyleType} from "../component/grid/grid.data";
import {ChronosLaneGroupDataType, ChronosLaneGroupBusinessType, ChronosLaneGroupStyleType} from "../component/lane/group/lane-group.data";
import {ChronosLaneEntryDataType, ChronosLaneEntryBusinessType, ChronosLaneEntryStyleType} from "../component/lane/entry/lane-entry.data";
import {ChronosLaneDisplayDataType, ChronosLaneDisplayBusinessType, ChronosLaneDisplayStyleType} from "../component/lane/display/lane-display.data";
import {ChronosToolbarDataType, ChronosToolbarBusinessType, ChronosToolbarStyleType} from "../component/toolbar/toolbar.data";
import {ChronosScaleDataType, ChronosScaleBusinessType, ChronosScaleStyleType} from "../component/scale/scale.data";
import {ChronosNodeTransformerDataType, ChronosNodeTransformerBusinessType, ChronosNodeTransformerStyleType} from "../component/node/operate/transformer/node-transformer.data";
import {ChronosNodeBarDataType, ChronosNodeBarBusinessType, ChronosNodeBarStyleType} from "../component/node/operate/bar/node-bar.data";
import {ChronosNodeGroupDataType, ChronosNodeGroupBusinessType, ChronosNodeGroupStyleType} from "../component/node/operate/group/node-group.data";
import {ChronosNodeDetailDataType, ChronosNodeDetailBusinessType, ChronosNodeDetailStyleType} from "../component/node/operate/detail/node-detail.data";
import {ChronosNodeEntryDataType, ChronosNodeEntryBusinessType, ChronosNodeEntryStyleType} from "../component/node/operate/entry/node-entry.data";
import {ChronosTimelineDataType, ChronosTimelineBusinessType, ChronosTimelineStyleType} from "../component/timeline/timeline.data";
import {ChronosTimelineControlDataType, ChronosTimelineControlBusinessType, ChronosTimelineControlStyleType} from "../component/timeline/control/timeline-control.data";
import {ChronosJumpTimelineDataType, ChronosJumpTimelineBusinessType, ChronosJumpTimelineStyleType} from "../component/timeline/jump/timeline-jump.data";
import {ChronosReviseDataType, ChronosReviseBusinessType, ChronosReviseStyleType} from "../component/revise/revise.data";
import {ChronosHolidayDataType, ChronosHolidayBusinessType, ChronosHolidayStyleType} from "../component/holiday/holiday.data";
import {ChronosWatermarkDataType, ChronosWatermarkBusinessType, ChronosWatermarkStyleType} from "../component/watermark/watermark.data";

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

