import {Context} from "../../context/context";
import {ChronosGrid} from "../chronos.grid";
import {StageConfig} from "../../metadata/config/config.stage";
import {GridConfig} from "../../metadata/config/config.stage.grid";
import {ChronosNodeBrush} from "./chronos.node.brush";

/**
 * 节点画板
 */
export class ChronosNodeDraw {
    private readonly context: Context

    constructor(rootHtml: HTMLDivElement) {

        if (!rootHtml) {
            throw Error("div 还没有被渲染")
        }

        rootHtml.style.overflow = 'hidden';
        const gridConfig = new GridConfig()
        gridConfig.point = true
        const stageConfig = new StageConfig(rootHtml, true, false)
        stageConfig.grid = gridConfig
        this.context = new Context(stageConfig)

        document.addEventListener('DOMContentLoaded', () => {
            //网格
            const grid = new ChronosGrid(this.context);
            //画笔
            const chronosNodeBrush = new ChronosNodeBrush(this.context);
        });
    }
}
