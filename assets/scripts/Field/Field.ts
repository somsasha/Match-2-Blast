import { _decorator, Component, Enum, CCInteger, CCFloat, math, UITransform, Vec2, Size } from 'cc';
import Easings from '../Enums/Easings';
import { ITile } from '../Tiles/ITile';
import { FieldGenerator } from './FieldGenerator';
import { FieldGeneratorConfig } from './FieldGeneratorConfig';
import { FieldConverter } from './FieldConverter';
import { TileManager } from '../Mediators/TileManager/TileManager';
import { FieldInput } from './FieldInput';
import { FieldState } from './FieldStates/FieldState';
import { ColorTileFieldState } from './FieldStates/ColorTileFieldState';
import { ColorTile } from '../Tiles/ColorTile';
import { SuperTile } from '../Tiles/SuperTile';
import { BombBoosterFieldState } from './FieldStates/BombBoosterFieldState';
import { BombBooster } from '../Boosters/BombBooster';
import { BoosterManager } from '../Mediators/BoosterManager/BoosterManager';
import { BombFieldState } from './FieldStates/BombFieldState';
import TileAbilities from '../Tiles/TileAbilities';
import { AncientFieldState } from './FieldStates/AncientFieldState';
import { RocketFieldState } from './FieldStates/RocketFieldState';
import { IBooster } from '../Boosters/IBooster';
import { AncientBooster } from '../Boosters/AncientBooster';
import { AncientBoosterFieldState } from './FieldStates/AncientBoosterFieldState';
import { TeleportBoosterFieldState } from './FieldStates/TeleportBoosterFieldState';
import { TeleportBooster } from '../Boosters/TeleportBooster';
import { ReadyFieldState } from './FieldStates/ReadyFieldState';
const { ccclass, property } = _decorator;

@ccclass('Field')
export class Field extends Component {
    @property(Size) fieldSize: Size = math.size(10, 10);

    @property(CCInteger) tilesToMatch: number = 2;
    @property(CCFloat) tileFallTimeByCell: number = 0.5;
    @property(CCFloat) tileMaxFallTime: number = 1;
    @property({ type: Enum(Easings) }) tileFallEasing: Easings = Easings.bounceOut;

    @property(CCInteger) remixCount: number = 2;

    @property(FieldGeneratorConfig) fieldGeneratorConfig: FieldGeneratorConfig = null;
    @property(CCInteger) bombRadius: number = 2;

    @property(TeleportBooster) booster1: TeleportBooster = null;
    @property(BombBooster) booster2: BombBooster = null;
    @property(AncientBooster) booster3: AncientBooster = null;

    private fieldConverter: FieldConverter = null;
    private fieldGenerator: FieldGenerator = null;
    private tileManager: TileManager = null;
    private boosterManager: BoosterManager = null;
    private fieldInput: FieldInput = null;

    private currentRemixes: number = 0;

    private state: FieldState = null;

    onLoad() {
        this.state = new ReadyFieldState(this);

        const uiTransform = this.node.getComponent(UITransform);
        const tileSize = this.fieldGeneratorConfig.tilePrefab.data.getComponent(UITransform).contentSize;

        this.fieldConverter = new FieldConverter(this.fieldSize, uiTransform, tileSize);
        this.tileManager = new TileManager(this.fieldSize, this);
        this.fieldGenerator = this.node.addComponent(FieldGenerator);
        this.fieldGenerator.init(this.fieldGeneratorConfig, this.fieldConverter, this.tileManager);
        
        this.fieldGenerator.createField();

        // #TODO
        this.boosterManager = new BoosterManager(this, [this.booster1, this.booster2, this.booster3]);
        this.booster1.init(this.boosterManager, 3);
        this.booster2.init(this.boosterManager, 2);
        this.booster3.init(this.boosterManager, 1);
        
        this.fieldInput = new FieldInput(this.fieldConverter, this.tileManager);
    }

    public changeState(state: FieldState): void {
        if (this.state instanceof ReadyFieldState || state instanceof ReadyFieldState) {
            this.state = state;

            if (this.state instanceof ReadyFieldState) {
                this.boosterManager.unselectBoosters();
            }
        } else if (this.state instanceof BombBoosterFieldState && state instanceof BombFieldState
            || this.state instanceof AncientBoosterFieldState && state instanceof AncientFieldState) {
            this.state = state;
        }
    }

    public async interact(tile: ITile): Promise<void> {
        if (this.state instanceof ReadyFieldState) return;

        await this.state.interact(tile, this.tileManager);
        await this.updateField();

        if (await this.checkFail()) {
            console.log('LOSE')
        } else {
            if (!(this.state instanceof TeleportBoosterFieldState)) {
                this.changeState(new ReadyFieldState(this));
            }
        }
    }

    public selectTile(tile: ITile): void {
        let newState = null;

        if (this.state instanceof BombBoosterFieldState) {
            newState = new BombFieldState(this);
            this.boosterManager.spendBooster();
        } else if (this.state instanceof AncientBoosterFieldState) {
            newState = new AncientFieldState(this);
            this.boosterManager.spendBooster();
        } else if (this.state instanceof TeleportBoosterFieldState) {
            newState = this.state;
        } else if (tile instanceof SuperTile) {
            if (tile.ability === TileAbilities.Ancient) {
                newState = new AncientFieldState(this);
            } else if (tile.ability === TileAbilities.Bomb) {
                newState = new BombFieldState(this);
            } else {
                newState = new RocketFieldState(this);
            }
        } else {
            newState = new ColorTileFieldState(this);
        }

        this.changeState(newState);
        this.interact(tile);
    }

    public selectBooster(booster: IBooster): void {
        let newState = null;

        if (booster instanceof BombBooster) {
            newState = new BombBoosterFieldState(this);
        } else if (booster instanceof AncientBooster) {
            newState = new AncientBoosterFieldState(this);
        } else if (booster instanceof TeleportBooster) {
            newState = new TeleportBoosterFieldState(this);
        } else {
            newState = new ReadyFieldState(this);
        }

        this.changeState(newState);

        if (this.state instanceof ReadyFieldState) {
            this.boosterManager.unselectBoosters();
        }
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

    public async removeTiles(tiles: ITile[]): Promise<void> {
        for (let i = 0; i < tiles.length; i++) {
            tiles[i].remove();
        }

        return new Promise((resolve, reject) => this.scheduleOnce(resolve, 0.5));
    }

    public async swapTiles(firstTile: ITile, secondTile: ITile): Promise<void> {
        const firstPosition = this.fieldConverter.getRealPosition(this.tileManager.getTilePosition(firstTile));
        const secondPosition = this.fieldConverter.getRealPosition(this.tileManager.getTilePosition(secondTile));

        this.tileManager.swapTiles(firstTile, secondTile);

        firstTile.teleport(secondPosition);
        secondTile.teleport(firstPosition);
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
                if (this.getColorTileSiblings(tile, []).length >= this.tilesToMatch) {
                    return false;
                }
            }
        }

        if (this.currentRemixes < this.remixCount) {
            await this.remixField();

            if (!(await this.checkFail())) {
                return false;
            }
        }

        return true;
    }

    private async remixField(): Promise<void> {
        this.currentRemixes += 1;

        await this.removeTiles(this.tileManager.getAll());
        this.fieldGenerator.createField();
        return new Promise((resolve, reject) => this.scheduleOnce(resolve, 0.5));
    }

    private async updateField(): Promise<void> {
        let maxDelay = 0;

        for (let x = 0; x < this.fieldSize.width; x++) {
            let emptySpaces: number[] = [];
            for (let y = this.fieldSize.height - 1; y >= 0; y--) {
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

        return new Promise((resolve, reject) => this.scheduleOnce(resolve, maxDelay));
    }
}
