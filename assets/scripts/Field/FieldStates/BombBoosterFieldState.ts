import { ITile } from "../../Tiles/ITile";
import { BombFieldState } from "./BombFieldState";
import { FieldState } from "./FieldState";

export class BombBoosterFieldState extends FieldState {
    public async interact(tile: ITile): Promise<void> {
        this.field.changeState(new BombFieldState(this.field));
        this.field.boosterManager.spendBooster();
        this.field.interact(tile);
    }
}
