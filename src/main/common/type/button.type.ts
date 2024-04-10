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
        radius: number|number[]
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
        radius?: number|number[]
    },
    text?: {
        color?: string
        fontSize?: number
        fontFamily?: string
    }
}