import Events from "../../Plugins/Enums/Events";
import { GlobalEvent } from "../../Plugins/GlobalEvent";
import { ITile } from "../../Tiles/ITile";
import { FieldState } from "./FieldState";
import { ReadyFieldState } from "./ReadyFieldState";

export class TeleportBoosterFieldState extends FieldState {
    private tiles: ITile[] = [];
    public async interact(tile: ITile): Promise<void> {
        if (this.tiles.indexOf(tile) === -1) {
            this.tiles.push(tile);
        }
        
        if (this.tiles.length === 2) {
            GlobalEvent.getInstance().emit(Events.PLAYER_SPENT_TURN);

            await this.field.swapTiles(this.tiles[0], this.tiles[1]);
            this.field.boosterManager.spendBooster();
            this.field.changeState(new ReadyFieldState(this.field));
        }
    }
}
