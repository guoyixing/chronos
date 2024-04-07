import {ChronosWindowDataType} from "../component/window/data.window.component"
import {ChronosGridDataType} from "../component/grid/data.grid.component";
import {ChronosLaneGroupDataType} from "../component/lane/group/data.group.lane.component";
import {ChronosToolbarDataType} from "../component/toolbar/data.toolbar.component";
import {ChronosScaleDataType} from "../component/scale/data.scale.component";
import {ChronosNodeTransformerDataType} from "../component/node/operate/transformer/data.transformer.node.component";
import {ChronosTimelineDataType} from "../component/timeline/data.timeline.component";
import {ChronosNodeBarDataType} from "../component/node/operate/bar/data.bar.node.component";
import {ChronosNodeGroupDataType} from "../component/node/operate/group/data.group.node.component";
import {ChronosNodeDetailDataType} from "../component/node/operate/detail/data.detail.node.component";

export type DataType = {
    "window": ChronosWindowDataType,
    "grid": ChronosGridDataType,
    "lane": ChronosLaneGroupDataType,
    "toolbar": ChronosToolbarDataType,
    "scale": ChronosScaleDataType,
    "transformer": ChronosNodeTransformerDataType,
    "timeline": ChronosTimelineDataType,
    "bar": ChronosNodeBarDataType,
    "node": ChronosNodeGroupDataType,
    "detail": ChronosNodeDetailDataType
}
