import {Container} from "inversify";
import {DataType} from "./data.type";
import {TYPES} from "./inversify.config";
import {Context} from "../core/context/context";
import {ChronosFullscreenData} from "../component/fullscreen/fullscreen.data";
import {ChronosFullscreenService} from "../component/fullscreen/fullscreen.service";
import {ChronosFullscreenComponent} from "../component/fullscreen/fullscreen.component";
import {ToolbarPlugRegister} from "../component/toolbar/toolbar-plug.component";

/**
 * 全屏配置
 */
export class FullscreenConfig {
    constructor(chronosContainer: Container, divElement: HTMLDivElement, _data: DataType) {
        // 绑定数据
        chronosContainer.bind<ChronosFullscreenData>(TYPES.ChronosFullscreenData)
            .toConstantValue(new ChronosFullscreenData(
                chronosContainer.get<Context>(TYPES.Context)
            ));

        // 绑定服务
        chronosContainer.bind<ChronosFullscreenService>(TYPES.ChronosFullscreenService)
            .to(ChronosFullscreenService);

        // 绑定组件
        chronosContainer.bind<ChronosFullscreenComponent>(TYPES.ChronosFullscreenComponent)
            .to(ChronosFullscreenComponent);

        // 注册工具栏插件
        chronosContainer.bind<ToolbarPlugRegister>(TYPES.ToolbarPlugRegister)
            .to(ChronosFullscreenComponent);

        // 绑定根元素到服务
        const service = chronosContainer.get<ChronosFullscreenService>(TYPES.ChronosFullscreenService);
        service.bindRootElement(divElement);
    }
}
