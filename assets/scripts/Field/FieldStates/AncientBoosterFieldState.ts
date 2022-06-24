import { TileManager } from "../../Mediators/TileManager/TileManager";
import { ITile } from "../../Tiles/ITile";
import { FieldState } from "./FieldState";

export class AncientBoosterFieldState extends FieldState {
    public async interact(tile: ITile, tileManager: TileManager): Promise<void> {
    }
}
