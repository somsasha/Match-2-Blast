import { Component, View, _decorator } from "cc";

import Events from './Plugins/Enums/Events';
import Settings from "./Plugins/Settings";
import InputManager from './Plugins/Input/InputManager';
import { GlobalEvent } from "./Plugins/GlobalEvent";

const { ccclass, property } = _decorator;

@ccclass
export default class GameManager extends Component {
    private settings: Settings = new Settings();

    onLoad(): void {
        this.subscribeEvents();
        InputManager.getInstance();
    }

    start(): void {
        this.windowResized();
    }

    private subscribeEvents(): void {
        View.instance.on('design-resolution-changed', this.windowResized, this);
    }

    private windowResized(): void {
        this.settings.updateSettings();
        GlobalEvent.getInstance().emit(Events.WINDOW_RESIZED.toString(), this.settings);
    }
}
