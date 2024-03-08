import {Context} from "./context/context";
import {ChronosWindow} from "./component/chronos.window";
import {ChronosTimeline} from "./component/chronos.timeline";
import {ChronosGrid} from "./component/chronos.grid";
import {DragEventPublisher} from "./context/drag.event";
import {ChronosLaneGroup} from "./component/chronos.lane";

export class Chronos {

    private readonly context: Context

    constructor(rootHtml: HTMLDivElement) {

        if (!rootHtml) {
            throw Error("div 还没有被渲染")
        }

        rootHtml.style.overflow = 'hidden';

        this.context = new Context(rootHtml)

        document.addEventListener('DOMContentLoaded', () => {
            //网格
            const grid = new ChronosGrid(this.context);
            //时间轴
            const chronosTimeline = new ChronosTimeline(this.context, {
                years: [2024, 2025]
            });
            //泳道组
            const chronosLaneGroup = new ChronosLaneGroup(this.context, {x: 0, y: 60});
            //窗体
            const chronosWindow = new ChronosWindow(this.context);


            // 发布事件不持有上下文,将 on 函数绑定到当前舞台
            const eventFunction =  this.context.stage.on.bind(this.context.stage)

            // 发布事件不持有上下文
            new DragEventPublisher(eventFunction,chronosWindow,chronosTimeline,grid,chronosLaneGroup);
        });
    }

}