import {Context} from "./context/context";
import {ChronosWindow} from "./component/chronos.window";
import {ChronosTimeline} from "./component/chronos.timeline";
import {ChronosGrid} from "./component/chronos.grid";
import {DragEventPublisher} from "./context/drag.event";
import {ChronosLaneGroup} from "./component/chronos.lane";
import {StageConfig} from "./metadata/config/config.stage";
import {Debugger} from "./context/debugger";

export class Chronos {

    private readonly context: Context

    constructor(rootHtml: HTMLDivElement) {

        if (!rootHtml) {
            throw Error("div 还没有被渲染")
        }

        rootHtml.style.overflow = 'hidden';

        const stageConfig = new StageConfig(rootHtml, true)
        this.context = new Context(stageConfig)

        document.addEventListener('DOMContentLoaded', () => {
            //网格
            const grid = new ChronosGrid(this.context);
            //泳道组
            const chronosLaneGroup = new ChronosLaneGroup(this.context, {x: 0, y: 60});
            //时间轴
            const chronosTimeline = new ChronosTimeline(this.context,2025);
            //窗体
            const chronosWindow = new ChronosWindow(this.context);


            // 发布事件不持有上下文,将 on 函数绑定到当前舞台
            const eventFunction = this.context.stage.on.bind(this.context.stage)

            // 发布事件不持有上下文
            const publisher = new DragEventPublisher(eventFunction, chronosWindow, chronosTimeline, grid, chronosLaneGroup);

            // 追加一个 debugger
            publisher.appendListener(new Debugger(this.context))

            console.log(this.context.stage.toJSON());
        });
    }

}
