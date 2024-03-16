import {Context} from "../../context/context";
import {ChronosNodeGroup} from "./chronos.node.group";
import {ChronosNodeBar} from "./chronos.node.bar";
import Konva from "konva";
import {ChronosLane, ChronosLaneGroup} from "../chronos.lane";


export type NodeEntry = {
    id: string,
    name?: string,
    type: string,
    startTime: {
        time?: Date,
        x?: number
    },
    finishTime?: {
        time?: Date,
        x?: number
    },
    lane: {
        laneData?: { id: string, row: number },
        y?: number
    }
}

type NodeLine = {
    lane?: { id: string, row: number },
    y?: number
}

type NodeTime = {
    time?: Date,
    x?: number
}

/**
 * 节点条目
 */
export class ChronosNodeEntry {
    /**
     * 上下文
     */
    private readonly context: Context

    /**
     * 节点组
     */
    group: ChronosNodeGroup;

    /**
     * 节点id
     */
    id: string

    /**
     * 名称
     */
    name: string

    /**
     * 节点类型
     */
    type: string

    /**
     * 节点开始时间
     * x轴定位
     */
    startTime: ChronosNodeTime

    /**
     * 节点结束时间
     * x轴定位
     * 使用finish，而不是end，因为根据PDM的定义，应该是开始和完成
     */
    finishTime: ChronosNodeTime | undefined

    /**
     * 所属泳道
     * y轴定位
     */
    lane: ChronosNodeLane

    /**
     * 图形
     */
    graphics: Konva.Shape | undefined

    constructor(context: Context, group: ChronosNodeGroup, data: NodeEntry) {
        this.context = context;
        this.group = group;
        this.id = data.id;
        this.name = data.name ?? '节点';
        this.type = data.type;
        this.startTime = new ChronosNodeTime(context, data.startTime);
        this.finishTime = data.finishTime ? new ChronosNodeTime(context, data.finishTime) : undefined;
        this.lane = new ChronosNodeLane(context,
            {
                lane: data.lane.laneData,
                y: data.lane.y
            });
        //在泳道中添加节点
        this.lane.lane?.node.push(this);
    }

    draw() {
        //获取bar
        const bar: ChronosNodeBar = this.context.getComponent('nodeBar');
        const node = bar.getGraphicsByNode(this);

        //获取泳道组
        const laneGroup: ChronosLaneGroup = this.context.getComponent('lane');
        //移动时候y轴绑定到泳道的行，只允许在奇数行移动
        node.dragBoundFunc((pos) => {
            const lane = laneGroup.laneByY(pos.y);
            if (lane === undefined) {
                throw new Error('泳道不存在')
            }
            const y = lane.getYByRow(lane.getRowByY(pos.y))
            return {
                x: pos.x,
                y: y+this.context.stage.y()%laneGroup.rowHeight
            };
        });

        //监听移动开始
        let moveRange: Konva.Rect;
        node.on('dragstart', () => {
            //画一个矩形作为移动范围的边界，用半透明绿色
            moveRange = new Konva.Rect({
                x: this.context.getFixedCoordinate().x,
                y: node.y() - laneGroup.rowHeight / 2,
                width: this.context.getSize()[0],
                height: laneGroup.rowHeight,
                fill: 'rgba(0,255,0,0.3)',
                stroke: 'rgba(0,0,0,0)',
                strokeWidth: 0
            });
            this.group.layer.add(moveRange);
        });

        //监听移动
        node.on('dragmove', () => {
            //可移动范围切换到泳道的行
            const moveRangeY = node.y() - laneGroup.rowHeight / 2;
            moveRange.y(moveRangeY);
        });

        //监听移动结束
        node.on('dragend', () => {
            if (moveRange) {
                //移动结束后，移除移动范围
                moveRange.destroy();
            }

            //移动结束后，更新节点所属泳道
            const laneNodes = this.lane.lane?.node;
            if (laneNodes) {
                //原先的泳道中，移除节点
                let index = laneNodes.indexOf(this);
                if (index !== -1) {
                    laneNodes.splice(index, 1);
                }
            }
            //新的泳道中，添加节点
            const lane = laneGroup.laneByY(node.y());
            if (lane === undefined) {
                throw new Error('泳道不存在')
            }
            lane.node.push(this);

            //更新节点中的泳道信息
            this.lane.id = lane.id;
            this.lane.row = lane.getRowByY(node.y());
            this.lane.y = node.y();
            this.lane.lane = lane;

        });

        this.graphics = node
        this.group.layer.add(node);
    }
}


/**
 * 节点所属泳道
 */
export class ChronosNodeLane {
    /**
     * 上下文
     */
    private readonly context: Context

    /**
     * 泳道id
     */
    id: string | undefined

    /**
     * 泳道中的所属行号
     */
    row: number | undefined

    /**
     * y坐标
     */
    y: number | undefined

    /**
     * 泳道
     */
    lane: ChronosLane | undefined


    constructor(context: Context, data: NodeLine) {
        if ((data.lane === undefined) && (data.y === undefined)) {
            throw new Error('泳道和y坐标必须存在一个')
        }
        this.context = context;
        const landGroup = context.getComponent('lane');
        if (data.lane !== undefined) {
            //获取泳道
            const lane = landGroup.laneById(data.lane.id);
            this.y = lane.getYByRow(data.lane.row)
            this.id = data.lane.id;
            this.row = data.lane.row;
            this.lane = lane;
        } else if (data.y !== undefined) {
            //获取泳道
            const lane = landGroup.laneByY(data.y);
            this.y = data.y;
            this.id = lane.id;
            this.row = lane.getRowByY(data.y);
            this.lane = lane;
        }
        if (this.lane === undefined) {
            throw new Error('泳道不存在')
        }
    }
}

/**
 * 节点时间
 */
export class ChronosNodeTime {
    /**
     * 上下文
     */
    private readonly context: Context

    /**
     * 时间
     */
    time: Date | undefined

    /**
     * x坐标
     */
    x: number | undefined


    constructor(context: Context, data: {
        time?: Date,
        x?: number
    }) {
        if ((data.time === undefined) && (data.x === undefined)) {
            throw new Error('时间和x坐标必须存在一个')
        }
        this.context = context;
        const timeline = context.getComponent('timeline');
        if (data.time !== undefined) {
            this.time = data.time;
            this.x = timeline.convertTimestampToX(data.time.getTime());
        } else if (data.x !== undefined) {
            this.time = new Date(timeline.convertXToTimestamp(data.x));
            this.x = data.x;
        }
    }
}
