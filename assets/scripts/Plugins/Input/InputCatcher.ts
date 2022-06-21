import { Component, Enum, _decorator } from "cc";

import InputSources from "./InputSources";
import InputTypes from "./InputTypes";
import Events from "../../Enums/Events";
import { GlobalEvent } from "../GlobalEvent";


const { ccclass, property, menu } = _decorator;

@ccclass
@menu('Input/Catcher')
export default class InputCather extends Component {
    @property({ type: Enum(InputSources) }) inputSource = InputSources.Default;

    onEnable(): void {
        this.toggleSubscribe(true);
    };

    onDisable(): void {
        this.toggleSubscribe(false);
    }

    private toggleSubscribe(isOn: boolean): void {
        const type: string = isOn ? 'on' : 'off';

        this.node[type]('touch-start', this.onDown, this);
        this.node[type]('touch-move', this.onMove, this);
        this.node[type]('touch-end', this.onUp, this);
        this.node[type]('touch-cancel', this.onUp, this);
    }

    private onDown(eventTouch): void {
        GlobalEvent.getInstance().emit(Events.INPUT.toString(), InputTypes.Down, eventTouch, this.inputSource);
    }

    private onMove(eventTouch): void {
        GlobalEvent.getInstance().emit(Events.INPUT.toString(), InputTypes.Move, eventTouch, this.inputSource);
    }

    private onUp(eventTouch): void {
        GlobalEvent.getInstance().emit(Events.INPUT.toString(), InputTypes.Up, eventTouch, this.inputSource);
    }
}