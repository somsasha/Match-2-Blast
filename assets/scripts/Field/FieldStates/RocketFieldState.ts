import { math } from "cc";
import Utilities from "../../Plugins/Utilities";
import { TileManager } from "../../Mediators/TileManager/TileManager";
import { ITile } from "../../Tiles/ITile";
import { FieldState } from "./FieldState";

export class RocketFieldState extends FieldState {
    private tileManager: TileManager = null;

    public async interact(tile: ITile, tileManager: TileManager): Promise<void> {
        this.tileManager = tileManager;

        const startTilePosition = this.tileManager.getTilePosition(tile);
        const isVertical = Utilities.getRandomFloat(0, 1) >= 0.5;
        const tilesToRemove = isVertical ? this.tileManager.getColumn(startTilePosition.x) : this.tileManager.getRow(startTilePosition.y);

        await this.field.removeTiles(tilesToRemove);
    }
}
