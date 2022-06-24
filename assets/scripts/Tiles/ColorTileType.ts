import { _decorator, Enum, SpriteFrame } from 'cc';
import TileColors from './TileColors';
const { ccclass, property } = _decorator;

@ccclass('ColorTileType')
export class ColorTileType {
    @property({ type: Enum(TileColors) }) color: TileColors = TileColors.Red;
    @property(SpriteFrame) sprite: SpriteFrame = null;
}

