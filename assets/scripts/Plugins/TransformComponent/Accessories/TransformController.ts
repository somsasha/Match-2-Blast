import { Enum, Node, _decorator } from "cc";
import { TransformComponent } from "../TransformComponent";

import AnchorComponent from "./Components/AnchorComponent";
import PositionComponent from "./Components/PositionComponent";
import RotationComponent from "./Components/RotationComponent";
import ScaleComponent from "./Components/ScaleComponent";
import SizeComponent from "./Components/SizeComponent";



enum TransformComponentType {
    Position,
    Scale,
    Rotation,
    Anchor,
    Size,
    All,

    PositionAndScale,

    Hide,
};


const { ccclass, property } = _decorator;

@ccclass('TransformController')
export default class TransformController {

    @property({ type: Enum(TransformComponentType) }) private _changeValueType: TransformComponentType = TransformComponentType.PositionAndScale;

    @property({ type: PositionComponent }) private _positionComponent: PositionComponent = new PositionComponent();
    @property({ type: ScaleComponent }) private _scaleComponent: ScaleComponent = new ScaleComponent();
    @property({ type: RotationComponent }) private _rotationComponent: RotationComponent = new RotationComponent();
    @property({ type: AnchorComponent }) private _anchorComponent: AnchorComponent = new AnchorComponent();
    @property({ type: SizeComponent }) private _sizeComponent: SizeComponent = new SizeComponent();

    @property({ type: Enum(TransformComponentType) })
    public get changeValueType(): TransformComponentType { return this._changeValueType; }
    public set changeValueType(v: TransformComponentType) { this._changeValueType = v; }

    @property({
        type: PositionComponent,
        displayOrder: 1,
        visible() {
            return this.isPreferredTypeSelected(
                TransformComponentType.Position,
                TransformComponentType.PositionAndScale,
                TransformComponentType.All,
            );
        }
    })
    public get positionComponent(): PositionComponent { return this._positionComponent; }
    public set positionComponent(v: PositionComponent) { this._positionComponent = v; }

    @property({
        type: ScaleComponent,
        displayOrder: 2,
        visible() {
            return this.isPreferredTypeSelected(
                TransformComponentType.Scale,
                TransformComponentType.PositionAndScale,
                TransformComponentType.All,
            );
        }
    })
    public get scaleComponent(): ScaleComponent { return this._scaleComponent; }
    public set scaleComponent(v: ScaleComponent) { this._scaleComponent = v; }

    @property({
        type: RotationComponent,
        displayOrder: 3,
        visible() {
            return this.isPreferredTypeSelected(
                TransformComponentType.Rotation,
                TransformComponentType.All,
            );
        }
    })
    public get rotationComponent(): RotationComponent { return this._rotationComponent; }
    public set rotationComponent(v: RotationComponent) { this._rotationComponent = v; }

    @property({
        type: AnchorComponent,
        displayOrder: 4,
        visible() {
            return this.isPreferredTypeSelected(
                TransformComponentType.Anchor,
                TransformComponentType.All,
            );
        }
    })
    public get anchorComponent(): AnchorComponent { return this._anchorComponent; }
    public set anchorComponent(v: AnchorComponent) { this._anchorComponent = v; }

    @property({
        type: SizeComponent,
        displayOrder: 5,
        visible() {
            return this.isPreferredTypeSelected(
                TransformComponentType.Size,
                TransformComponentType.All,
            );
        }
    })
    public get sizeComponent(): SizeComponent { return this._sizeComponent; }
    public set sizeComponent(v: SizeComponent) { this._sizeComponent = v; }


    private _transformReference: Node = null;

    public get transformReference(): Node { return this._transformReference; }
    public set transformReference(v: Node) {
        this._transformReference = v;

        if (this.positionComponent) this.positionComponent.isTransformReferenceExists = !!this._transformReference;
        if (this.scaleComponent) this.scaleComponent.isTransformReferenceExists = !!this._transformReference;
        if (this.rotationComponent) this.rotationComponent.isTransformReferenceExists = !!this._transformReference;
        if (this.anchorComponent) this.anchorComponent.isTransformReferenceExists = !!this._transformReference;
        if (this.sizeComponent) this.sizeComponent.isTransformReferenceExists = !!this._transformReference;
    }

    public execute(node: Node, transformComponent: TransformComponent) {
        this.rotationComponent.execute(node, transformComponent);
        this.positionComponent.execute(node, transformComponent);
        this.sizeComponent.execute(node, transformComponent);
        this.anchorComponent.execute(node, transformComponent);
        this.scaleComponent.execute(node, transformComponent);
    }

    public copy(transformController: TransformController): this {
        this.positionComponent.copy(transformController.positionComponent);
        this.scaleComponent.copy(transformController.scaleComponent);
        this.rotationComponent.copy(transformController.rotationComponent);
        this.anchorComponent.copy(transformController.anchorComponent);
        this.sizeComponent.copy(transformController.sizeComponent);

        this.changeValueType = transformController.changeValueType;
        this.transformReference = transformController.transformReference;

        return this;
    }

    public clone(): TransformController {
        return new TransformController().copy(this);
    }

    private isPreferredTypeSelected(...type: TransformComponentType[]): boolean {
        return !!type.find(e => e === this.changeValueType);;
    }

}
