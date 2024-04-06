import {ChronosWindowDataType} from "../component/window/data.window.component"
import {ChronosGridDataType} from "../component/grid/data.grid.component";
import {ChronosLaneGroupDataType} from "../component/lane/group/data.group.lane.component";

export type DataType = {
    "window": ChronosWindowDataType,
    "grid": ChronosGridDataType,
    "lane": ChronosLaneGroupDataType
}
