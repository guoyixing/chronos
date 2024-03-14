import {Context} from "../../context/context";
import {DragListener} from "../../context/drag.event";
import Konva from "konva";
import {ChronosNodeEntry} from "./chronos.node.entry";

/**
 * 节点组
 */
export class ChronosNodeGroup implements DragListener {

    /**
     * 上下文
     */
    private readonly context: Context

    /**
     * 图层
     */
    private _layer: Konva.Layer

    /**
     * 节点组
     */
    private _nodeGroup: ChronosNodeEntry[] = []

    constructor(context: Context, nodeGroup?: ChronosNodeEntry[]) {
        this.context = context;
        this._layer = this.context.applyLayer('nodeGroup')
        this._nodeGroup = nodeGroup ?? this._nodeGroup;
        this.stageMoveListen();
    }

    stageMoveListen() {
    }


    get layer(): Konva.Layer {
        return this._layer;
    }
}