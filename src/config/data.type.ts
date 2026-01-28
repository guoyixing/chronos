import {ChronosWindowDataType} from "../component/window/window.data"
import {ChronosGridDataType} from "../component/grid/grid.data";
import {ChronosLaneGroupDataType} from "../component/lane/group/lane-group.data";
import {ChronosToolbarDataType} from "../component/toolbar/toolbar.data";
import {ChronosScaleDataType} from "../component/scale/scale.data";
import {ChronosNodeTransformerDataType} from "../component/node/operate/transformer/node-transformer.data";
import {ChronosTimelineDataType} from "../component/timeline/timeline.data";
import {ChronosNodeBarDataType} from "../component/node/operate/bar/node-bar.data";
import {ChronosNodeGroupDataType} from "../component/node/operate/group/node-group.data";
import {ChronosNodeDetailDataType} from "../component/node/operate/detail/node-detail.data";
import {ChronosReviseDataType} from "../component/revise/revise.data";
import {ChronosLaneDisplayDataType} from "../component/lane/display/lane-display.data";
import {ChronosJumpTimelineDataType} from "../component/timeline/jump/timeline-jump.data";
import {ChronosHolidayDataType} from "../component/holiday/holiday.data";
import {ChronosWatermarkDataType} from "../component/watermark/watermark.data";

export type DataType = {
    "isEdit"?: boolean,
    "window"?: ChronosWindowDataType,
    "grid"?: ChronosGridDataType,
    "lane"?: ChronosLaneGroupDataType,
    "toolbar"?: ChronosToolbarDataType,
    "scale"?: ChronosScaleDataType,
    "transformer"?: ChronosNodeTransformerDataType,
    "timeline": ChronosTimelineDataType,
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
