import { CCFloat, Node, _decorator } from "cc";
import { TransformComponent } from "../../TransformComponent";
import SimpleTransformComponent from "../Base/SimpleTransformComponent";


const { ccclass, property } = _decorator;

@ccclass('RotationComponent')
export default class RotationComponent extends SimpleTransformComponent {

    @property(CCFloat) private _rotation: number = 0;

    @property({ visible() { return this.isActive; } })
    public get rotation(): number { return this._rotation; }
    public set rotation(v: number) { this._rotation = v; }


    protected applyTransform(node: Node, transformComponent: TransformComponent) {
        node.angle = this.rotation;

        return this;
    }

    protected copyData(source: RotationComponent): void {
        this.rotation = source.rotation;
    }
}
