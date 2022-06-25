import { ITile } from "../../Tiles/ITile";
import { SuperTile } from "../../Tiles/SuperTile";
import TileAbilities from "../../Tiles/TileAbilities";
import { AncientFieldState } from "./AncientFieldState";
import { BombFieldState } from "./BombFieldState";
import { ColorTileFieldState } from "./ColorTileFieldState";
import { FieldState } from "./FieldState";
import { RocketFieldState } from "./RocketFieldState";

export class ReadyFieldState extends FieldState {
    public async interact(tile: ITile): Promise<void> {
        let newState = null;

        if (tile instanceof SuperTile) {
            if (tile.ability === TileAbilities.Ancient) {
                newState = new AncientFieldState(this.field);
            } else if (tile.ability === TileAbilities.Bomb) {
                newState = new BombFieldState(this.field);
            } else {
                newState = new RocketFieldState(this.field);
            }
        } else {
            newState = new ColorTileFieldState(this.field);
        }

        this.field.changeState(newState);
        this.field.interact(tile);
    }
}
