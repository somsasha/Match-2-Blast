import { EventTouch } from "cc";
import InputTypes from "./InputTypes";
import InputSources from "./InputSources";


export type InputManagerData = {
    touch: EventTouch,
    source: InputSources,
    type: InputTypes
};