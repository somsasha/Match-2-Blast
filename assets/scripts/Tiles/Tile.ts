import { _decorator, Component, Vec2, math } from 'cc';
import Easings from '../Enums/Easings';
import { ITile } from './ITile';
import { TileViewer } from './TileViewer';
const { ccclass, property } = _decorator;

@ccclass('Tile')
export abstract class Tile extends Component implements ITile {
    public position: Vec2 = math.v2();

    protected viewer: TileViewer = null;

    onLoad(): void {
        this.viewer = this.node.getComponent(TileViewer);
    }

    public fall(position: Vec2, realPosition: Vec2, duration: number, easing: Easings): void {
        this.position = position;
        this.viewer.moveTo(realPosition, duration, easing);
    }

    public abstract tap(): void;
    public abstract remove(): void;
}
