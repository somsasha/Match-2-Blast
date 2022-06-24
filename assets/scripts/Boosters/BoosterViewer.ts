import { _decorator, Component, Sprite, SpriteFrame, Vec2, Tween, Node, math, easing, Animation, Label } from 'cc';
import Easings from '../Enums/Easings';
const { ccclass, property } = _decorator;

@ccclass('BoosterViewer')
export class BoosterViewer extends Component {
    @property(Label) countText: Label = null;

    private tween: Tween<Node> = null;

    setCount(count: number): void {
        this.countText.string = '' + count;
    }

    public setBoosterActive(isActive: boolean): void {
        if (this.tween) {
            this.tween.stop();
        }

        this.tween = new Tween<Node>(this.node).to(0.25, { scale: (isActive ? math.v3(0.9, 0.9, 1) : math.v3(1, 1, 1)) }, { easing: easing.cubicInOut }).start();
    }
}
