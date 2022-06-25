import { _decorator, Component } from 'cc';
import Events from '../Plugins/Enums/Events';
import { GlobalEvent } from '../Plugins/GlobalEvent';
import InputManager from '../Plugins/Input/InputManager';
import { InputManagerData } from '../Plugins/Input/InputManagerData';
import InputSources from '../Plugins/Input/InputSources';
import InputTypes from '../Plugins/Input/InputTypes';
const { ccclass, property } = _decorator;

@ccclass('MainMenu')
export class Result extends Component { 
    private isActive: boolean = true;

    onLoad(): void {
        InputManager.getInstance().on(InputTypes.Down, this.onInput, this);
    }

    private onInput(data: InputManagerData): void {
        if (!this.isActive) return;

        if (data.source === InputSources.NewGame) {
            this.isActive = false;
            GlobalEvent.getInstance().emit(Events.NEW_GAME);
        } else if (data.source === InputSources.ResumeGame) {
            this.isActive = false;
            GlobalEvent.getInstance().emit(Events.RESUME_GAME);
        }
    }
}

