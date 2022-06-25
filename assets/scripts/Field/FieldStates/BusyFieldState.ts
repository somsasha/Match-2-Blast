import { ITile } from "../../Tiles/ITile";
import { FieldState } from "./FieldState";

export class BusyFieldState extends FieldState {
    public async interact(tile: ITile): Promise<void> {
    }
}
