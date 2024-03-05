/**
 * 事件回调
 */
export interface DOMEventCallback {

    /**
     * 执行时间的 this
     */
    pointer: object

    /**
     * 鼠标点击
     */
    mouseClick: (event: MouseEvent) => void;

    /**
     * 鼠标移动
     */
    mouseMove: (event: MouseEvent) => void;

    /**
     * DOM初始化后,才会去注册我们的其余事件
     */
    eventInitialization: (event: Event) => void;
}

/**
 * 窗口句柄提供器
 * @see 受支持的场合: Chrome 64, Chrome Android 64, Edge, Firefox, Opera 51, Safari 11, Safari iOS 11
 */
export class EventProvider {

    private args: DOMEventCallback;

    constructor(args: DOMEventCallback) {

        // 替换执行函数的 this 指针 [ function.bind()() ]
        this.args = {
            pointer: args.pointer,
            mouseClick: (event: MouseEvent) => {
                args.mouseClick.bind(args.pointer)(event);
            },
            mouseMove: (event: MouseEvent) => {
                args.mouseMove.bind(args.pointer)(event);
            },
            eventInitialization: (event: Event) => {
                args.eventInitialization.bind(args.pointer)(event);
            }
        }

        this.registerRawEvent();
    }

    /**
     * 等DOM窗口初始化后再初始化其余事件
     */
    private registerRawEvent() {
        document.addEventListener('DOMContentLoaded', (event: Event) => {

            // 先触发创建事件
            this.args.eventInitialization(event);

            // 订阅其余事件,待续
            document.addEventListener('click', this.args.mouseClick);
            document.addEventListener('mousemove', this.args.mouseMove);
        });
    }

    public removeEvent() {
        document.removeEventListener('click', this.args.mouseClick);
        document.removeEventListener('mousemove', this.args.mouseMove);
        document.addEventListener('DOMContentLoaded', this.args.eventInitialization);
    }
}