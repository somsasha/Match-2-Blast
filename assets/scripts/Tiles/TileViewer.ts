import { _decorator, Component, Sprite, SpriteFrame, Vec2, Tween, Node, math, easing, Animation } from 'cc';
import Easings from '../Plugins/Enums/Easings';
const { ccclass, property } = _decorator;

@ccclass('TileViewer')
export class TileViewer extends Component {
    @property(Sprite) renderer: Sprite = null;
    @property(Animation) animation: Animation = null;

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

    public setPosition(newPosition: Vec2): void {
        this.node.setPosition(math.v3(newPosition.x, newPosition.y));
    }

    public remove(): void {
        this.animation.play();

        this.scheduleOnce((): void => {
            this.node.destroy();
        }, this.animation.defaultClip.duration * this.animation.defaultClip.speed);
    }

    public runSpawnAnimation(): void {
        this.animation.play('tile_spawn');
    }
}
