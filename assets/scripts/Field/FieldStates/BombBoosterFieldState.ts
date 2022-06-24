import { TileManager } from "../../Mediators/TileManager/TileManager";
import { ITile } from "../../Tiles/ITile";
import { BombFieldState } from "./BombFieldState";
import { FieldState } from "./FieldState";

export class BombBoosterFieldState extends FieldState {
    public async interact(tile: ITile, tileManager: TileManager): Promise<void> {
    }
}
