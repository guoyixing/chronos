import {Context} from "./context/context";
import {ChronosWindow} from "./component/chronos.window";


export class Chronos {

    private readonly context: Context

    constructor(rootHtml: HTMLDivElement) {

        if (!rootHtml) {
            throw Error("div 还没有被渲染")
        }

        rootHtml.style.overflow = 'hidden';

        this.context = new Context(rootHtml)

        document.addEventListener('DOMContentLoaded', () => {
            const chronosWindow = new ChronosWindow(this.context);
            console.log(chronosWindow)
        });
    }
}