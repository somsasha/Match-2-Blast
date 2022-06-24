import { math } from "cc";
import Utilities from "../../Plugins/Utilities";
import { TileManager } from "../../Mediators/TileManager/TileManager";
import { ITile } from "../../Tiles/ITile";
import { FieldState } from "./FieldState";

export class BombFieldState extends FieldState {
    private tileManager: TileManager = null;

    public async interact(tile: ITile, tileManager: TileManager): Promise<void> {
        this.tileManager = tileManager;

        const startTilePosition = this.tileManager.getTilePosition(tile);
        let tilesToRemove: ITile[] = [];

        for (let y = startTilePosition.y - this.field.bombRadius; y <= startTilePosition.y + this.field.bombRadius; y++) {
            for (let x = startTilePosition.x - this.field.bombRadius; x <= startTilePosition.x + this.field.bombRadius; x++) {
                const nextTile = this.tileManager.getTileByPosition(math.v2(x, y));

                if (nextTile) {
                    tilesToRemove.push(nextTile);
                }
            }
        }

        await this.field.removeTiles(tilesToRemove);
    }
}
