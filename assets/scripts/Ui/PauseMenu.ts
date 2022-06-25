import { _decorator, Component, Node, Tween, UIOpacity } from 'cc';
import Events from '../Plugins/Enums/Events';
import { GlobalEvent } from '../Plugins/GlobalEvent';
import InputManager from '../Plugins/Input/InputManager';
import { InputManagerData } from '../Plugins/Input/InputManagerData';
import InputSources from '../Plugins/Input/InputSources';
import InputTypes from '../Plugins/Input/InputTypes';
const { ccclass, property } = _decorator;

@ccclass('PauseMenu')
export class PauseMenu extends Component { 
    @property(Node) inputs: Node[] = [];
    
    private isActive: boolean = false;
    private isResult: boolean = false;

    onLoad(): void {
        GlobalEvent.getInstance().on(Events.RESULT, this.onResult, this);
        InputManager.getInstance().on(InputTypes.Down, this.onInput, this);
    }

    private show(): void {
        new Tween<UIOpacity>(this.node.getComponent(UIOpacity)).to(0.25, { opacity: 255 }).call(() => {
            for (let i = 0; i < this.inputs.length; i++) {
                this.inputs[i].active = true;
            }
        }).start();
    }

    private hide(): void {
        for (let i = 0; i < this.inputs.length; i++) {
            this.inputs[i].active = false;
        }

        new Tween<UIOpacity>(this.node.getComponent(UIOpacity)).to(0.25, { opacity: 0 }).start();
    }
    
    private onResult(): void {
        this.isResult = true;
    }

    private onInput(data: InputManagerData): void {
        if (this.isResult) return;

        if (!this.isActive && data.source === InputSources.Pause) {
            if (this.isActive) return;
            this.isActive = true;
            GlobalEvent.getInstance().emit(Events.PAUSE);
            this.show();
            return;
        }

        if (!this.isActive) return;

        if (data.source === InputSources.PauseResume) {
            this.isActive = false;
            GlobalEvent.getInstance().emit(Events.UNPAUSE);
            this.hide();
        } else if (data.source === InputSources.PauseRestart) {
            this.isActive = false;
            GlobalEvent.getInstance().emit(Events.RESTART_LEVEL);
        } else if (data.source === InputSources.PauseMainMenu) {
            this.isActive = false;
            GlobalEvent.getInstance().emit(Events.MAIN_MENU);
        }
    }
}

