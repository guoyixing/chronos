import {ComponentData} from "../../data.component";
import {Context} from "../../../core/context/context";
import Konva from "konva";

/**
 * 泳道条目-组件数据
 */
export class ChronosLaneEntryData extends ComponentData {

    /**
     * 图形
     */
    graphics: Konva.Group | undefined

    /**
     * 泳道id
     */
    id: string

    /**
     * 泳道名称
     */
    name: string

    /**
     * 泳道行数
     */
    rowNum: number = 1

    /**
     * 泳道行高度
     */
    height: number = 0

    /**
     * 渲染起始坐标
     */
    startCoordinate: { x: number, y: number } = {x: 0, y: 0}

    /**
     * 索引
     * 当前泳道在泳道组中的索引
     */
    index: number = 0

    /**
     * 泳道行
     * 可以存放节点的行对应的y坐标
     * 均为单数行
     */
    row: number[] = []

    /**
     * 隐藏泳道左侧
     */
    hideLeft: boolean = false

    /**
     * 泳道左侧背景颜色
     */
    leftBackgroundColor: string = "#f0f0f0"

    /**
     * 泳道边框颜色
     */
    borderColor: string = "black"

    /**
     * 泳道边框宽度
     */
    border: number = 1

    /**
     * 泳道文字颜色
     */
    textColor: string = "#555"

    /**
     * 泳道文字大小
     */
    fontSize: number = 16

    /**
     * 泳道文字字体
     */
    fontFamily: string = 'Calibri'

    /**
     * 泳道文字左边距
     */
    textLeftMargin: number = 10

    /**
     * 泳道文字上边距
     */
    textTopMargin: number = 10

    /**
     * 泳道文字下边距
     */
    textBottomMargin: number = 25

    /**
     * 按钮参数
     */
    button:{
        /**
         * 底边距
         */
        bottomMargin: number,
        /**
         * 左边距
         */
        leftMargin: number,
        /**
         * 宽度
         */
        width: number,
        /**
         * 高度
         */
        height: number,
        /**
         * 圆角
         */
        cornerRadius: number,
        /**
         * 背景颜色
         */
        backgroundColor: string,
        /**
         * 边框颜色
         */
        borderColor: string,
        /**
         * 边框大小
         */
        border: number,
        /**
         * 文字颜色
         */
        textColor: string,
        /**
         * 文字大小
         */
        fontSize: number,
        /**
         * 文字字体
         */
        fontFamily: string,
        /**
         * 提示文字颜色
         */
        hoverTextColor: string,
        /**
         * 提示文字大小
         */
        hoverFontSize: number,
        /**
         * 提示文字字体
         */
        hoverFontFamily: string
        /**
         * 悬浮背景颜色
         */
        hoverBackgroundColor: string
    }={bottomMargin:20,leftMargin:4,width:15,height:15,cornerRadius:20
        ,backgroundColor:"#aaa",borderColor:"black",border:0,
        textColor:"#fff",fontSize:20,fontFamily:"Calibri",
        hoverTextColor:"#000",hoverFontSize:12,hoverFontFamily:"Calibri",
        hoverBackgroundColor:"#555"
    }


    constructor(context: Context, id: string, name: string, rowNum: number) {
        super(context);
        this.id = id;
        this.name = name;
        this.rowNum = rowNum;
    }
}
