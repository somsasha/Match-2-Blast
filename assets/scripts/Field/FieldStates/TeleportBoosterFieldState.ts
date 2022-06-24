import { TileManager } from "../../Mediators/TileManager/TileManager";
import { ITile } from "../../Tiles/ITile";
import { FieldState } from "./FieldState";
import { ReadyFieldState } from "./ReadyFieldState";

export class TeleportBoosterFieldState extends FieldState {
    private tiles: ITile[] = [];
    public async interact(tile: ITile, tileManager: TileManager): Promise<void> {
        this.tiles.push(tile);

        if (this.tiles.length === 2) {
            this.field.swapTiles(this.tiles[0], this.tiles[1]);
            // #TODO
            this.field.booster1.count -= 1;
            this.field.changeState(new ReadyFieldState(this.field));
        }
    }
}
