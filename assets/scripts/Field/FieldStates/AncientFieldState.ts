import { ITile } from "../../Tiles/ITile";
import { FieldState } from "./FieldState";
import { ReadyFieldState } from "./ReadyFieldState";

export class AncientFieldState extends FieldState {
    public async interact(tile: ITile): Promise<void> {
        await this.field.removeTiles(this.field.tileManager.getAll());

        this.field.changeState(new ReadyFieldState(this.field));
    }
}
