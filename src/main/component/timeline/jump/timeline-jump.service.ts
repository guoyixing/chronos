import Konva from "konva";
import {ComponentService} from "../../component-service.interface";
import {inject, injectable} from "inversify";
import {ChronosJumpTimelineData} from "./timeline-jump.data";
import {ChronosToolbarComponent} from "../../toolbar/toolbar.component";
import {TYPES} from "../../../config/inversify.config";
import {ChronosTimelineComponent} from "../timeline.component";
import {formatLocalDate} from "../../../core/common/utils/date.utils";

/**
 * 时间轴跳转-组件服务
 */
@injectable()
export class ChronosJumpTimelineService implements ComponentService {

    /**
     * 数据
     */
    private _data: ChronosJumpTimelineData

    /**
     * 窗口
     */
    private _timeline: ChronosTimelineComponent

    /**
     * 工具栏
     */
    private _toolbar: ChronosToolbarComponent

    constructor(@inject(TYPES.ChronosJumpTimelineData) data: ChronosJumpTimelineData,
                @inject(TYPES.ChronosTimelineComponent) timeline: ChronosTimelineComponent,
                @inject(TYPES.ChronosToolbarComponent) toolbar: ChronosToolbarComponent) {
        this._data = data;
        this._timeline = timeline;
        this._toolbar = toolbar;
    }

    draw() {
        const data = this._data;
        if (data.hide) {
            return
        }
        const coordinate = this._data.context.drawContext.getFixedCoordinate();
        //绘制背景
        const background = new Konva.Rect({
            x: 0,
            y: 0,
            width: data.width,
            height: data.height,
            fill: data.backgroundColor,
            stroke: data.borderColor,
            strokeWidth: data.border,
            cornerRadius: data.radius
        });


        //在背景上创建一个html的input框
        const toobarData = this._toolbar.data;
        const x = (data.startOffSet?.x ?? toobarData.startOffSet.x + (toobarData.width - data.width) / 2);
        const y = (data.startOffSet?.y ?? toobarData.startOffSet.y - data.height - data.bottomMargin);

        this.drawForm(x, y)
        const group = new Konva.Group({
            x: coordinate.x + x,
            y: coordinate.y + y
        });
        group.add(background)
        data.graphics = group;
        data.layer?.add(group)
    }

    drawForm(x: number, y: number) {
        const data = this._data;
        const stagePosition = data.context.drawContext.stage.container().getBoundingClientRect();


        // 创建一个div元素作为容器
        let div = document.createElement('div');
        div.id = 'jump-timeline';
        div.style.position = 'absolute';
        div.style.left = stagePosition.x + x + 'px';
        div.style.top = stagePosition.y + y + 'px';
        div.style.width = data.width + 'px';
        div.style.height = data.height + 'px';
        div.style.display = 'flex';
        div.style.justifyContent = 'center';
        div.style.alignItems = 'center';

        //添加一个input框
        let input = document.createElement('input');
        input.type = 'datetime-local';
        //设置边框颜色
        input.style.borderColor = data.backgroundColor;
        //设置背景颜色
        input.style.backgroundColor = data.backgroundColor;
        //获取当前时间
        input.value = formatLocalDate(this._timeline.service.getCurrentTime())
        div.appendChild(input)

        //监听input框的值变化
        input.addEventListener('change', (e) => {
            //获取input框的值
            const value = (e.target as HTMLInputElement).value;
            if (value) {
                //将值转换为时间戳
                const time = new Date(value);
                //跳转到指定时间
                this.jumpTime(time)
            }
        })
        // 将主容器添加到DOM中
        document.body.appendChild(div);

    }

    /**
     * 跳转到指定时间
     */
    jumpTime(date: Date) {
        const data = this._data;
        const timeline = this._timeline;
        const x = timeline.service.getXByTime(date) - timeline.data.headWidth + timeline.data.border * 2;
        //跳转到指定时间
        data.context.drawContext.stage.x(-x)
        data.context.drawContext.stage.fire('dragmove')
    }


    open() {
        this._data.hide = false;
        this.draw()
    }

    close() {
        this._data.hide = true;
        document.getElementById('jump-timeline')?.remove();
        this._data.graphics?.destroy();
    }
}
