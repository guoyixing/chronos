import {ComponentData} from "../data.component";
import {Context} from "../../core/context/context";
import {ChronosToolPlug} from "./plug.toolbar.component";
import {injectable} from "inversify";

/**
 * 工具栏-组件数据
 */
@injectable()
export class ChronosToolbarData extends ComponentData {

    /**
     * 工具组
     */
    toolPlugs: Array<ChronosToolPlug> = []

    /**
     * 渲染起始坐标
     */
    startOffSet: { x: number, y: number }

    /**
     * 宽度
     */
    width: number = 41


    constructor(context: Context, startOffSet: {
        x: number;
        y: number
    }) {
        super(context);
        this.startOffSet = startOffSet;
    }
}