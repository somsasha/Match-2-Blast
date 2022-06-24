import { TileManager } from "../../Mediators/TileManager/TileManager";
import { ColorTile } from "../../Tiles/ColorTile";
import { ITile } from "../../Tiles/ITile";
import { FieldState } from "./FieldState";

export class ColorTileFieldState extends FieldState {
    private tileManager: TileManager = null;

    public async interact(tile: ITile, tileManager: TileManager): Promise<void> {
        this.tileManager = tileManager;

        const startTilePosition = this.tileManager.getTilePosition(tile);
        let tilesToRemove: ColorTile[] = [];

        if (tile instanceof ColorTile) {
            tilesToRemove.push(tile);
            tilesToRemove = this.field.getColorTileSiblings(tile, tilesToRemove);
        }

        const tilesCount = tilesToRemove.length;
        
        if (tilesCount < this.field.tilesToMatch) return;

        this.field.spawnSuperTile(startTilePosition, tilesCount);
        await this.field.removeTiles(tilesToRemove);
    }
}
