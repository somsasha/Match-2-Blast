import { _decorator, Size, math, Prefab } from 'cc';
import { ColorTileType } from '../Tiles/ColorTileType';
import { SuperTileType } from '../Tiles/SuperTileType';
const { ccclass, property } = _decorator;

@ccclass('FieldGeneratorConfig')
export class FieldGeneratorConfig {
    @property(Prefab) tilePrefab: Prefab = null;
    @property(ColorTileType) colorTilesTypes: ColorTileType[] = [];
    @property(SuperTileType) abilityTilesTypes: SuperTileType[] = [];
}

