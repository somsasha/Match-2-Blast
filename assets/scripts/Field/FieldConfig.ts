import { _decorator, Size, math, CCInteger } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('FieldConfig')
export class FieldConfig {
    @property(Size) fieldSize: Size = math.size(10, 10);
    @property(CCInteger) tilesToMatch: number = 2;
    @property(CCInteger) remixCount: number = 2;
    @property(CCInteger) bombRadius: number = 2;
}

