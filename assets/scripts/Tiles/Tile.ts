import { _decorator, Component, Vec2 } from 'cc';
import Easings from '../Enums/Easings';
import { Mediator } from '../Mediators/Mediator';
import TileManagerEvents from '../Mediators/TileManager/TileManagerEvents';
import { ITile } from './ITile';
import { TileViewer } from './TileViewer';
const { ccclass, property } = _decorator;

@ccclass('Tile')
export abstract class Tile extends Component implements ITile {
    public mediator: Mediator;

    protected viewer: TileViewer = null;

    onLoad(): void {
        this.viewer = this.node.getComponent(TileViewer);
    }

    public fall(position: Vec2, duration: number, easing: Easings): void {
        this.viewer.moveTo(position, duration, easing);
    }

    public remove(): void {
        this.mediator.notify(this, TileManagerEvents.Remove);
        this.viewer.remove();
    }

    public tap(): void {
        this.mediator.notify(this, TileManagerEvents.Tap);
    }

    public teleport(position: Vec2): void {
        this.viewer.setPosition(position);
    }

    public runSpawnAnimation(): void {
        this.viewer.runSpawnAnimation();
    }
}
