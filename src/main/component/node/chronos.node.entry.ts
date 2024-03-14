import {Context} from "../../context/context";

/**
 * 节点条目
 */
export class ChronosNodeEntry {
    /**
     * 上下文
     */
    private readonly context: Context

    /**
     * 节点id
     */
    private _id: string

    /**
     * 名称
     */
    private _name: string

    /**
     * 节点类型
     */
    private _type: string

    /**
     * 节点开始时间
     * x轴定位
     */
    private _startTime: ChronosNodeTime

    /**
     * 节点结束时间
     * x轴定位
     * 使用finish，而不是end，因为根据PDM的定义，应该是开始和完成
     */
    private _finishTime: ChronosNodeTime | undefined

    /**
     * 所属泳道
     * y轴定位
     */
    private _lane: ChronosNodeLane

    constructor(data: {
        context: Context,
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
        },

    }) {
        this.context = data.context;
        this._id = data.id;
        this._name = data.name ?? '节点';
        this._type = data.type;
        this._startTime = new ChronosNodeTime(data.context, data.startTime);
        this._finishTime = data.finishTime ? new ChronosNodeTime(data.context, data.finishTime) : undefined;
        this._lane = new ChronosNodeLane(data.context,
            {
                lane: data.lane.laneData,
                y: data.lane.y
            });
    }


    get id(): string {
        return this._id;
    }

    set id(value: string) {
        this._id = value;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get type(): string {
        return this._type;
    }

    set type(value: string) {
        this._type = value;
    }

    get startTime(): ChronosNodeTime {
        return this._startTime;
    }

    set startTime(value: ChronosNodeTime) {
        this._startTime = value;
    }

    get finishTime(): ChronosNodeTime | undefined {
        return this._finishTime;
    }

    set finishTime(value: ChronosNodeTime | undefined) {
        this._finishTime = value;
    }

    get lane(): ChronosNodeLane {
        return this._lane;
    }

    set lane(value: ChronosNodeLane) {
        this._lane = value;
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
    private _id: string | undefined

    /**
     * 泳道中的所属行号
     */
    private _row: number | undefined

    /**
     * y坐标
     */
    private _y: number | undefined


    constructor(context: Context, data: {
        lane?: { id: string, row: number },
        y?: number
    }) {
        if ((data.lane === undefined) && (data.y === undefined)) {
            throw new Error('泳道和y坐标必须存在一个')
        }
        this.context = context;
        const landGroup = context.getComponent('land');
        if (data.lane !== undefined) {
            //获取泳道
            const lane = landGroup.laneById(data.lane.id);
            this._y = lane.getYByRow(data.lane.row)
            this._id = data.lane.id;
            this._row = data.lane.row;
        }else if (data.y !== undefined) {
            //获取泳道
            const lane = landGroup.laneByY(data.y);
            this._y = data.y;
            this._id = lane.id;
            this._row = lane.getRowByY(data.y);
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
    private _time: Date | undefined

    /**
     * x坐标
     */
    private _x: number | undefined


    constructor(context: Context, data: {
        time?: Date,
        x?: number
    }) {
        if ((data.time === undefined) && (data.x === undefined)) {
            throw new Error('时间和x坐标必须存在一个')
        }
        this.context = context;
        this._time = data.time;
        this._x = data.x;
    }

    get time(): Date | undefined {
        return this._time;
    }

    set time(value: Date | undefined) {
        this._time = value;
    }

    get x(): number | undefined {
        return this._x;
    }

    set x(value: number | undefined) {
        this._x = value;
    }
}