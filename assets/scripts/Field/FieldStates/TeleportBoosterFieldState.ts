import { ITile } from "../../Tiles/ITile";
import { FieldState } from "./FieldState";
import { ReadyFieldState } from "./ReadyFieldState";

export class TeleportBoosterFieldState extends FieldState {
    private tiles: ITile[] = [];
    public async interact(tile: ITile): Promise<void> {
        this.tiles.push(tile);

        if (this.tiles.length === 2) {
            await this.field.swapTiles(this.tiles[0], this.tiles[1]);
            this.field.boosterManager.spendBooster();
            this.field.changeState(new ReadyFieldState(this.field));
        }
    }
}
