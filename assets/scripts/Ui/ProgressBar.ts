import { _decorator, Component, Node, Tween, CCFloat, math, easing } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ProgressBar')
export class ProgressBar extends Component {
    @property(CCFloat) speed: number = 100;
    @property(CCFloat) startX: number = 0;
    @property(Node) line: Node = null;
    
    private tween: Tween<Node> = null;

    public setProgress(progress: number): void {
        if (progress > 1) {
            progress = 1;
        } else if (progress < 0) {
            progress = 0;
        }

        if (this.tween) {
            this.tween.stop();
        }

        const endPositionX = this.startX + Math.abs(this.startX) * progress;
        const endPosition = math.v3(endPositionX, this.line.position.y, 1);
        const duration = (endPositionX - this.line.position.x) / this.speed;
        this.tween = new Tween<Node>(this.line).to(duration, {position: endPosition}, {easing: easing.cubicOut}).start();
    }
}

