import Utilities from "../../Plugins/Utilities";
import { ITile } from "../../Tiles/ITile";
import { FieldState } from "./FieldState";
import { ReadyFieldState } from "./ReadyFieldState";

export class RocketFieldState extends FieldState {
    public async interact(tile: ITile): Promise<void> {
        const startTilePosition = this.field.tileManager.getTilePosition(tile);
        const isVertical = Utilities.getRandomFloat(0, 1) >= 0.5;
        const tilesToRemove = isVertical ? this.field.tileManager.getColumn(startTilePosition.x) : this.field.tileManager.getRow(startTilePosition.y);

        await this.field.removeTiles(tilesToRemove);

        this.field.changeState(new ReadyFieldState(this.field));
    }
}
