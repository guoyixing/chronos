/**
 * 网格配置
 */
export class GridConfig {

    /**
     * 网格间隙
     */
    private _size: number = 20;

    /**
     * 网格颜色
     */
    private _color: string = '#ddd';

    /**
     * 网格宽度，粗细
     */
    private _width: number = 1;


    constructor(size?: number, color?: string, width?: number) {
        this._size = size || this._size;
        this._color = color || this._color;
        this._width = width || this._width;
    }


    get size(): number {
        return this._size;
    }

    set size(value: number) {
        this._size = value;
    }

    get color(): string {
        return this._color;
    }

    set color(value: string) {
        this._color = value;
    }

    get width(): number {
        return this._width;
    }

    set width(value: number) {
        this._width = value;
    }
}