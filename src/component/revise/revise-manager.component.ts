import {ChronosReviseService} from "./revise.service";

export class ReviseManagerComponent {
    /**
     * 数据
     */
    display: ChronosReviseService<any> | undefined

    private static _instance: ReviseManagerComponent;

    private constructor() {
    }

    public static getInstance(): ReviseManagerComponent {
        if (!ReviseManagerComponent._instance) {
            ReviseManagerComponent._instance = new ReviseManagerComponent();
        }
        return ReviseManagerComponent._instance;
    }

    open(service: ChronosReviseService<any>) {
        this.display?.close()
        this.display = service;
    }
}
