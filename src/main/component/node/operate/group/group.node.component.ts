import {BaseComponent} from "../../../component";
import {ChronosNodeGroupData} from "./data.group.node.component";
import {ChronosNodeGroupService} from "./service.group.node.component";
import {Lifecycle} from "../../../../core/lifecycle/lifecycle";
import {inject, injectable} from "inversify";
import {TYPES} from "../../../../config/inversify.config";
import {ChronosWindowComponent} from "../../../window/window.component";
import {ChronosLaneGroupComponent} from "../../../lane/group/group.lane.component";
import {ChronosNodeBarComponent} from "../bar/bar.node.component";
import {ChronosNodeEntryService} from "../entry/service.entry.node.component";
import {ChronosNodeEntryComponent} from "../entry/entry.node.component";
import {ChronosTimelineComponent} from "../../../timeline/timeline.component";
import {ChronosNodeTransformerComponent} from "../transformer/transformer.node.component";

/**
 * 节点组-组件
 */
@injectable()
export class ChronosNodeGroupComponent extends BaseComponent<ChronosNodeGroupData, ChronosNodeGroupService>
    implements Lifecycle {

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
        //获取窗体组件
        const window = this.data.context.ioc.get<ChronosWindowComponent>(TYPES.ChronosWindowComponent);
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


        //初始化泳道组
        this.data.originalNodeEntryData.forEach((entryData) => {
            entryData.layer = this.data.layer;
            const service = new ChronosNodeEntryService(
                entryData, window, bar, laneGroup, timeline, nodeGroup,nodeTransformer);
            const component = new ChronosNodeEntryComponent(entryData, service);
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
            entryComponent.service.listenReDrawLane()
        })
        super.start();
    }

}
