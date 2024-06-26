import {BaseComponent} from "../../../component.interface";
import {ChronosNodeGroupData} from "./node-group.data";
import {ChronosNodeGroupService} from "./node-group.service";
import {Lifecycle} from "../../../../core/lifecycle/lifecycle";
import {inject, injectable} from "inversify";
import {TYPES} from "../../../../config/inversify.config";
import {ChronosLaneGroupComponent} from "../../../lane/group/lane-group.component";
import {ChronosNodeBarComponent} from "../bar/node-bar.component";
import {ChronosNodeEntryService} from "../entry/node-entry.service";
import {ChronosNodeEntryComponent} from "../entry/node-entry.component";
import {ChronosTimelineComponent} from "../../../timeline/timeline.component";
import {ChronosNodeTransformerComponent} from "../transformer/node-transformer.component";
import {ChronosNodeDetailComponent} from "../detail/node-detail.component";
import {ChronosScaleComponent} from "../../../scale/scale.component";
import {ChronosNodeReviseComponent} from "../../../revise/node/node-revise.component";
import {Callback} from "../../../../core/event/callback/callback";
import {ChronosToolPlug, ToolbarPlugRegister} from "../../../toolbar/toolbar-plug.component";
import {ButtonType} from "../../../../core/common/type/button.type";
import Konva from "konva";

/**
 * 节点组-组件
 */
@injectable()
export class ChronosNodeGroupComponent extends BaseComponent<ChronosNodeGroupData, ChronosNodeGroupService>
    implements Lifecycle, ToolbarPlugRegister {

    /**
     * 组件名称
     */
    name = () => "node-group"

    constructor(@inject(TYPES.ChronosNodeGroupData) data: ChronosNodeGroupData,
                @inject(TYPES.ChronosNodeGroupService) service: ChronosNodeGroupService) {
        super(data, service);
    }

    /**
     * 初始化
     */
    init() {
        this.data.layer = this.data.context.drawContext.rootLayer
        //回调
        const callback = this.data.context.ioc.get<Callback>(TYPES.Callback)
        //获取泳道组
        const laneGroup = this.data.context.ioc.get<ChronosLaneGroupComponent>(TYPES.ChronosLaneGroupComponent);
        //获取节点导航窗
        const bar = this.data.context.ioc.get<ChronosNodeBarComponent>(TYPES.ChronosNodeBarComponent);
        //获取时间轴
        const timeline = this.data.context.ioc.get<ChronosTimelineComponent>(TYPES.ChronosTimelineComponent);
        //获取节点组
        const nodeGroup = this.data.context.ioc.get<ChronosNodeGroupComponent>(TYPES.ChronosNodeGroupComponent);
        //获取节点变形器
        const nodeTransformer = this.data.context.ioc.get<ChronosNodeTransformerComponent>(TYPES.ChronosNodeTransformerComponent);
        //节点详情
        const nodeDetail = this.data.context.ioc.get<ChronosNodeDetailComponent>(TYPES.ChronosNodeDetailComponent);
        //比例尺
        const scale = this.data.context.ioc.get<ChronosScaleComponent>(TYPES.ChronosScaleComponent);
        //修订窗
        const revise = this.data.context.ioc.get<ChronosNodeReviseComponent>(TYPES.ChronosNodeReviseComponent);

        //初始化泳道组
        this.data.originalNodeEntryData.forEach((entryData) => {
            entryData.layer = this.data.layer;
            const service = new ChronosNodeEntryService(
                entryData, callback, bar, laneGroup, timeline, nodeGroup, nodeTransformer, nodeDetail, revise, scale);
            const component = new ChronosNodeEntryComponent(entryData, service);
            service.listenScale()
            this.data.nodeGroup.push(component);
        })
    }

    /**
     * 启动
     */
    start() {
        this.data.nodeGroup.forEach((entryComponent) => {
            entryComponent.data.graphics?.shape?.destroy()
            entryComponent.data.graphics = undefined
            entryComponent.service.initCoordinate();
            entryComponent.service.followLane()
            entryComponent.service.listenLane()
        })
        super.start();
    }

    toolbar(): ChronosToolPlug {
        const graphics = (button: ButtonType) => {
            //线条长度
            const line = button.stroke.length * 1.5;
            const line_2 = line / 2;
            const x = line / 8;
            const x2 = line / 2;
            const path = `
            M-${x} -${line_2}l${line_2} ${line_2}
            M-${x} ${line_2}l${line_2} -${line_2}
            M${x2} -${line_2}l${line_2} ${line_2}
            M${x2} ${line_2}l${line_2} -${line_2}
            `
            return new Konva.Path({
                x: 0,
                y: 0,
                data: path,
                stroke: this.data.hideProgress ? button.stroke.color : button.stroke.hoverColor,
                strokeWidth: button.stroke.width,
                lineJoin: 'round',
                lineCap: 'round',
            })
        }

        const callback = (graphics: Konva.Path, button: ButtonType) => {
            this.data.hideProgress ? graphics.stroke(button.stroke.hoverColor) : graphics.stroke(button.stroke.color)
            this.data.hideProgress ? this.service.open() : this.service.close()
        }

        return new ChronosToolPlug("进度", graphics, callback)
    }

}
