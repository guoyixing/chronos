import {GridConfig} from "./config.stage.grid";


export interface Size {
    width: number,
    height: number,
    border: number
}

/**
 * 窗口配置,后续需要添加一个 [自省] 调整窗口的大小，全局都是基于这个类的配置
 *
 */
export class StageConfig {

    private _size: Size;

    /**
     * 舞台所在的div元素
     */
    private _rootElement: HTMLDivElement;

    /**
     * 是否展示网格
     */
    private _showGrid: boolean = false;

    private _grid: GridConfig;

    /**
     * 构造器
     * @param divElement 舞台所在的div元素
     * @param showGrid 是否展示网格
     * @param size 舞台大小
     * @param grid 网格配置
     */
    constructor(divElement: HTMLDivElement, showGrid?: boolean, size?: Size, grid?: GridConfig) {
        this._rootElement = divElement;
        this._showGrid = showGrid || this._showGrid
        this._grid = grid || new GridConfig();

        // div的相对定位矩阵
        const clientRect = divElement.getBoundingClientRect();
        this._size = size || {
            width: clientRect.width,
            height: clientRect.height,
            border: 1
        };
    }

    get border(): number {
        return this._size.border
    }

    get size(): Size {
        return this._size;
    }

    set size(value: Size) {
        this._size = value;
    }

    get rootElement(): HTMLDivElement {
        return this._rootElement;
    }

    set rootElement(value: HTMLDivElement) {
        this._rootElement = value;
    }

    get showGrid(): boolean {
        return this._showGrid;
    }

    set showGrid(value: boolean) {
        this._showGrid = value;
    }

    get grid(): GridConfig {
        return this._grid;
    }

    set grid(value: GridConfig) {
        this._grid = value;
    }
}