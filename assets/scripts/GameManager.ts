import { Component, director, game, View, _decorator } from "cc";

import Events from './Plugins/Enums/Events';
import Settings from "./Plugins/Settings";
import InputManager from './Plugins/Input/InputManager';
import { GlobalEvent } from "./Plugins/GlobalEvent";
import { LevelConfig } from "./LevelConfig";

const { ccclass, property } = _decorator;

@ccclass
export default class GameManager extends Component {
    @property(LevelConfig) levels: LevelConfig[] = [];

    public currentLevel: number = 0;

    private settings: Settings = new Settings();
    private inputManager: InputManager = null;

    onLoad(): void {
        this.inputManager = InputManager.getInstance();

        this.subscribeEvents();

        game.addPersistRootNode(this.node);
    }

    start(): void {
        this.windowResized();
    }

    private nextLevel(): void {
        this.currentLevel += 1;

        if (this.currentLevel >= this.levels.length) {
            this.currentLevel = 0;
        }

        this.loadScene('Level', () => { this.startLevel(this.currentLevel) });
    }

    private restartLevel(): void {
        this.loadScene('Level', () => { this.startLevel(this.currentLevel) });
    }

    private startNewGame(): void {
        this.currentLevel = 0;
        this.restartLevel();
    }

    private resumeGame(): void {
        this.restartLevel();
    }

    private startLevel(level: number): void {
        GlobalEvent.getInstance().emit(Events.START_LEVEL, level + 1, this.levels[level]);
    }

    private mainMenu(): void {
        this.loadScene('MainMenu');
    }

    private loadScene(scene: string, callback: Function = () => {}): void {
        director.loadScene(scene, () => {
            this.inputManager.clearCache();
            callback();
        });
    }

    private subscribeEvents(): void {
        View.instance.on('design-resolution-changed', this.windowResized, this);

        GlobalEvent.getInstance().on(Events.NEXT_LEVEL, this.nextLevel, this);
        GlobalEvent.getInstance().on(Events.RESTART_LEVEL, this.restartLevel, this);
        GlobalEvent.getInstance().on(Events.NEW_GAME, this.startNewGame, this);
        GlobalEvent.getInstance().on(Events.RESUME_GAME, this.resumeGame, this);
        GlobalEvent.getInstance().on(Events.MAIN_MENU, this.mainMenu, this);
    }

    private windowResized(): void {
        this.settings.updateSettings();
        GlobalEvent.getInstance().emit(Events.WINDOW_RESIZED.toString(), this.settings);
    }
}
