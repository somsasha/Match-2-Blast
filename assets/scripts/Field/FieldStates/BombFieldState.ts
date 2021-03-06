import { math } from "cc";
import Events from "../../Plugins/Enums/Events";
import { GlobalEvent } from "../../Plugins/GlobalEvent";
import { ITile } from "../../Tiles/ITile";
import { FieldState } from "./FieldState";
import { ReadyFieldState } from "./ReadyFieldState";

export class BombFieldState extends FieldState {
    public async interact(tile: ITile): Promise<void> {
        GlobalEvent.getInstance().emit(Events.PLAYER_SPENT_TURN);
        
        const startTilePosition = this.field.tileManager.getTilePosition(tile);
        let tilesToRemove: ITile[] = [];

        for (let y = startTilePosition.y - this.field.config.bombRadius; y <= startTilePosition.y + this.field.config.bombRadius; y++) {
            for (let x = startTilePosition.x - this.field.config.bombRadius; x <= startTilePosition.x + this.field.config.bombRadius; x++) {
                const nextTile = this.field.tileManager.getTileByPosition(math.v2(x, y));

                if (nextTile) {
                    tilesToRemove.push(nextTile);
                }
            }
        }

        await this.field.removeTiles(tilesToRemove);

        this.field.changeState(new ReadyFieldState(this.field));
    }
}
