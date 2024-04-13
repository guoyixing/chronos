import {ChronosReviseService} from "./serivce.revise.component";

export class ReviseManager {
    /**
     * 数据
     */
    display: ChronosReviseService<any> | undefined

    private static _instance: ReviseManager;

    private constructor() {
    }

    public static getInstance(): ReviseManager {
        if (!ReviseManager._instance) {
            ReviseManager._instance = new ReviseManager();
        }
        return ReviseManager._instance;
    }

    open(service: ChronosReviseService<any>) {
        this.display?.close()
        this.display = service;
    }
}
