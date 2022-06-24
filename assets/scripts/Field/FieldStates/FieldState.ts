import { TileManager } from "../../Mediators/TileManager/TileManager";
import { ITile } from "../../Tiles/ITile";
import { Field } from "../Field";

export abstract class FieldState {
    protected field: Field = null;

    constructor(field: Field) {
        this.field = field;
    }

    public abstract interact(tile: ITile, tileManager: TileManager): void;
}
