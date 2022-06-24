import { Vec2 } from "cc";
import Easings from "../Enums/Easings";
import { ISender } from "../Mediators/ISender";

export interface ITile extends ISender {
    fall(position: Vec2, duration: number, easing: Easings): void;
    teleport(position: Vec2): void;
    tap(): void;
    remove(): void;
    runSpawnAnimation(): void;
}

