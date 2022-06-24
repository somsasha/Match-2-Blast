import { _decorator, Enum, SpriteFrame, CCInteger } from 'cc';
import TileAbilities from './TileAbilities';
const { ccclass, property } = _decorator;

@ccclass('SuperTileType')
export class SuperTileType {
    @property({ type: Enum(TileAbilities) }) ability: TileAbilities = TileAbilities.Rocket;
    @property(CCInteger) tilesToMatch: number = 4;
    @property(SpriteFrame) sprite: SpriteFrame = null;
}

