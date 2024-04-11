export type ButtonConfigType = {
    stroke?: {
        length?: number
        width?: number
        color?: string
        hoverColor?: string
        margin?: {
            left?: number
            right?: number
        }
    },
    background?: {
        color?: string
        hoverColor?: string
    }
}

export type ButtonType = {
    stroke: {
        length: number
        width: number
        color: string
        hoverColor: string
        margin: {
            left: number
            right: number
        }
    },
    background: {
        color: string
        hoverColor: string
    }
}

/**
 * 泳道按钮类型
 */
export type ButtonLaneType = {
    stroke: {
        length: number
        width: number
        color: string
        margin: {
            left: number
            bottom: number
        }
    },
    background: {
        height: number
        width: number
        color: string
        hoverColor: string
        stroke: number
        strokeColor: string
        radius: number | number[]
    },
    text: {
        color: string
        fontSize: number
        fontFamily: string
    }
}

/**
 * 泳道按钮配置类型
 */
export type ButtonLaneConfigType = {
    stroke?: {
        length?: number
        width?: number
        color?: string
        margin?: {
            left?: number
            bottom?: number
        }
    },
    background?: {
        height?: number
        width?: number
        color?: string
        hoverColor?: string
        stroke?: number
        strokeColor?: string
        radius?: number | number[]
    },
    text?: {
        color?: string
        fontSize?: number
        fontFamily?: string
    }
}

/**
 * 文字按钮
 */
export type ButtonTextType = {
    margin: {
        right: number,
        bottom: number
    }
    text: {
        color: string,
        hoverColor: string,
        fontSize: number,
        fontFamily: string
    },
    background: {
        color: string,
        hoverColor: string,
        height: number,
        width: number,
        stroke: number,
        strokeColor: string,
        radius: number | number[]
    },
}

/**
 * 文字按钮配置
 */
export type ButtonTextConfigType = {
    margin: {
        right?: number,
        bottom?: number
    }
    text: {
        color?: string,
        hoverColor?: string,
        fontSize?: number,
        fontFamily?: string
    },
    background: {
        color?: string,
        hoverColor?: string,
        height?: number,
        width?: number,
        stroke?: number,
        strokeColor?: string,
        radius?: number | number[]
    }
}