/**
 * 窗口配置 todo style
 */
export class WindowConfig {

    /**
     * 窗口的大小
     */
    private _windowSize: {
        x: number,
        y: number,
        w: number,
        h: number
    }

    /**
     * 大小比率百分比
     */
    private _scale: number

    /**
     * 最小单元格大小
     */
    private _grid: number

    constructor(htmlElement: HTMLElement, scale: number, grid: number) {
        const domRect = htmlElement.getBoundingClientRect();
        this._windowSize = {
            x: domRect.left,
            y: domRect.top,
            w: domRect.right,
            h: domRect.bottom
        };
        this._scale = scale;
        this._grid = grid;
    }

    /**
     * 乘以缩放倍数
     */
    get windowSize(): { x: number; y: number; w: number; h: number } {
        const self = this;
        const size = self._windowSize;
        return {
            x: size.x * self._scale,
            y: size.y * self._scale,
            w: size.w * self._scale,
            h: size.h * self._scale
        };
    }

    set windowSize(value: { x: number; y: number; w: number; h: number }) {
        this._windowSize = value;
    }

    get scale(): number {
        return this._scale;
    }

    set scale(value: number) {
        this._scale = value;
    }

    get grid(): number {
        return this._grid;
    }

    set grid(value: number) {
        this._grid = value;
    }
}