import Events from "../../Plugins/Enums/Events";
import { GlobalEvent } from "../../Plugins/GlobalEvent";
import { ITile } from "../../Tiles/ITile";
import { FieldState } from "./FieldState";
import { ReadyFieldState } from "./ReadyFieldState";

export class AncientFieldState extends FieldState {
    public async interact(tile: ITile): Promise<void> {
        GlobalEvent.getInstance().emit(Events.PLAYER_SPENT_TURN);
        
        await this.field.removeTiles(this.field.tileManager.getAll());
        this.field.changeState(new ReadyFieldState(this.field));
    }
}
