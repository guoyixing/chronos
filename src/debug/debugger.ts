// import Konva from "konva";
// import {DragListener} from "../core/event/drag.event";
// import {Context} from "../core/context/context";
//
//
// const size = {
//     width: 300,
//     height: 160,
// };
//
// /**
//  * debugger窗口的dom
//  */
// function debuggerDiv() {
//     const newDiv = document.createElement("div");
//     newDiv.id = "newDiv";
//     newDiv.style.width = `${size.width}px`;
//     newDiv.style.height = `${size.height}px`;
//     newDiv.style.background = "#fff";
//     newDiv.style.border = "1px solid black";
//     newDiv.style.position = "absolute";
//     newDiv.style.top = "8px";
//     newDiv.style.left = "1120px";
//     return newDiv;
// }
//
// export class Debugger implements DragListener {
//
//     private readonly context!: Context;
//
//     private readonly _layer!: Konva.Layer;
//
//     private readonly debugDiv!: HTMLDivElement;
//
//     private readonly debugStage!: Konva.Stage;
//
//     constructor(context: Context) {
//         const rootHtml = document.querySelector("#root");
//         if (!rootHtml) return;
//
//         this.debugDiv = debuggerDiv();
//         rootHtml.appendChild(this.debugDiv);
//
//         this.debugStage = new Konva.Stage({
//             container: this.debugDiv,
//             width: size.width,
//             height: size.height,
//             draggable: false,
//         });
//
//         this.context = context;
//         this._layer = new Konva.Layer();
//         this.debugStage.add(this._layer);
//         this.draw();
//
//         this.context.drawContext.stage.on("mousemove", () => {
//             this.draw();
//         });
//     }
//
//     get layer() {
//         return this._layer;
//     }
//
//     stageMoveListen(): void {
//         this.draw();
//     }
//
//     draw(): void {
//         this.layer.destroyChildren();
//
//         const position = this.context.drawContext.stage.getPointerPosition();
//         const fixedCoordinate = this.context.drawContext.getFixedCoordinate();
//
//         const windowText = new Konva.Text({
//             x: 8,
//             y: 8,
//             text: `窗口坐标: x: ${fixedCoordinate.x} y: ${fixedCoordinate.y}`,
//             fontSize: 16,
//             fill: "#359EE8",
//         });
//
//         const mouseText = new Konva.Text({
//             x: 8,
//             y: 64,
//             text: `鼠标坐标: x: ${position?.x} y: ${position?.y}`,
//             fontSize: 16,
//             fill: "#54A754",
//         });
//
//         this.layer.add(windowText);
//         this.layer.add(mouseText);
//     }
// }