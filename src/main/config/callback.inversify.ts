import {TYPES} from "./inversify.config";
import {Callback} from "../core/event/callback/callback";
import {Container} from "inversify";

export class CallbackConfig {

    callback: Callback

    constructor(chronosContainer: Container) {
        this.callback = new Callback();
        chronosContainer.bind<Callback>(TYPES.Callback).toConstantValue(this.callback);
    }
}