import {ChronosWindowData} from "./data.window.component";
import {inject, injectable} from "inversify";
import Konva from "konva";
import {ComponentService} from "../service.component";
import {TYPES} from "../../config/inversify.config";

/**
 * 窗口-组件服务
 */
@injectable()
export class ChronosWindowService implements ComponentService {

    /**
     * 数据
     */
    private _data: ChronosWindowData

    constructor(@inject(TYPES.ChronosWindowData) data: ChronosWindowData) {
        this._data = data;
    }

    /**
     * 可见区域能够绘制的大小
     */
    getVisualRange(): { width: number, height: number } {
        // 防止内容覆写到边框上
        const border = 2 * this._data.border
        const width = this._data.width - border
        const height = this._data.height - border
        return {width, height}
    }

    /**
     * 限制舞台的移动范围
     * 不限制x轴移动
     * 限制y轴移动，y轴移动范围是泳道组的高度
     */
    limitStageMove(): void {
        //获取当前舞台的坐标
        const stage = this._data.context.drawContext.stage;
        const stageX = stage.x();
        let stageY = stage.y();

        const stageMoveLimit = this._data.context.drawContext.stageMoveLimit;
        if (stageY < stageMoveLimit.yTop) {
            stageY = stageMoveLimit.yTop;
        }
        if (stageY > stageMoveLimit.yBottom) {
            stageY = stageMoveLimit.yBottom;
        }
        stage.position({x: stageX, y: stageY});
    }


    /**
     * 绘制窗体
     * 不能使用rect，因为rect会挡住下面的图层的内容
     */
    draw() {
        const {width, height} = this.getVisualRange()
        const coordinate = this._data.context.drawContext.getFixedCoordinate()
        const border = this._data.border;
        const borderColor = this._data.borderColor;
        const x = coordinate.x + border;
        const y = coordinate.y + border;
        //画上边线
        const topLine = new Konva.Line({
            points: [x, y, x + width, y],
            stroke: borderColor,
            strokeWidth: border
        });
        //画下边线
        const bottomLine = new Konva.Line({
            points: [x, y + height, x + width, y + height],
            stroke: borderColor,
            strokeWidth: border
        });
        //画左边线
        const leftLine = new Konva.Line({
            points: [x, y, x, y + height],
            stroke: borderColor,
            strokeWidth: border
        });
        //画右边线
        const rightLine = new Konva.Line({
            points: [x + width, y, x + width, y + height],
            stroke: borderColor,
            strokeWidth: border
        });

        const group = new Konva.Group();
        group.add(topLine);
        group.add(bottomLine);
        group.add(leftLine);
        group.add(rightLine);

        this._data.graphics = group
        //加入图层
        this._data.layer?.add(group)
    }
}
