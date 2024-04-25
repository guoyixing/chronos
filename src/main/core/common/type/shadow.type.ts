/**
 * 阴影配置
 */
export type ShadowConfigType = {
    /**
     * 颜色
     */
    color?: string,
    /**
     * 模糊范围
     */
    blur?: number,
    /**
     * 偏移量
     */
    offset?: { x?: number, y?: number },
    /**
     * 透明度 0-1
     */
    opacity?: number,
}

/**
 * 阴影
 */
export type ShadowType = {
    /**
     * 颜色
     */
    color: string,
    /**
     * 模糊范围
     */
    blur: number,
    /**
     * 偏移量
     */
    offset: { x: number, y: number },
    /**
     * 透明度 0-1
     */
    opacity: number,
}