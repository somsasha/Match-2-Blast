import { _decorator, Component, Enum, CCFloat, math, UITransform, Vec2 } from 'cc';
import Easings from '../Plugins/Enums/Easings';
import { ITile } from '../Tiles/ITile';
import { FieldGenerator } from './FieldGenerator';
import { FieldGeneratorConfig } from './FieldGeneratorConfig';
import { FieldConverter } from './FieldConverter';
import { TileManager } from '../Mediators/TileManager/TileManager';
import { FieldInput } from './FieldInput';
import { FieldState } from './FieldStates/FieldState';
import { ColorTile } from '../Tiles/ColorTile';
import { SuperTile } from '../Tiles/SuperTile';
import { BoosterManager } from '../Mediators/BoosterManager/BoosterManager';
import { ReadyFieldState } from './FieldStates/ReadyFieldState';
import { BusyFieldState } from './FieldStates/BusyFieldState';
import { FieldConfig } from './FieldConfig';
import { GlobalEvent } from '../Plugins/GlobalEvent';
import Events from '../Plugins/Enums/Events';
const { ccclass, property } = _decorator;

@ccclass('Field')
export class Field extends Component {
    @property(CCFloat) tileFallTimeByCell: number = 0.5;
    @property(CCFloat) tileMaxFallTime: number = 1;
    @property({ type: Enum(Easings) }) tileFallEasing: Easings = Easings.bounceOut;

    @property(FieldGeneratorConfig) fieldGeneratorConfig: FieldGeneratorConfig = null;

    public config: FieldConfig = null;

    public boosterManager: BoosterManager = null;
    public tileManager: TileManager = null;

    private fieldConverter: FieldConverter = null;
    private fieldGenerator: FieldGenerator = null;
    private fieldInput: FieldInput = null;

    private currentRemixes: number = 0;

    private state: FieldState = new BusyFieldState(this);

    public init(fieldConfig: FieldConfig, tileManager: TileManager, boosterManager: BoosterManager): void {
        this.config = fieldConfig;
        this.tileManager = tileManager;
        this.boosterManager = boosterManager;

        const uiTransform = this.node.getComponent(UITransform);
        const tileSize = this.fieldGeneratorConfig.tilePrefab.data.getComponent(UITransform).contentSize;

        this.fieldConverter = new FieldConverter(this.config.fieldSize, uiTransform, tileSize);
        this.fieldGenerator = this.node.addComponent(FieldGenerator);
        this.fieldGenerator.init(this.fieldGeneratorConfig, this.fieldConverter, this.tileManager);

        this.fieldGenerator.createField();

        this.fieldInput = new FieldInput(this.fieldConverter, this.tileManager);

        this.state = new ReadyFieldState(this);
    }

    public changeState(state: FieldState): void {
        if (this.state instanceof BusyFieldState && !(state instanceof ReadyFieldState)) {
            this.boosterManager.unselectBooster();
            return;
        }

        this.state = state;
    }

    public async interact(tile: ITile): Promise<void> {
        if (this.state instanceof BusyFieldState) return;
        await this.state.interact(tile);
    }

    public spawnSuperTile(position: Vec2, tilesMatchCount: number): void {
        this.fieldGeneratorConfig.abilityTilesTypes.sort((a, b) => a.tilesToMatch - b.tilesToMatch);

        for (let i = this.fieldGeneratorConfig.abilityTilesTypes.length - 1; i >= 0; i--) {
            if (tilesMatchCount >= this.fieldGeneratorConfig.abilityTilesTypes[i].tilesToMatch) {
                const tile = this.fieldGenerator.spawnSuperTile(position, this.fieldGeneratorConfig.abilityTilesTypes[i].ability);
                this.tileManager.addTile(tile, position);
                return;
            }
        }
    }

    public async removeTiles(tiles: ITile[], isRecreate: boolean = false): Promise<void> {
        const previusState = this.state;
        this.changeState(new BusyFieldState(this));

        for (let i = 0; i < tiles.length; i++) {
            tiles[i].remove();
        }

        if (!isRecreate) {
            GlobalEvent.getInstance().emit(Events.TILES_REMOVED, tiles.length);
        }

        await new Promise((resolve, reject) => this.scheduleOnce(resolve, 0.5));
        await this.updateField();

        if (await this.checkFail()) {
            GlobalEvent.getInstance().emit(Events.RESULT, false);
        }

        this.changeState(new ReadyFieldState(this));
        this.changeState(previusState);
    }

    public async swapTiles(firstTile: ITile, secondTile: ITile): Promise<void> {
        const firstPosition = this.fieldConverter.getRealPosition(this.tileManager.getTilePosition(firstTile));
        const secondPosition = this.fieldConverter.getRealPosition(this.tileManager.getTilePosition(secondTile));

        this.tileManager.swapTiles(firstTile, secondTile);

        firstTile.teleport(secondPosition);
        secondTile.teleport(firstPosition);

        if (await this.checkFail()) {
            GlobalEvent.getInstance().emit(Events.RESULT, false);
        }
    }

    public getColorTileSiblings(tile: ColorTile, siblings: ColorTile[]): ColorTile[] {
        const tilePosition = this.tileManager.getTilePosition(tile);

        let nextTilePosition = tilePosition.clone().add2f(1, 0);
        let nextTile = this.tileManager.getTileByPosition(nextTilePosition);
        if (nextTile instanceof ColorTile && siblings.indexOf(nextTile) === -1 && this.isColorTilesSiblings(tile, nextTile)) {
            siblings.push(nextTile);
            siblings = this.getColorTileSiblings(nextTile, siblings);
        }

        nextTilePosition = tilePosition.clone().add2f(-1, 0);
        nextTile = this.tileManager.getTileByPosition(nextTilePosition);
        if (nextTile instanceof ColorTile && siblings.indexOf(nextTile) === -1 && this.isColorTilesSiblings(tile, nextTile)) {
            siblings.push(nextTile);
            siblings = this.getColorTileSiblings(nextTile, siblings);
        }

        nextTilePosition = tilePosition.clone().add2f(0, 1);
        nextTile = this.tileManager.getTileByPosition(nextTilePosition);
        if (nextTile instanceof ColorTile && siblings.indexOf(nextTile) === -1 && this.isColorTilesSiblings(tile, nextTile)) {
            siblings.push(nextTile);
            siblings = this.getColorTileSiblings(nextTile, siblings);
        }

        nextTilePosition = tilePosition.clone().add2f(0, -1);
        nextTile = this.tileManager.getTileByPosition(nextTilePosition);
        if (nextTile instanceof ColorTile && siblings.indexOf(nextTile) === -1 && this.isColorTilesSiblings(tile, nextTile)) {
            siblings.push(nextTile);
            siblings = this.getColorTileSiblings(nextTile, siblings);
        }

        return siblings;
    }

    public enable(): void {
        this.fieldInput.enable();
    }

    public disable(): void {
        this.fieldInput.disable();
    }

    private isColorTilesSiblings(firstTile: ColorTile, secondTile: ColorTile): boolean {
        if (firstTile.color === secondTile.color) {
            return true;
        }

        return false;
    }

    private async checkFail(): Promise<boolean> {
        const tiles = this.tileManager.getAll();

        for (let i = 0; i < tiles.length; i++) {
            const tile = tiles[i];

            if (tile instanceof SuperTile) {
                return false;
            } else if (tile instanceof ColorTile) {
                if (this.getColorTileSiblings(tile, []).length >= this.config.tilesToMatch) {
                    return false;
                }
            }
        }

        if (this.currentRemixes < this.config.remixCount) {
            await this.remixField();
            return false;
        }

        return true;
    }

    private async remixField(): Promise<void> {
        this.currentRemixes += 1;
        await this.removeTiles(this.tileManager.getAll(), true);
    }

    private async updateField(): Promise<void> {
        let maxDelay = 0;

        for (let x = 0; x < this.config.fieldSize.width; x++) {
            let emptySpaces: number[] = [];
            for (let y = this.config.fieldSize.height - 1; y >= 0; y--) {
                const tile = this.tileManager.getTileByPosition(math.v2(x, y));

                if (!tile) {
                    emptySpaces.push(y);
                    continue;
                }

                if (tile && emptySpaces.length > 0) {
                    const newPosition = math.v2(x, emptySpaces.shift());
                    const fallTime = Math.min((newPosition.y - y) * this.tileFallTimeByCell, this.tileMaxFallTime);
                    tile.fall(this.fieldConverter.getRealPosition(newPosition), fallTime, this.tileFallEasing);
                    this.tileManager.moveTile(tile, newPosition);
                    y += 1;

                    if (fallTime > maxDelay) {
                        maxDelay = fallTime;
                    }
                }
            }

            for (let i = 0; i < emptySpaces.length; i++) {
                const tile = this.fieldGenerator.spawnColorTile(math.v2(x, -i - 1));
                const newPosition = math.v2(x, emptySpaces[i]);
                const fallTime = Math.min((newPosition.y - (-i - 1)) * this.tileFallTimeByCell, this.tileMaxFallTime);
                tile.fall(this.fieldConverter.getRealPosition(newPosition), fallTime, this.tileFallEasing);
                this.tileManager.addTile(tile, newPosition);

                if (fallTime > maxDelay) {
                    maxDelay = fallTime;
                }
            }
        }

        await new Promise((resolve, reject) => this.scheduleOnce(resolve, maxDelay));
    }
}
