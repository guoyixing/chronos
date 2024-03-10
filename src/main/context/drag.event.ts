import Konva from "konva";

export interface DragListener {
    stageMoveListen: () => void
    layer: Konva.Layer
}

type Publisher = (evtStr: string, handler: (e: Konva.KonvaEventObject<DragEvent>) => void) => void

/**
 * 帮助 Layer 发布拖拽移动事件，不持有上下文，职责是发布事件
 */
export class DragEventPublisher {

    /**
     *  Layer本身是自带顺序的,使用无序结构遍历通知
     */
    private readonly listenerBucket: Map<Konva.Layer, Array<DragListener>>

    private readonly publisher: Publisher

    constructor(props: Publisher, ...moveListeners: DragListener[]) {
        this.publisher = props;

        const map = new Map()

        for (const listener of moveListeners) {
            const arr = map.get(listener.layer);
            if (!arr) {
                map.set(listener.layer,[listener])
                continue
            }
            arr.push(listener)
        }

        this.listenerBucket = map
        this.publishMoveEvent()
    }

    /**
     * 监听拖拽
     */
    private publishMoveEvent() {
        this.publisher('dragmove', (e) => {
            if (e.target instanceof Konva.Stage) {
                this.listenerBucket.forEach((value, layer) => {
                    layer.destroyChildren();
                    this.notificationListener(value);
                })
            }
        })
    }

    /**
     * 通知触发拖拽
     */
    private notificationListener(moveListenerList: DragListener[]) {
        for (const moveListen of moveListenerList) {
            try {
                moveListen.stageMoveListen();
            } catch (e) {
                const error = e as Error
                console.error(`Drag move error : ${error.message}`)
            }
        }
    }

    public removeListener(item: DragListener): boolean {
        const listeners = this.listenerBucket.get(  item.layer);

        if (!listeners) {
            return false;
        }

        const index = listeners.indexOf(item);
        if (index === -1) {
            return false
        }

        listeners.splice(index, 1);
        return true
    }

    appendListener(listener: DragListener) {
        const listeners = this.listenerBucket.get(listener.layer);
        if (!listeners) {
            this.listenerBucket.set(listener.layer,[listener])
            return
        }
        listeners.push(listener)
    }
}
