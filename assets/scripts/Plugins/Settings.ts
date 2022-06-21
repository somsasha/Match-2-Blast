import { math, Vec2, View, _decorator } from "cc";

const { ccclass, property } = _decorator;

@ccclass('Settings')
export default class Settings {
    private static instance: Settings = undefined;

    private default_width: number = 0;
    private default_height: number = 0;
    private game_width: number = 0;
    private game_height: number = 0;
    private scale: number = 0;
    private is_landscape: boolean = false;
    private half_width: number = 0;
    private half_heigth: number = 0;
    private world_width: number = 0;
    private world_height: number = 0;

    public get DEFAULT_WIDTH(): number { return this.default_width; }
    public get DEFAULT_HEIGHT(): number { return this.default_height; }
    public get GAME_WIDTH(): number { return this.game_width; }
    public get GAME_HEIGHT(): number { return this.game_height; }
    public get IS_LANDSCAPE(): boolean { return this.is_landscape; }
    public get HALF_WIDTH(): number { return this.half_width; }
    public get HALF_HEIGHT(): number { return this.half_heigth; }
    public get WORLD_WIDTH(): number { return this.world_width; }
    public get WORLD_HEIGHT(): number { return this.world_height; }
    public get SCALE(): number { return this.scale; }
    public get WIN_SIZE(): Vec2 { return math.v2(this.GAME_WIDTH, this.GAME_HEIGHT); }
    public get INV_WIN_SIZE(): Vec2 { return math.v2(1 / this.GAME_WIDTH, 1 / this.GAME_HEIGHT); }
    public get SIDE_RATIO(): number { return Math.max(this.GAME_WIDTH, this.GAME_HEIGHT) / Math.min(this.GAME_WIDTH, this.GAME_HEIGHT); }

    public set WORLD_WIDTH(value) { this.world_width = value; }
    public set WORLD_HEIGHT(value) { this.world_height = value; }

    constructor() {
        const instance = Settings.instance;
        if (instance !== undefined) {
            return instance;
        }

        Settings.instance = this;

        this.default_width = 640;
        this.default_height = 1136;
        this.game_width = 640;
        this.game_height = 1136;
        this.scale = 1;
        this.is_landscape = false;
        this.half_width = 320;
        this.half_heigth = 568;
        this.world_width = 1366;
        this.world_height = 1366;
    }

    updateSettings() {
        const canvasSize = View.instance.getVisibleSize();

        this.game_width = canvasSize.width;// cc.winSize.width;
        this.game_height = canvasSize.height; //cc.winSize.height;

        this.half_width = this.GAME_WIDTH * 0.5;
        this.half_heigth = this.GAME_HEIGHT * 0.5;

        this.is_landscape = this.GAME_WIDTH > this.GAME_HEIGHT;
        this.scale = this.calculateScale();
    }

    chooseDefaultHeight() {
        const height = this.IS_LANDSCAPE ? this.DEFAULT_HEIGHT : this.DEFAULT_WIDTH;
        return height;
    }

    chooseDefaultWidth() {
        const width = this.IS_LANDSCAPE ? this.DEFAULT_WIDTH : this.DEFAULT_HEIGHT;
        return width;
    }

    calculateScale() {
        const widthRatio = this.GAME_WIDTH / this.chooseDefaultWidth();
        const heightRatio = this.GAME_HEIGHT / this.chooseDefaultHeight();
        const minRatio = Math.min(widthRatio, heightRatio);
        return minRatio;
    }
}
