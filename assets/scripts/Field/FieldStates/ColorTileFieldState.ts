import { ColorTile } from "../../Tiles/ColorTile";
import { ITile } from "../../Tiles/ITile";
import { FieldState } from "./FieldState";
import { ReadyFieldState } from "./ReadyFieldState";

export class ColorTileFieldState extends FieldState {
    public async interact(tile: ITile): Promise<void> {
        const startTilePosition = this.field.tileManager.getTilePosition(tile);
        let tilesToRemove: ColorTile[] = [];

        if (tile instanceof ColorTile) {
            tilesToRemove.push(tile);
            tilesToRemove = this.field.getColorTileSiblings(tile, tilesToRemove);
        }

        const tilesCount = tilesToRemove.length;
        
        if (tilesCount < this.field.tilesToMatch) return;

        this.field.spawnSuperTile(startTilePosition, tilesCount);
        await this.field.removeTiles(tilesToRemove);

        this.field.changeState(new ReadyFieldState(this.field));
    }
}
