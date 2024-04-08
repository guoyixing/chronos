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