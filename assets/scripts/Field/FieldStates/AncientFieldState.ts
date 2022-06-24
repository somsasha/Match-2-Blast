import { math } from "cc";
import Utilities from "../../Plugins/Utilities";
import { TileManager } from "../../Mediators/TileManager/TileManager";
import { ITile } from "../../Tiles/ITile";
import { FieldState } from "./FieldState";

export class AncientFieldState extends FieldState {
    private tileManager: TileManager = null;

    public async interact(tile: ITile, tileManager: TileManager): Promise<void> {
        this.tileManager = tileManager;

        await this.field.removeTiles(this.tileManager.getAll());
    }
}
