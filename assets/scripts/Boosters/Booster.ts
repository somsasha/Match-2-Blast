import { _decorator, Component, Enum } from 'cc';
import BoosterManagerEvents from '../Mediators/BoosterManager/BoosterManagerEvents';
import { Mediator } from '../Mediators/Mediator';
import InputManager from '../Plugins/Input/InputManager';
import { InputManagerData } from '../Plugins/Input/InputManagerData';
import InputSources from '../Plugins/Input/InputSources';
import InputTypes from '../Plugins/Input/InputTypes';
import { BoosterViewer } from './BoosterViewer';
import { IBooster } from './IBooster';
const { ccclass, property } = _decorator;

@ccclass('Booster')
export abstract class Booster extends Component implements IBooster {
    @property({type: Enum(InputSources)}) inputSource: InputSources = InputSources.Bonus1;

    public mediator: Mediator;
    protected boostersLeft: number = 0;
    get count(): number { return this.boostersLeft };
    set count(value: number) { this.boostersLeft = value; this.viewer.setCount(value) }

    protected viewer: BoosterViewer = null;

    onLoad(): void {
        this.viewer = this.node.getComponent(BoosterViewer);

        InputManager.getInstance().on(InputTypes.Down, this.onInput, this);
    }

    public tap(): void {
        this.mediator.notify(this, BoosterManagerEvents.Tap);
    }

    public setBoosterActive(isActive: boolean): void {
        this.viewer.setBoosterActive(isActive);
    }

    private onInput(data: InputManagerData): void {
        if (data.source !== this.inputSource) return;
        this.tap();
    }
}
