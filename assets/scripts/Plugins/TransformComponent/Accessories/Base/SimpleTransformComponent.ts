import { CCBoolean, log, Node, _decorator } from "cc";
import { TransformComponent } from "../../TransformComponent";

const { ccclass, property } = _decorator;

@ccclass('SimpleTransformComponent')
export default class SimpleTransformComponent {

    @property(CCBoolean) protected _isActive: boolean = false;
    @property(CCBoolean) private _isUsingTransformReference: boolean = false;
    @property(CCBoolean) private _isConsiderReferenceScale: boolean = false;
    @property(CCBoolean) private _isTransformReferenceExists: boolean = false;

    @property({ displayOrder: 1000, visible() { return this.isActive && this.isTransformReferenceExists; } })
    public get isUsingTransformReference(): boolean { return this._isUsingTransformReference; }
    public set isUsingTransformReference(v: boolean) { this._isUsingTransformReference = v; }

    @property({ displayOrder: 1001, visible() { return this.isActive && this.isTransformReferenceExists; } })
    public get isConsiderReferenceScale(): boolean { return this._isConsiderReferenceScale; }
    public set isConsiderReferenceScale(v: boolean) { this._isConsiderReferenceScale = v; }

    @property(CCBoolean)
    public get isActive(): boolean { return this._isActive; }
    public set isActive(v: boolean) {
        if (this.isActive === v) return;

        this.reset();

        this._isActive = v;
    }

    @property({ visible: false })
    public get isTransformReferenceExists(): boolean { return this._isTransformReferenceExists; }
    public set isTransformReferenceExists(v: boolean) { this._isTransformReferenceExists = v; }

    public execute(node: Node, transformComponent: TransformComponent): any {
        if (this.isActive) { this.applyTransform(node, transformComponent); }
    }

    public reset() {
        this.copy(new (<typeof SimpleTransformComponent>this.constructor), true);
    }

    public clone(): SimpleTransformComponent {
        (new (<typeof SimpleTransformComponent>this.constructor)).copy(this);

        return this;
    }

    public copy(source: SimpleTransformComponent, isReset: boolean = false): this {
        if (!source) return this;

        if (!isReset) {
            this.isActive = source.isActive;

            this.isUsingTransformReference = source.isUsingTransformReference;
            this.isTransformReferenceExists = source.isTransformReferenceExists;
        }

        this.copyData(source);

        return this;
    }

    protected copyData(source: SimpleTransformComponent) { }
    protected applyTransform(node: Node, transformComponent: TransformComponent) { }

}