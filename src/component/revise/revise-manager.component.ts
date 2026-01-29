import {ChronosReviseService, ReviseBindComponent} from "./revise.service";

/**
 * 修订窗管理器
 * 单例模式，确保同一时间只有一个修订窗打开
 */
export class ReviseManagerComponent {
    /**
     * 当前显示的修订服务
     */
    display: ChronosReviseService<ReviseBindComponent> | undefined

    private static _instance: ReviseManagerComponent;

    private constructor() {
    }

    public static getInstance(): ReviseManagerComponent {
        if (!ReviseManagerComponent._instance) {
            ReviseManagerComponent._instance = new ReviseManagerComponent();
        }
        return ReviseManagerComponent._instance;
    }

    /**
     * 打开修订窗
     * @param service 修订服务
     */
    open(service: ChronosReviseService<ReviseBindComponent>): void {
        this.display?.close()
        this.display = service;
    }
}
