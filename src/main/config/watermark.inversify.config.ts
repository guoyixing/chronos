import {Container} from "inversify";
import {DataType} from "./data.type";
import {bindComponent, bindLifecycle, TYPES} from "./inversify.config";
import {Context} from "../core/context/context";
import {StageDragListener} from "../core/event/event";
import {ChronosWatermarkData} from "../component/watermark/data.watermark.component";
import {ChronosWatermarkComponent} from "../component/watermark/watermark.component";
import {ChronosWatermarkService} from "../component/watermark/service.watermark.component";
import {ToolbarPlugRegister} from "../component/toolbar/plug.toolbar.component";

/**
 * 水印配置
 */
export class WatermarkConfig {

    constructor(chronosContainer: Container, divElement: HTMLDivElement, data: DataType) {
        const watermark = data.watermark

        chronosContainer.bind<ChronosWatermarkData>(TYPES.ChronosWatermarkData).toConstantValue(new ChronosWatermarkData(
            chronosContainer.get<Context>(TYPES.Context),
            watermark
        ));
        chronosContainer.bind<ChronosWatermarkService>(TYPES.ChronosWatermarkService).to(ChronosWatermarkService);
        chronosContainer.bind<ChronosWatermarkComponent>(TYPES.ChronosWatermarkComponent).to(ChronosWatermarkComponent);

        chronosContainer.bind<StageDragListener>(TYPES.StageDragListener).to(ChronosWatermarkComponent);
        chronosContainer.bind<ToolbarPlugRegister>(TYPES.ToolbarPlugRegister).to(ChronosWatermarkComponent);

        bindComponent(chronosContainer, ChronosWatermarkComponent)
        bindLifecycle(chronosContainer, ChronosWatermarkComponent)
    }
}