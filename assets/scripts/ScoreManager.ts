import { _decorator, Component, Label, CCFloat } from 'cc';
import Events from './Plugins/Enums/Events';
import { GlobalEvent } from './Plugins/GlobalEvent';
import { ProgressBar } from './Ui/ProgressBar';
const { ccclass, property } = _decorator;

@ccclass('ScoreManager')
export class ScoreManager extends Component {
    @property(CCFloat) pointsByTile: number = 10;
    @property(CCFloat) pointsMultiplierByTile: number = 1.15;

    @property(Label) pointsRenderer: Label = null;
    @property(Label) turnsRenderer: Label = null;
    @property(ProgressBar) progressBar: ProgressBar = null

    private pointsToWin: number = 1000;

    private currentPoints: number = 0;
    private currentTurns: number = 0;

    init(pointsToWin: number, turnsCount: number): void {
        this.pointsToWin = pointsToWin;
        this.currentTurns = turnsCount;
        this.turnsRenderer.string = '' + this.currentTurns;

        this.subscribeEvents();
    }

    subscribeEvents(): void {
        GlobalEvent.getInstance().on(Events.PLAYER_SPENT_TURN, this.onPlayerSpentTurn, this);
        GlobalEvent.getInstance().on(Events.TILES_REMOVED, this.onTilesRemoved, this);
    }

    private onPlayerSpentTurn(): void {
        this.currentTurns -= 1;

        if (this.currentTurns <= 0) {
            this.currentTurns = 0;
            GlobalEvent.getInstance().emit(Events.RESULT, false);
        }

        this.turnsRenderer.string = '' + this.currentTurns;
    }

    private onTilesRemoved(tilesCount: number): void {
        const pointsMultiplier = tilesCount > 1 ? this.pointsMultiplierByTile * tilesCount : 1;
        const pointsEarned = this.pointsByTile * tilesCount * pointsMultiplier;
        
        this.currentPoints += Math.round(pointsEarned);
        this.pointsRenderer.string = '' + this.currentPoints;
        this.progressBar.setProgress(this.currentPoints / this.pointsToWin);

        if (this.currentPoints >= this.pointsToWin) {
            GlobalEvent.getInstance().emit(Events.RESULT, true);
        }
    }
}

