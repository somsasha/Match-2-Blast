import { _decorator, SpriteFrame } from 'cc';
import { Mediator } from '../Mediators/Mediator';
import { Tile } from './Tile';
import TileAbilities from './TileAbilities';
const { ccclass, property } = _decorator;

@ccclass('SuperTile')
export class SuperTile extends Tile {
    public ability: TileAbilities = TileAbilities.Rocket;

    public init(tilesManager: Mediator, ability: TileAbilities, sprite: SpriteFrame): void {
        this.mediator = tilesManager;
        this.ability = ability;
        this.viewer.setSprite(sprite);
    }
}
