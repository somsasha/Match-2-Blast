import { ITile } from "../../Tiles/ITile";
import { AncientFieldState } from "./AncientFieldState";
import { FieldState } from "./FieldState";

export class AncientBoosterFieldState extends FieldState {
    public async interact(tile: ITile): Promise<void> {
        this.field.changeState(new AncientFieldState(this.field));
        this.field.boosterManager.spendBooster();
        this.field.interact(tile);
    }
}
