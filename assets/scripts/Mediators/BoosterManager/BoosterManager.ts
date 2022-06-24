import { Field } from "../../Field/Field";
import { BombFieldState } from "../../Field/FieldStates/BombFieldState";
import { IBooster } from "../../Boosters/IBooster";
import { Mediator } from "../Mediator";
import BoosterManagerEvents from "./BoosterManagerEvents";
import { BombBooster } from "../../Boosters/BombBooster";
import { Booster } from "../../Boosters/Booster";

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
                this.field.selectBooster(null);
            }

            if (booster === this.activeBooster) {
                this.activeBooster = null;
            } else if (booster.count > 0) {
                booster.setBoosterActive(true);
                this.activeBooster = booster;
                this.field.selectBooster(booster);
            }            
        }
    }

    public unselectBoosters(): void {
        for (let i = 0; i < this.boosters.length; i++) {
            this.boosters[i].setBoosterActive(false);
        }
    }

    public spendBooster(): void {
        if (this.activeBooster) {
            this.activeBooster.count = this.activeBooster.count - 1;
            this.activeBooster.setBoosterActive(false);
            this.activeBooster = null;
        }
    }
}
