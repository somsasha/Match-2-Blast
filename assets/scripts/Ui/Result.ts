import { _decorator, Component, Node, Tween, UIOpacity, Label, CCString } from 'cc';
import Events from '../Plugins/Enums/Events';
import { GlobalEvent } from '../Plugins/GlobalEvent';
import InputManager from '../Plugins/Input/InputManager';
import { InputManagerData } from '../Plugins/Input/InputManagerData';
import InputSources from '../Plugins/Input/InputSources';
import InputTypes from '../Plugins/Input/InputTypes';
const { ccclass, property } = _decorator;

@ccclass('ResultConfig')
class ResultConfig {
    @property(CCString) text: string = '';
    @property(CCString) buttonText: string = '';
}

@ccclass('Result')
export class Result extends Component { 
    @property(ResultConfig) winConfig: ResultConfig = null;
    @property(ResultConfig) looseConfig: ResultConfig = null;
    @property(Label) text: Label = null;
    @property(Label) buttonText: Label = null;
    @property(Node) buttonInput: Node = null;
    
    private isActive: boolean = false;
    private isWin: boolean = false;

    onLoad(): void {
        GlobalEvent.getInstance().on(Events.RESULT, this.onResult, this);
        InputManager.getInstance().on(InputTypes.Down, this.onInput, this);
    }

    private onResult(isWin: boolean): void {
        if (this.isActive) return;
        this.isActive = true;
        this.isWin = isWin;

        const config = this.isWin ? this.winConfig : this.looseConfig;
        
        this.text.string = config.text;
        this.buttonText.string = config.buttonText;

        new Tween<UIOpacity>(this.node.getComponent(UIOpacity)).to(0.25, {opacity: 255}).call(() => {
            this.buttonInput.active = true;
        }).start();
    }

    private onInput(data: InputManagerData): void {
        if (!this.isActive || data.source !== InputSources.ResultButton) return;
        this.isActive = false;

        if (this.isWin) {
            GlobalEvent.getInstance().emit(Events.NEXT_LEVEL);
        } else {
            GlobalEvent.getInstance().emit(Events.RESTART_LEVEL);
        }
    }
}

