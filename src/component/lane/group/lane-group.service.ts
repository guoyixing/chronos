import {inject, injectable} from "inversify";
import {ComponentService} from "../../component-service.interface";
import {ChronosLaneGroupData} from "./lane-group.data";
import {ChronosWindowComponent} from "../../window/window.component";
import {TYPES} from "../../../config/inversify.config";
import {ChronosLaneEntryComponent} from "../entry/lane-entry.component";
import {EVENT_TYPES, EventPublisher} from "../../../core/event/event";
import {ChronosLaneEntryService} from "../entry/lane-entry.service";
import {ChronosLaneGroupComponent} from "./lane-group.component";
import {ChronosLaneEntryData} from "../entry/lane-entry.data";
import {ChronosLaneReviseComponent} from "../../revise/lane/lane-revise.component";
import {Callback} from "../../../core/event/callback/callback";
import {ChronosTimelineService} from "../../timeline/timeline.service";
import {ChronosTimelineData} from "../../timeline/timeline.data";
import Konva from "konva";

/**
 * 泳道组-组件服务
 */
@injectable()
export class ChronosLaneGroupService implements ComponentService, EventPublisher {

    id: string

    /**
     * 数据
     */
    _data: ChronosLaneGroupData

    /**
     * 回调
     */
    _callback: Callback

    /**
     * 窗体
     */
    _window: ChronosWindowComponent

    /**
     * 时间轴服务（用于获取有效可见级别数量）
     */
    _timelineService: ChronosTimelineService

    /**
     * 时间轴数据（用于获取行高）
     */
    _timelineData: ChronosTimelineData

    constructor(@inject(TYPES.ChronosLaneGroupData) data: ChronosLaneGroupData,
                @inject(TYPES.Callback) callback: Callback,
                @inject(TYPES.ChronosWindowComponent) window: ChronosWindowComponent,
                @inject(TYPES.ChronosTimelineService) timelineService: ChronosTimelineService,
                @inject(TYPES.ChronosTimelineData) timelineData: ChronosTimelineData) {
        this._data = data;
        this._callback = callback;
        this._window = window;
        this._timelineService = timelineService;
        this._timelineData = timelineData;
        this.id = "laneGroup"
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
        const data = this._data;
        
        //动态计算起始Y坐标：基于时间轴有效可见级别数量 × 时间轴行高 + 时间轴起始Y偏移
        const timelineRowHeight = this._timelineData.rowHeight;
        const effectiveLevelCount = this._timelineService.getEffectiveVisibleLevelCount();
        const timelineStartY = this._timelineData.startOffSet.y;
        const dynamicStartY = timelineStartY + effectiveLevelCount * timelineRowHeight;
        
        //绘制泳道
        data.height = dynamicStartY;
        if (this._data.height < height - dynamicStartY) {
            this.drawAddButton(dynamicStartY);
        }
         for (let i = 0; i < this._data.laneGroup.length; i++) {
             const lane = this._data.laneGroup[i];
             if (!lane) continue;
             lane.data.index = i;
             if (lane.data.hide) {
                 lane.data.startCoordinate = {x: startX, y: -99999}
             } else {
                 lane.data.startCoordinate = {x: startX, y: this._data.height}
                 lane.service.draw()
                 this._data.height += lane.data.height;
             }
         }

        //修改舞台移动限制
        this._data.context.drawContext.stageMoveLimit.yTop = -(this._data.height - height);
        this._data.context.drawContext.stageMoveLimit.yBottom = 0;
    }

    /**
     * 绘制添加按钮
     * @param dynamicStartY 动态计算的起始Y坐标
     */
    drawAddButton(dynamicStartY: number) {
        const data = this._data;


        const fixedCoordinate = this._data.context.drawContext.getFixedCoordinate();
        if (data.context.drawContext.isEdit && data.laneGroup.length < 1) {
            //画一个矩形
            const rect = new Konva.Rect({
                x: 0,
                y: 0,
                width: data.laneLeftWidth,
                height: this._window.data.height - dynamicStartY,
                fill: data.leftBackgroundColor,
                cornerRadius: data.radius,
                stroke: data.borderColor,
                strokeWidth: 0,
                shadowColor: data.shadow.color,
                shadowBlur: data.shadow.blur,
                shadowOffset: data.shadow.offset,
                shadowOpacity: data.shadow.opacity,
            });
            const group = new Konva.Group({
                x: fixedCoordinate.x + data.startOffSet.x,
                y: fixedCoordinate.y + data.height,
            });
            group.add(rect)


            //画一个+号
            const plus = new Konva.Text({
                x: 0,
                y: 0,
                text: '+',
                fontSize: 80,
                fontFamily: 'Calibri',
                fill: 'white',
            });
            plus.x((rect.width() - plus.width()) / 2)
            plus.y((rect.height() - plus.height()) / 2)
            group.add(plus)
            group.on('click', () => {
                const component = this.addLaneEntry();
                if (component) {
                    const laneGroup = data.context.ioc.get<ChronosLaneGroupComponent>(TYPES.ChronosLaneGroupComponent);
                    this._callback.laneAdd && this._callback.laneAdd(component.data, laneGroup);
                }
            })
            group.on('mouseover', () => {
                rect.fill(data.hoverLeftBackgroundColor)
            })
            group.on('mouseout', () => {
                rect.fill(data.leftBackgroundColor)
            })
            data.graphics = group
            data.layer?.add(group)
        }

    }

    /**
     * 移动x轴
     */
    keepPos() {
        //计算泳道组起始坐标，y坐标是不变的，x坐标是根据舞台位置计算的
        const fixedCoordinate = this._data.context.drawContext.getFixedCoordinate();
        //泳道组起始坐标
        const startX = fixedCoordinate.x + this._data.startOffSet.x;
        this._data.laneGroup.forEach(lane => {
            lane.service.moveX(startX)
        })
        this._data.graphics?.x(startX)
        this._data.graphics?.y(fixedCoordinate.y + this._data.height)
    }

    /**
     * 重新绘制
     */
    reDraw() {
        this._data.layer?.destroyChildren();
        this.draw();
        //发布事件
        this._data.laneGroup.forEach(lane => {
            lane.service.publishAndPop(EVENT_TYPES.ReDraw)
        })
        this.publishAndPop(EVENT_TYPES.ReDraw)
    }

    /**
     * 根据id获取泳道
     * @param id 泳道id
     */
    laneById(id: string): ChronosLaneEntryComponent | undefined {
        for (const laneEntry of this._data.laneGroup) {
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
             if (laneEntry && y >= laneEntry.data.startCoordinate.y) {
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
             if (laneEntry && laneEntry.data.id === id) {
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
    addLaneEntry(id?: string, indexOffSet?: number): ChronosLaneEntryComponent | undefined {
        const data = this._data;

        const window = this._window;
        const laneGroup = data.context.ioc.get<ChronosLaneGroupComponent>(TYPES.ChronosLaneGroupComponent);
        const callback = this._callback;
        const revise = data.context.ioc.get<ChronosLaneReviseComponent>(TYPES.ChronosLaneReviseComponent);
        const context = data.context;
        const entryData = new ChronosLaneEntryData(context, {
            id: 'lane' + data.laneGroup.length,
            name: '泳道' + data.laneGroup.length
        });
        const service = new ChronosLaneEntryService(entryData, callback, window, laneGroup, revise);
        const component = new ChronosLaneEntryComponent(entryData, service);
        if (id && indexOffSet) {
            const lane = this.laneById(id);
            lane && data.laneGroup.splice(lane.data.index + indexOffSet, 0, component);
        } else {
            data.laneGroup.push(component);
        }

        this.reDraw();
        return component;
    }

    /**
     * 事件绑定
     * @param event 事件名称
     * @param callback 回调
     */
    on<T = unknown>(event: symbol, callback: (data?: T) => void): void {
        const eventManager = this._data.context.eventManager;
        eventManager?.listen(this, event, callback)
    }

    /**
     * 发布事件
     * @param event 事件名称
     */
    publishAndPop(event: symbol): void {
        const eventManager = this._data.context.eventManager;
        eventManager?.publish(this, event)
    }
}
