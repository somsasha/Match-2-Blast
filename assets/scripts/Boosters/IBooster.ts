import { ISender } from "../Mediators/ISender";

export interface IBooster extends ISender {
    count: number;
    
    tap(): void;
    setBoosterActive(isActive: boolean): void;
}
