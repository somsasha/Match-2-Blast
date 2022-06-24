import { _decorator } from 'cc';
import { BoosterManager } from '../Mediators/BoosterManager/BoosterManager';
import { Booster } from './Booster';
const { ccclass, property } = _decorator;

@ccclass('BombBooster')
export class BombBooster extends Booster {
    public init(boosterManager: BoosterManager, count: number): void {
        this.mediator = boosterManager;
        this.count = count;
    }
}
