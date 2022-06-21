import { Enum, math, Node, size, Size, UITransform, Vec2, _decorator } from "cc";
import Settings from "../../../Settings";
import { TransformComponent } from "../../TransformComponent";
import SimpleTransformComponent from "../Base/SimpleTransformComponent";


const { ccclass, property } = _decorator;

enum PositionType {
    Relative = 0,
    Absolute = 1,
}

enum LayerType {
    UI = 0,
    World = 1,
}


@ccclass('PositionComponent')
export default class PositionComponent extends SimpleTransformComponent {

    // #region fields

    @property({ type: Enum(PositionType) }) private _positionType: PositionType = PositionType.Relative;
    @property({ type: Enum(LayerType) }) private _layer: LayerType = LayerType.UI;
    @property(Vec2) private _position: Vec2 = math.v2(0, 0);
    @property(Vec2) private _offset: Vec2 = math.v2(0, 0);


    @property({ type: Enum(PositionType), visible() { return this.isActive; } })
    public get positionType(): PositionType { return this._positionType; }
    public set positionType(v: PositionType) { this._positionType = v; }

    @property({ type: Enum(LayerType), visible() { return this.isActive; } })
    public get layer(): LayerType { return this._layer; }
    public set layer(v: LayerType) { this._layer = v; }

    @property({ visible() { return this.isActive; } })
    public get position(): Vec2 { return this._position; }
    public set position(v: Vec2) { this._position = v; }

    @property({ visible() { return this.isActive; } })
    public get offset(): Vec2 { return this._offset; }
    public set offset(v: Vec2) { this._offset = v; }

    private settings: Settings = new Settings();

    // #endregion


    // #region public methods

    protected applyTransform(node: Node, transformComponent: TransformComponent): this {
        let newPosition = math.v2();
        let targetPosition = this.position.clone();
        let referenceSize = this.checkTransformReference(transformComponent);

        if (this.positionType === PositionType.Relative) {
            if (!referenceSize) referenceSize = this.calculateReferenceSize();

            newPosition = this.calculatePositionByRefSize(targetPosition, referenceSize);
        } else if (this.positionType === PositionType.Absolute) {
            newPosition = targetPosition.clone().multiplyScalar(this.layer === LayerType.UI ?
                this.settings.SCALE :
                1
            );
        }

        this.applyOffset(newPosition, this.offset, this.layer);
        this.applyPosition(node, newPosition);

        return this;
    }

    // #endregion


    // #region private methods

    private checkTransformReference(transformComponent: TransformComponent) {
        const transformReference = transformComponent.transformReference;
        if (!transformReference || !this.isUsingTransformReference) return null;

        const uiTransform = transformComponent.getNodeComponentByType(transformReference, UITransform);
        if (!uiTransform) return null;

        return size(
            uiTransform.width * (this.isConsiderReferenceScale ? transformReference.scale.x : 1),
            uiTransform.height * (this.isConsiderReferenceScale ? transformReference.scale.y : 1),
        );
    }

    private calculateReferenceSize(): Size {
        let referenceSize = null

        if (this.layer === LayerType.UI) {
            referenceSize = size(this.settings.GAME_WIDTH, this.settings.GAME_HEIGHT);
        } else if (this.layer === LayerType.World) {
            referenceSize = size(this.settings.WORLD_HEIGHT, this.settings.WORLD_WIDTH);
        } else {
            referenceSize = size(1, 1);
        }

        return referenceSize;
    }

    private applyOffset(targetPosition: Vec2, offset: Vec2, layer: LayerType) {
        return targetPosition.add(offset.multiplyScalar(layer === LayerType.UI ? this.settings.SCALE : 1));
    }

    private applyPosition(node: Node, position: Vec2) {
        node.setPosition(position.x, position.y, 0);
    }

    private calculatePositionByRefSize(relativePosition: Vec2, referenceSize: Size) {
        return math.v2(referenceSize.width * relativePosition.x, referenceSize.height * relativePosition.y);
    }

    // #endregion


    // #region import/export methods

    protected copyData(source: PositionComponent): void {
        this.positionType = source.positionType;
        this.layer = source.layer;
        this.position = source.position.clone();
        this.offset = source.offset.clone();
    }

    // #endregion
}
