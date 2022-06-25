import { Field } from "../../Field/Field";
import { IBooster } from "../../Boosters/IBooster";
import { Mediator } from "../Mediator";
import BoosterManagerEvents from "./BoosterManagerEvents";
import { BombBooster } from "../../Boosters/BombBooster";
import { AncientBooster } from "../../Boosters/AncientBooster";
import { AncientBoosterFieldState } from "../../Field/FieldStates/AncientBoosterFieldState";
import { BombBoosterFieldState } from "../../Field/FieldStates/BombBoosterFieldState";
import { TeleportBoosterFieldState } from "../../Field/FieldStates/TeleportBoosterFieldState";
import { FieldState } from "../../Field/FieldStates/FieldState";
import { ReadyFieldState } from "../../Field/FieldStates/ReadyFieldState";

export class BoosterManager implements Mediator {
    private field: Field = null;
    private boosters: IBooster[] = [];
    private activeBooster: IBooster = null;

    constructor(field: Field, boosters: IBooster[]) {
        this.field = field;
        this.boosters = boosters;
    }

    public notify(booster: IBooster, event: BoosterManagerEvents): void {
        if (event === BoosterManagerEvents.Tap) {
            if (this.activeBooster) {
                this.activeBooster.setBoosterActive(false);
                this.field.changeState(new ReadyFieldState(this.field));
            }

            if (this.activeBooster === booster) {
                this.activeBooster = null;
            } else if (booster.count > 0) {
                this.activeBooster = booster;
                this.activeBooster.setBoosterActive(true);
                this.field.changeState(this.getBoosterState(booster));
            }
        }
    }

    public spendBooster(): void {
        if (this.activeBooster) {
            this.activeBooster.count -= 1;
            this.unselectBooster();
        }
    }

    public unselectBooster(): void {
        if (this.activeBooster) {
            this.activeBooster.setBoosterActive(false);
            this.activeBooster = null;
        }
    }

    private getBoosterState(booster: IBooster): FieldState {
        if (booster instanceof BombBooster) {
            return new BombBoosterFieldState(this.field);
        } else if (booster instanceof AncientBooster) {
            return new AncientBoosterFieldState(this.field);
        } else {
            return new TeleportBoosterFieldState(this.field);
        }
    }
}
