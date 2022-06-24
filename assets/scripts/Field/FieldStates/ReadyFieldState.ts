import { TileManager } from "../../Mediators/TileManager/TileManager";
import { ITile } from "../../Tiles/ITile";
import { FieldState } from "./FieldState";

export class ReadyFieldState extends FieldState {
    public async interact(tile: ITile, tileManager: TileManager): Promise<void> {
    }
}
