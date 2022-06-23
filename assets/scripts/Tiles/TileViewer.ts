import { _decorator, Component, Sprite, SpriteFrame, Vec2, Tween, Node, math, easing } from 'cc';
import Easings from '../Enums/Easings';
const { ccclass, property } = _decorator;

@ccclass('TileViewer')
export class TileViewer extends Component {
    @property(Sprite) renderer: Sprite = null;

    private tween: Tween<Node> = null;

    public setSprite(sprite: SpriteFrame): void {
        this.renderer.spriteFrame = sprite;
    }

    public moveTo(newPosition: Vec2, duration: number, moveEasing: Easings): void {
        if (this.tween) {
            this.tween.stop();
        }

        this.tween = new Tween<Node>(this.node).to(duration, { position: math.v3(newPosition.x, newPosition.y) }, { easing: easing[Easings[moveEasing]] }).start();
    }
}
