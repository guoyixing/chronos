import {StageConfig} from "../metadata/config/config.stage";
import Konva from "konva";


/**
 * Context
 */
export class Context {

    readonly stageConfig: StageConfig

    readonly stage: Konva.Stage;

    readonly rootLayer: Konva.Layer

    readonly htmlElement: HTMLDivElement

    constructor(htmlElement: HTMLDivElement) {

        this.htmlElement = htmlElement
        this.rootLayer = new Konva.Layer()

        const stageConfig = new StageConfig(htmlElement, true);
        this.stageConfig = stageConfig

        this.stage = new Konva.Stage({
            container: stageConfig.rootElement.id,
            width: stageConfig.size.width,
            height: stageConfig.size.height
        });
        this.stage.add(this.rootLayer)
    }

    getSize() {
        return [this.stageConfig.size.width, this.stageConfig.size.height]
    }

}
