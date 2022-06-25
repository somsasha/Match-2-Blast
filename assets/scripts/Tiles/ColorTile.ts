import { _decorator, SpriteFrame } from 'cc';
import TileColors from './TileColors';
import { Mediator } from '../Mediators/Mediator';
import { Tile } from './Tile';
const { ccclass, property } = _decorator;

@ccclass('ColorTile')
export class ColorTile extends Tile {
    public color: TileColors = TileColors.Red;

    public init(tilesManager: Mediator, color: TileColors, sprite: SpriteFrame): void {
        this.mediator = tilesManager;
        this.color = color;
        this.viewer.setSprite(sprite);
    }
}
