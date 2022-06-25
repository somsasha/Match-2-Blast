import { EventTarget } from 'cc';
import Events from './Enums/Events';

export class GlobalEvent extends EventTarget {
    private static instance: GlobalEvent = null;

    private constructor() {
        super();
    }

    public on<T extends Function>(key: number | string | Events, callback: T, target?: any, useCapture?: boolean): T {
        return super.on<any>('' + key, callback, target, useCapture);
    }

    public off<T extends Function>(key: number | string | Events, callback: T, target?: any, useCapture?: boolean): void {
        super.off<any>('' + key, callback, target);
    }

    public static getInstance(): GlobalEvent {
        if (this.instance === null) {
            this.instance = new GlobalEvent();
        }

        return this.instance;
    }
}

