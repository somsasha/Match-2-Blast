import { CCInteger, _decorator } from "cc";

const { ccclass, property } = _decorator;

@ccclass('BoostersConfig')
export class BoostersConfig {
    @property(CCInteger) teleportBoostersCount: number = 3;
    @property(CCInteger) bombBoostersCount: number = 2;
    @property(CCInteger) ancientBoostersCount: number = 1;
}

