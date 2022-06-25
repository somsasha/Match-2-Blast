import { _decorator, Component, Label } from 'cc';
import { AncientBooster } from './Boosters/AncientBooster';
import { BombBooster } from './Boosters/BombBooster';
import { TeleportBooster } from './Boosters/TeleportBooster';
import { Field } from './Field/Field';
import { LevelConfig } from './LevelConfig';
import { BoosterManager } from './Mediators/BoosterManager/BoosterManager';
import { TileManager } from './Mediators/TileManager/TileManager';
import Events from './Plugins/Enums/Events';
import { GlobalEvent } from './Plugins/GlobalEvent';
import { ScoreManager } from './ScoreManager';
const { ccclass, property } = _decorator;

@ccclass('LevelManager')
export class LevelManager extends Component {
    @property(Field) field: Field = null;
    @property(ScoreManager) scoreManager: ScoreManager = null;

    @property(TeleportBooster) teleportBooster: TeleportBooster = null;
    @property(BombBooster) bombBooster: BombBooster = null;
    @property(AncientBooster) ancientBooster: AncientBooster = null;

    @property(Label) levelNumber: Label = null;

    private boosterManager: BoosterManager = null;

    onLoad(): void {
        GlobalEvent.getInstance().on(Events.START_LEVEL, this.initLevel, this);
        GlobalEvent.getInstance().on(Events.RESULT, this.onResult, this);
        GlobalEvent.getInstance().on(Events.PAUSE, this.onPause, this);
        GlobalEvent.getInstance().on(Events.UNPAUSE, this.onUnpause, this);
    }
    
    private initLevel(levelNumber: number, config: LevelConfig): void {
        this.levelNumber.string = '' + levelNumber;
        this.scoreManager.init(config.pointsToWin, config.turnsCount);
        const tileManager = new TileManager(config.fieldConfig.fieldSize, this.field);
        this.boosterManager = new BoosterManager(this.field);
        this.teleportBooster.init(this.boosterManager, config.boostersConfig.teleportBoostersCount);
        this.bombBooster.init(this.boosterManager, config.boostersConfig.bombBoostersCount);
        this.ancientBooster.init(this.boosterManager, config.boostersConfig.ancientBoostersCount);
        this.field.init(config.fieldConfig, tileManager, this.boosterManager);
    }

    private onResult(): void {
        this.field.disable();
        this.boosterManager.disable();
    }

    private onPause(): void {
        this.field.disable();
        this.boosterManager.disable();
    }

    private onUnpause(): void {
        this.field.enable();
        this.boosterManager.enable();
    }
}

