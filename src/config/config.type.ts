import Konva from "konva";
import {StageConfig} from "./config.stage";
import {RendererWindow} from "../engine/renderer.window";

/**
 * canvas 舞台组
 */
export type StageGroup = {
    stage: Konva.Stage;
    config: StageConfig;
};

/**
 * 窗口视图组
 */
export type WindowGroup = {
    rootHtmlElement: HTMLDivElement
    rendererWindow: RendererWindow
}
