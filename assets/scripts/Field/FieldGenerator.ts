import { _decorator, Component, Node, math, instantiate, Size, Vec2, UITransform } from 'cc';
import Utilities from '../Plugins/Utilities';
import { ColorTile } from '../Tiles/ColorTile';
import { FieldGeneratorConfig } from './FieldGeneratorConfig';
import { FieldConverter } from './FieldConverter';
import { TileManager } from '../Mediators/TileManager/TileManager';
import TileAbilities from '../Tiles/TileAbilities';
import { SuperTile } from '../Tiles/SuperTile';
import { ITile } from '../Tiles/ITile';
const { ccclass, property } = _decorator;

@ccclass('FieldGenerator')
export class FieldGenerator extends Component {
    private config: FieldGeneratorConfig = null;
    private fieldConverter: FieldConverter = null;
    private tilesManager: TileManager = null;

    private tileScale: number = 1;

    public init(config: FieldGeneratorConfig, fieldConverter: FieldConverter, tilesManager: TileManager): void {
        this.config = config;
        this.fieldConverter = fieldConverter;
        this.tilesManager = tilesManager;
        this.tileScale = this.fieldConverter.TILE_SCALE;
    }

    public createField(): void {
        for (let y = 0; y < this.fieldConverter.FIELD_SIZE.height; y++) {
            for (let x = 0; x < this.fieldConverter.FIELD_SIZE.width; x++) {
                const position = math.v2(x, y);
                this.tilesManager.addTile(this.spawnColorTile(position), position);
            }
        }
    }

    public spawnColorTile(position: Vec2): ColorTile {
        const type = this.config.colorTilesTypes[Utilities.getRandomInt(0, this.config.colorTilesTypes.length - 1)];

        const tileNode = this.createTileNode(position);

        const tile = tileNode.addComponent(ColorTile);
        tile.init(this.tilesManager, type.color, type.sprite);
        this.runSpawnAnimation(position, tile);

        return tile;
    }

    public spawnSuperTile(position: Vec2, abilityType: TileAbilities): SuperTile {
        const type = this.config.abilityTilesTypes.find((type) => {return type.ability === abilityType});

        const tileNode = this.createTileNode(position);

        const tile = tileNode.addComponent(SuperTile);
        tile.init(this.tilesManager, type.ability, type.sprite);
        this.runSpawnAnimation(position, tile);

        return tile;
    }

    private runSpawnAnimation(position: Vec2, tile: ITile): void {
        if (position.y >= 0) {
            tile.runSpawnAnimation();
        }
    }

    private createTileNode(position: Vec2): Node {
        const tileNode = instantiate(this.config.tilePrefab);
        tileNode.setParent(this.node);

        tileNode.setScale(math.v3(this.tileScale, this.tileScale));

        const spawnPos = this.fieldConverter.getRealPosition(position);
        tileNode.setPosition(spawnPos.x, spawnPos.y);

        return tileNode;
    }
}

