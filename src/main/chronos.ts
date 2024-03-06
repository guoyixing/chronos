import {Context} from "./context/context";
import {ChronosWindow} from "./component/chronos.window";
import {ChronosTimeline} from "./component/chronos.timeline";

export class Chronos {

    private readonly context: Context

    constructor(rootHtml: HTMLDivElement) {

        if (!rootHtml) {
            throw Error("div 还没有被渲染")
        }

        rootHtml.style.overflow = 'hidden';

        this.context = new Context(rootHtml)

        document.addEventListener('DOMContentLoaded', () => {
            console.log(rootHtml)
            const chronosWindow = new ChronosWindow(this.context);
            const chronosTimeline = new ChronosTimeline(this.context, {
                years: [2024, 2025]
            });
            console.log(chronosWindow)
            console.log(chronosTimeline)
        });
    }
}