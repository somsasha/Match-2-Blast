import { Vec2 } from "cc";
import Easings from "../Enums/Easings";

export interface ITile {
    position: Vec2;

    fall(position: Vec2, realPosition: Vec2, duration: number, easing: Easings): void;

    tap(): void;
    remove(): void;
}

