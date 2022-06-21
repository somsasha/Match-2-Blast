import { Enum, math, Node, UITransform, Vec2, _decorator } from "cc";
import Settings from "../../../Settings";
import { TransformComponent } from "../../TransformComponent";
import SimpleTransformComponent from "../Base/SimpleTransformComponent";


const { ccclass, property } = _decorator;

enum FitMode {
    Inscribe = 0,
    Describe = 1,
    FitWidth = 3,
    FitHeight = 4,
    Unproportional = 5,
    Default = 6,
}

enum SizeMode {
    Relative = 0,
    Constant = 1,
}

enum LayerType {
    UI = 0,
    World = 1,
}


@ccclass('ScaleComponent')
export default class ScaleComponent extends SimpleTransformComponent {
    // #region fields


    @property({ type: Enum(SizeMode) }) private _sizeMode: SizeMode = SizeMode.Relative;
    @property({ type: Enum(FitMode) }) private _fitMode: FitMode = FitMode.Inscribe;
    @property({ type: Enum(LayerType) }) private _layer: LayerType = LayerType.UI;
    @property(Vec2) private _desiredSize: Vec2 = math.v2();

    @property(Vec2) private _padding: Vec2 = math.v2();


    @property({ type: Enum(SizeMode), visible() { return this.isActive; } })
    public get sizeMode(): SizeMode { return this._sizeMode; }
    public set sizeMode(v: SizeMode) { this._sizeMode = v; }

    @property({ type: Enum(FitMode), visible() { return this.isActive; } })
    public get fitMode(): FitMode { return this._fitMode; }
    public set fitMode(v: FitMode) { this._fitMode = v; }

    @property({ type: Enum(LayerType), visible() { return this.isActive; } })
    public get layer(): LayerType { return this._layer; }
    public set layer(v: LayerType) { this._layer = v; }

    @property({ visible() { return this.isActive; } })
    public get desiredSize(): Vec2 { return this._desiredSize; }
    public set desiredSize(v: Vec2) { this._desiredSize = v; }

    @property({ type: Vec2, visible() { return this.sizeMode === SizeMode.Relative && this.isActive; } })
    public get padding(): Vec2 { return this._padding; }
    public set padding(v: Vec2) { this._padding = v; }


    private settings: Settings = new Settings();

    // #endregion


    // #region public methods

    protected applyTransform(node: Node, transformComponent: TransformComponent) {
        let referenceSize: Vec2 = this.checkTransformReference(transformComponent);
        if (!referenceSize) referenceSize = this.calculateReferenceSize();

        let newScale = math.v2();
        let actualDesiredSize = this.calculateActualSize(referenceSize);

        const uiTransform = node.getComponent(UITransform);
        if (!uiTransform) return null;

        let targetScale = math.v2(
            actualDesiredSize.x / uiTransform.width,
            actualDesiredSize.y / uiTransform.height,
        );

        newScale = this.calculateTargetScale(this.fitMode, targetScale, math.v2(node.scale.x, node.scale.y), actualDesiredSize);

        // node.scaleX = newScale.x;
        // node.scaleY = newScale.y

        node.setScale(math.v3(newScale.x, newScale.y, 1));
    }

    // #endregion


    // #region private methods

    private checkTransformReference(transformComponent: TransformComponent): Vec2 {
        const transformReference = transformComponent.transformReference;
        if (!transformReference || !this.isUsingTransformReference) return null;

        const uiTransform = transformComponent.getNodeComponentByType(transformReference, UITransform);
        if (!uiTransform) return null;

        return math.v2(
            uiTransform.width * (this.isConsiderReferenceScale ? transformReference.scale.x : 1),
            uiTransform.height * (this.isConsiderReferenceScale ? transformReference.scale.y : 1),
        );
    }

    private calculateReferenceSize(): Vec2 {
        let referenceSize = null

        if (this.layer === LayerType.UI) {
            referenceSize = math.v2(this.settings.GAME_WIDTH, this.settings.GAME_HEIGHT);
        } else if (this.layer === LayerType.World) {
            referenceSize = math.v2(this.settings.WORLD_HEIGHT, this.settings.WORLD_WIDTH);
        } else {
            referenceSize = math.v2(1, 1);
        }
        return referenceSize;
    }

    private calculateTargetScale(fitMode: FitMode, necessaryScale: Vec2, currentNodeScale: Vec2, desiredSize: Vec2): Vec2 {
        let ts = necessaryScale.clone();

        switch (true) {
            case (fitMode === FitMode.Inscribe): {
                ts.x = ts.y = Math.min(ts.x, ts.y);
            } break;

            case (fitMode === FitMode.Describe): {
                ts.x = ts.y = Math.max(ts.x, ts.y);
            } break;

            case (fitMode === FitMode.FitHeight): {
                ts.x = ts.y;
            } break;

            case (fitMode === FitMode.FitWidth): {
                ts.y = ts.x;
            } break;

            case (fitMode === FitMode.Unproportional): {
                if (this.sizeMode === SizeMode.Constant) {
                    ts = desiredSize.clone();
                }
            } break;

            case (fitMode === FitMode.Default): {
                ts = this.calculateTargetScale(FitMode.Inscribe, necessaryScale, currentNodeScale, desiredSize);
            } break;
        }

        return ts;
    }

    private calculateActualSize(referenceSize: Vec2): Vec2 {
        let desiredSize = null;

        switch (true) {
            case (this.sizeMode === SizeMode.Relative && this.layer === LayerType.UI): {
                desiredSize = this.calculateSizeByRelativeSize(this.desiredSize, referenceSize).subtract(this.padding.clone().multiplyScalar(this.settings.SCALE));
            } break;

            case (this.sizeMode === SizeMode.Relative && this.layer === LayerType.World): {
                desiredSize = this.calculateSizeByRelativeSize(this.desiredSize, referenceSize);
            } break;

            case (this.sizeMode === SizeMode.Constant && this.layer === LayerType.UI): {
                desiredSize = this.desiredSize.clone().multiplyScalar(this.settings.SCALE);
            } break;

            case (this.sizeMode === SizeMode.Constant && this.layer === LayerType.World): {
                desiredSize = this.desiredSize.clone();
            } break;

            default: {
                desiredSize = math.v2(1, 1);
            } break;
        }

        return desiredSize;
    }

    private calculateSizeByRelativeSize(relativeSize: Vec2, referenceSize: Vec2): Vec2 {
        return math.v2(
            referenceSize.x * relativeSize.x,
            referenceSize.y * relativeSize.y,
        );
    }

    // #endregion


    // #region import/export methods

    protected copyData(source: ScaleComponent): void {
        this.sizeMode = source.sizeMode;
        this.fitMode = source.fitMode;
        this.layer = source.layer;
        this.desiredSize = source.desiredSize.clone();
        this.padding = source.padding.clone();
    }

    // #endregion

}
