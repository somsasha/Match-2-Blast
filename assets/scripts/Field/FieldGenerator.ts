import { _decorator, Component, UITransform, math, instantiate, Size, Vec2 } from 'cc';
import Utilities from '../Plugins/Utilities';
import { ColorTile } from '../Tiles/ColorTile';
import { ColorTileType } from '../Tiles/ColorTileType';
import { FieldGeneratorConfig } from './FieldGeneratorConfig';
import { FieldConverter } from './FieldConverter';
const { ccclass, property } = _decorator;

@ccclass('FieldGenerator')
export class FieldGenerator extends Component {
    private config: FieldGeneratorConfig = null;
    private fieldConverter: FieldConverter = null;

    private tileScale: number = 1;

    public init(config: FieldGeneratorConfig, fieldConverter: FieldConverter): void {
        this.config = config;
        this.fieldConverter = fieldConverter;
        this.tileScale = this.fieldConverter.tilesScale;
    }

    public createField(): ColorTile[] {
        const tiles: ColorTile[] = [];

        for (let y = 0; y < this.config.fieldSize.height; y++) {
            for (let x = 0; x < this.config.fieldSize.width; x++) {
                const colorTileType = this.config.tilesTypes[Utilities.getRandomInt(0, this.config.tilesTypes.length - 1)];
                tiles.push(this.spawnColorTile(math.v2(x, y), colorTileType));
            }
        }

        return tiles;
    }

    private spawnColorTile(position: Vec2, type: ColorTileType): ColorTile {
        const tileNode = instantiate(this.config.tilePrefab);
        tileNode.setParent(this.node);

        tileNode.setScale(math.v3(this.tileScale, this.tileScale));

        const spawnPos = this.fieldConverter.getRealPosition(position);
        tileNode.setPosition(spawnPos.x, spawnPos.y);

        const tile = tileNode.addComponent(ColorTile);
        tile.init(position, type.color, type.sprite);

        return tile;
    }
}

