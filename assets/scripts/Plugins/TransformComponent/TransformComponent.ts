import { CCBoolean, CCFloat, Component, Node, _decorator } from 'cc';
import Events from '../Enums/Events';
import { GlobalEvent } from '../GlobalEvent';
import Settings from '../Settings';
import TransformController from './Accessories/TransformController';
const { ccclass, property, menu } = _decorator;

type Constructor<T> = new (...args: any[]) => T;

@ccclass('TransformComponent')
@menu('Transform/TransformComponent')
export class TransformComponent extends Component {

    @property(Node) private _transformReference: Node = null;
    @property(CCBoolean) private _isSameTransform: boolean = true;
    @property(CCBoolean) private _isDependingOnSideRatio: boolean = false;
    @property(CCFloat) private _limitSideRatio: number = 1.35;


    @property({ type: Node, displayOrder: 1 })
    public get transformReference(): Node { return this._transformReference; }
    public set transformReference(v: Node) {
        if (this._transformReference === v) return;
        this._transformReference = v;

        if (this.commonTransform) this.commonTransform.transformReference = this._transformReference;
        if (this.landscapeTransform) this.landscapeTransform.transformReference = this._transformReference;
        if (this.portraitTransform) this.portraitTransform.transformReference = this._transformReference;
        if (this.commonTransformBelowSideRatio) this.commonTransformBelowSideRatio.transformReference = this._transformReference;
        if (this.landscapeTransformBelowSideRatio) this.landscapeTransformBelowSideRatio.transformReference = this._transformReference;
        if (this.portraitTransformBelowSideRatio) this.portraitTransformBelowSideRatio.transformReference = this._transformReference;
    }

    @property({ displayOrder: 2 })
    public get isSameTransform(): boolean { return this._isSameTransform; }
    public set isSameTransform(v: boolean) {
        if (this._isSameTransform === v) return;
        this._isSameTransform = v;

        this.commonTransform = this.isSameTransform && this.landscapeTransform ? this.landscapeTransform.clone() : this.commonTransform;
        this.landscapeTransform = this._isSameTransform ? null : this.commonTransform.clone();
        this.portraitTransform = this._isSameTransform ? null : this.commonTransform.clone();
    }

    @property({ displayOrder: 3 })
    public get isDependingOnSideRatio(): boolean { return this._isDependingOnSideRatio; }
    public set isDependingOnSideRatio(v: boolean) {
        if (this.isDependingOnSideRatio === v) return;
        this._isDependingOnSideRatio = v;

        this.commonTransformBelowSideRatio = this.isDependingOnSideRatio && this.isSameTransform ? this.commonTransform.clone() : null;
        this.landscapeTransformBelowSideRatio = this.isDependingOnSideRatio && !this.isSameTransform && this.landscapeTransform ? this.landscapeTransform.clone() : null;
        this.portraitTransformBelowSideRatio = this.isDependingOnSideRatio && !this.isSameTransform && this.portraitTransform ? this.portraitTransform.clone() : null;
    }

    @property({ type: CCFloat, visible() { return this.isDependingOnSideRatio; }, displayOrder: 4 })
    public get limitSideRatio(): number { return this._limitSideRatio; }
    public set limitSideRatio(v: number) { this._limitSideRatio = v; }


    //#region commonTransform
    @property({ type: TransformController, visible() { return this.isSameTransform; }, displayOrder: 5 })
    private commonTransform: TransformController = new TransformController();
    @property({ type: TransformController, visible() { return this.isSameTransform && this.isDependingOnSideRatio; }, displayOrder: 6 })
    private commonTransformBelowSideRatio: TransformController = new TransformController();
    //#endregion commonTransform


    //#region landscapeTransform
    @property({ type: TransformController, visible() { return !this.isSameTransform; }, displayOrder: 7 })
    private landscapeTransform: TransformController = new TransformController();

    @property({ type: TransformController, visible() { return !this.isSameTransform && this.isDependingOnSideRatio; }, displayOrder: 8 })
    private landscapeTransformBelowSideRatio: TransformController = new TransformController();
    //#endregion landscapeTransform


    //#region portraitTransform
    @property({ type: TransformController, visible() { return !this.isSameTransform; }, displayOrder: 9 })
    private portraitTransform: TransformController = new TransformController();

    @property({ type: TransformController, visible() { return !this.isSameTransform && this.isDependingOnSideRatio; }, displayOrder: 10 })
    private portraitTransformBelowSideRatio: TransformController = new TransformController();
    //#endregion portraitTransform

    private nodesComponentsMap: Map<Node, Map<Constructor<Component>, Component>> = new Map();
    private settings: Settings = new Settings();


    private _postResizeCallbacks: (() => void)[] = [];
    private _preResizeCallbacks: (() => void)[] = [];

    onLoad() {
        this.subscribeEvents();
    }

    onEnable() {
        this.execute();
    }

    public addPostResizeCallback(callback: () => void) {
        if (this._postResizeCallbacks.indexOf(callback) < 0) { this._postResizeCallbacks.push(callback); }
    }

    public removePostResizeCallback(callback: () => void) {
        const index = this._postResizeCallbacks.indexOf(callback);

        if (index > -1) { this._postResizeCallbacks.splice(index, 1); }
    }

    public addPreResizeCallback(callback: () => void) {
        if (this._preResizeCallbacks.indexOf(callback) < 0) { this._preResizeCallbacks.push(callback); }
    }

    public removePreResizeCallback(callback: () => void) {
        const index = this._preResizeCallbacks.indexOf(callback);

        if (index > -1) { this._preResizeCallbacks.splice(index, 1); }
    }

    public execute() {
        if (!this.enabled) return;

        const transform = this.getCurrentTransform();

        if (transform) { transform.execute(this.node, this); }
    }

    public getNodeComponentByType<T extends Component>(node: Node, component: Constructor<T>): T | null {
        if (!node || !component) return;

        const componentsMap = this.nodesComponentsMap.get(node);
        return componentsMap ? componentsMap.get(component) as T : this.addComponentToMap(node, component);
    }

    private addComponentToMap<T extends Component>(node: Node, component: Constructor<T>): T {
        if (!node || !component) return;

        if (!this.nodesComponentsMap.has(node)) { this.nodesComponentsMap.set(node, new Map()); }

        const componentsMap = this.nodesComponentsMap.get(node);
        const componentValue = this.getNodeComponent(node, component);
        componentsMap.set(component, componentValue);

        return componentValue;
    }

    private getNodeComponent<T extends Component>(node: Node, component: Constructor<T>): T | null {
        return node ? node.getComponent(component) : null;
    }

    private subscribeEvents() {
        GlobalEvent.getInstance().on(Events.WINDOW_RESIZED.toString(), this.onSizeChanged, this);
    }

    private getCurrentTransform(): TransformController {
        let currentTransform = null;

        const sideRatio = this.getSideRatio();
        const isUsingTransformBelowSideRatio = this.isDependingOnSideRatio && (sideRatio < this.limitSideRatio);

        if (this.isSameTransform) {
            currentTransform = isUsingTransformBelowSideRatio ? this.commonTransformBelowSideRatio : this.commonTransform;
        } else {
            if (this.settings.IS_LANDSCAPE) {
                currentTransform = isUsingTransformBelowSideRatio ? this.landscapeTransformBelowSideRatio : this.landscapeTransform;
            } else {
                currentTransform = isUsingTransformBelowSideRatio ? this.portraitTransformBelowSideRatio : this.portraitTransform;
            }
        }

        return currentTransform;
    }

    private getSideRatio(): number {
        return this.settings.SIDE_RATIO ||
            Math.max(
                this.settings.GAME_WIDTH,
                this.settings.GAME_HEIGHT
            ) /
            Math.min(
                this.settings.GAME_WIDTH,
                this.settings.GAME_HEIGHT
            );
    }

    private onSizeChanged() {
        this._preResizeCallbacks.forEach((c) => c());
        this.execute();
        this._postResizeCallbacks.forEach((c) => c());
    }

}

