import { _decorator, Size, math, Prefab } from 'cc';
import { ColorTileType } from '../Tiles/ColorTileType';
const { ccclass, property } = _decorator;

@ccclass('FieldGeneratorConfig')
export class FieldGeneratorConfig {
    @property(Size) fieldSize: Size = math.size(6, 6);
    @property(Prefab) tilePrefab: Prefab = null;
    @property(ColorTileType) tilesTypes: ColorTileType[] = [];
}

