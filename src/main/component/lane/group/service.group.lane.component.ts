import {inject, injectable} from "inversify";
import {ComponentService} from "../../service.component";
import {ChronosLaneGroupData} from "./data.group.lane.component";
import {ChronosWindowComponent} from "../../window/window.component";
import {TYPES} from "../../../config/inversify.config";
import {ChronosLaneEntryComponent} from "../entry/entry.lane.component";
import {EVENT_TYPES} from "../../../core/event/event";
import {ChronosLaneEntryService} from "../entry/service.entry.lane.component";
import {ChronosLaneGroupComponent} from "./group.lane.component";
import {Context} from "../../../core/context/context";
import {ChronosLaneEntryData} from "../entry/data.entry.lane.component";
import {ChronosLaneReviseComponent} from "../../revise/lane/lane.revise.component";
import {Callback} from "../../../core/event/callback/callback";

/**
 * 泳道组-组件服务
 */
@injectable()
export class ChronosLaneGroupService implements ComponentService {

    /**
     * 数据
     */
    private _data: ChronosLaneGroupData

    /**
     * 窗体
     */
    private _window: ChronosWindowComponent

    constructor(@inject(TYPES.ChronosLaneGroupData) data: ChronosLaneGroupData,
                @inject(TYPES.ChronosWindowComponent) window: ChronosWindowComponent) {
        this._data = data;
        this._window = window;
    }

    /**
     * 绘制
     */
    draw() {
        const {height} = this._window.service.getVisualRange()

        //计算泳道组起始坐标，y坐标是不变的，x坐标是根据舞台位置计算的
        const fixedCoordinate = this._data.context.drawContext.getFixedCoordinate();

        //泳道组起始坐标
        const startX = fixedCoordinate.x + this._data.startOffSet.x;

        //绘制泳道
        this._data.height = this._data.startOffSet.y;
        for (let i = 0; i < this._data.laneGroup.length; i++) {
            const lane = this._data.laneGroup[i];
            lane.data.index = i;
            lane.data.startCoordinate = {x: startX, y: this._data.height}
            lane.service.draw()
            this._data.height += lane.data.height;
        }

        //修改舞台移动限制
        this._data.context.drawContext.stageMoveLimit.yTop = -(this._data.height - height);
        this._data.context.drawContext.stageMoveLimit.yBottom = 0;
    }

    /**
     * 移动x轴
     */
    moveX() {
        //计算泳道组起始坐标，y坐标是不变的，x坐标是根据舞台位置计算的
        const fixedCoordinate = this._data.context.drawContext.getFixedCoordinate();
        //泳道组起始坐标
        const startX = fixedCoordinate.x + this._data.startOffSet.x;
        this._data.laneGroup.forEach(lane => {
            lane.service.moveX(startX)
        })
    }

    /**
     * 重新绘制
     */
    reDraw() {
        this._data.layer?.destroyChildren();
        this.draw();
        //发布事件
        this._data.laneGroup.forEach(lane => {
            lane.service.publish(EVENT_TYPES.ReDraw)
        })
    }

    /**
     * 根据id获取泳道
     * @param id 泳道id
     */
    laneById(id: string): ChronosLaneEntryComponent | undefined {
        for (let laneEntry of this._data.laneGroup) {
            if (laneEntry.data.id === id) {
                return laneEntry;
            }
        }
    }


    /**
     * 根据y轴坐标获取泳道
     * @param y y轴坐标
     */
    laneByY(y: number): ChronosLaneEntryComponent | undefined {
        for (let i = this._data.laneGroup.length - 1; i >= 0; i--) {
            //遍历的泳道
            const laneEntry = this._data.laneGroup[i];
            if (y >= laneEntry.data.startCoordinate.y) {
                //获取鼠标移动到的泳道的索引
                return laneEntry;
            }
        }
    }

    /**
     * 移除泳道条目
     * @param id 泳道id
     */
    removeLaneEntry(id: string) {
        const data = this._data;
        const lane = this.laneById(id);
        if (!lane) {
            return
        }
        for (let i = 0; i < data.laneGroup.length; i++) {
            const laneEntry = data.laneGroup[i];
            if (laneEntry.data.id === id) {
                laneEntry.service.clear()
                break
            }
        }
        this.reDraw();
    }

    /**
     * 在指定泳道上方添加泳道
     * @param id 泳道id
     * @param indexOffSet 索引偏移
     */
    addLaneEntry(id: string, indexOffSet: number): ChronosLaneEntryComponent | undefined {
        const data = this._data;
        const lane = this.laneById(id);
        const window = data.context.ioc.get<ChronosWindowComponent>(TYPES.ChronosWindowComponent);
        const laneGroup = data.context.ioc.get<ChronosLaneGroupComponent>(TYPES.ChronosLaneGroupComponent);
        const callback = data.context.ioc.get<Callback>(TYPES.Callback);
        const revise = data.context.ioc.get<ChronosLaneReviseComponent>(TYPES.ChronosLaneReviseComponent);
        const context = data.context.ioc.get<Context>(TYPES.Context);
        if (!lane) {
            return
        }
        const laneIndex = lane.data.index + indexOffSet;
        const entryData = new ChronosLaneEntryData(context, {
            id: 'new' + data.laneGroup.length,
            name: '泳道' + data.laneGroup.length
        });
        const service = new ChronosLaneEntryService(entryData, callback, window, laneGroup, revise);
        const component = new ChronosLaneEntryComponent(entryData, service);
        data.laneGroup.splice(laneIndex, 0, component);
        this.reDraw();
        return component;
    }
}
