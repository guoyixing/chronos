// import {Context} from "../../core/context/context";
// import {DragListener} from "../../core/event/drag.event";
// import Konva from "konva";
// import {ChronosNodeEntry, NodeEntry} from "./chronos.node.entry";
//
// /**
//  * 节点组
//  */
// export class ChronosNodeGroup implements DragListener {
//
//     /**
//      * 上下文
//      */
//     private readonly context: Context
//
//     /**
//      * 图层
//      */
//     private _layer: Konva.Layer
//
//     /**
//      * 节点组
//      */
//     nodeGroup: ChronosNodeEntry[] = []
//
//     constructor(context: Context, nodeGroup?: NodeEntry[]) {
//         this.context = context;
//         this._layer = this.context.applyLayer('nodeGroup')
//
//         const initData = this.initNodeEntry(nodeGroup);
//         this.nodeGroup = initData ?? this.nodeGroup;
//         this.draw();
//     }
//
//     initNodeEntry(nodeGroup: NodeEntry[] | undefined) {
//
//         //TODO 临时数据
//         nodeGroup =  [
//             {
//                 id: '1',
//                 name: '节点1',
//                 type: 'star',
//                 startTime: {
//                     x: 400
//                 },
//                 lane: {
//                     y: 400
//                 }
//             },
//             {
//                 id: '1',
//                 name: '节点1',
//                 type: 'star',
//                 startTime: {
//                     x: 200
//                 },
//                 lane: {
//                     y: 200
//                 }
//             }
//         ]
//         if (!nodeGroup) {
//             return undefined;
//         }
//
//         return nodeGroup.map((entry) => {
//             return new ChronosNodeEntry(this.context, this, entry);
//         })
//     }
//
//     draw() {
//         this.nodeGroup.forEach((entry) => {
//             entry.draw();
//         })
//     }
//
//     stageMoveListen() {
//     }
//
//
//     get layer(): Konva.Layer {
//         return this._layer;
//     }
// }
