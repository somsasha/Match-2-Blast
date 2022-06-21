import { EventTarget, EventTouch } from "cc";

import { GlobalEvent } from "../GlobalEvent";
import Events from "../../Enums/Events";

import InputTypes from "./InputTypes";
import InputSources from "./InputSources";

export default class InputManager extends EventTarget {
    //#region properties

    public isLockedMultiTouch: boolean = true;

    private currentTouchID: any = null;
    private static instance: InputManager = null;

    // #endregion

    private constructor() {
        super();
        this.subscribeEvents();
    }

    //#region public methods

    public on<T extends Function>(key: number | string, callback: T, target?: any, useCapture?: boolean): T {
        return super.on<any>('' + key, callback, target, useCapture);
    }

    public off<T extends Function>(key: number | string, callback: T, target?: any, useCapture?: boolean): void {
        super.off<any>('' + key, callback, target);
    }

    public static getInstance(): InputManager {
        if (this.instance === null) {
            this.instance = new InputManager();
        }

        return this.instance;
    }

    //#endregion


    //#region protected methods

    protected subscribeEvents(): void {
        GlobalEvent.getInstance().on(Events.INPUT, this.onInput, this);
    }

    //#endregion


    //#region event handlers

    private onInput(type: InputTypes, eventTouch: EventTouch, touchSource: InputSources): void {
        if (this.isLockedMultiTouch && this.currentTouchID !== null && this.currentTouchID !== eventTouch.getID()) return;

        if (type === InputTypes.Up) {
            this.currentTouchID = null;
        }

        if (type === InputTypes.Down) {
            this.currentTouchID = eventTouch.getID();
        }

        this.emit(InputTypes.None.toString(), { type, eventTouch, touchSource });
        this.emit(type.toString(), { type, eventTouch, touchSource });
    }

    //#endregion
}
