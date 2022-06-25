import { CCInteger, _decorator } from 'cc';
import { BoostersConfig } from './Boosters/BoostersConfig';
import { FieldConfig } from './Field/FieldConfig';
const { ccclass, property } = _decorator;

@ccclass('LevelConfig')
export class LevelConfig {
    @property(CCInteger) pointsToWin: number = 1000;
    @property(CCInteger) turnsCount: number = 10;
    @property(FieldConfig) fieldConfig: FieldConfig = null;
    @property(BoostersConfig) boostersConfig: BoostersConfig = null;
}

