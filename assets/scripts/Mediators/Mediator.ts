import { ISender } from "./ISender";

export interface Mediator {
    notify(sender: ISender, event: number | string);
}
