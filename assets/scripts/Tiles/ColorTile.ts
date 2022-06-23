import { _decorator, Vec2, SpriteFrame } from 'cc';
import TileColors from '../Enums/TileColors';
import { Tile } from './Tile';
const { ccclass, property } = _decorator;

@ccclass('ColorTile')
export class ColorTile extends Tile {
    public color: TileColors = TileColors.Red;

    public init(position: Vec2, color: TileColors, sprite: SpriteFrame): void {
        this.position = position;
        this.color = color;
        this.viewer.setSprite(sprite);
    }

    public tap(): void {

    }

    public remove(): void {
        this.node.destroy();
    }
}
