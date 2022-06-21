import { math, Node, UITransform, Vec2, _decorator } from "cc";
import { TransformComponent } from "../../TransformComponent";
import SimpleTransformComponent from "../Base/SimpleTransformComponent";


const { ccclass, property } = _decorator;

@ccclass('AnchorComponent')
export default class AnchorComponent extends SimpleTransformComponent {

    @property(Vec2) private _anchor: Vec2 = math.v2(.5, .5);

    @property({ visible() { return this.isActive; } })
    public get anchor(): Vec2 { return this._anchor; }
    public set anchor(v: Vec2) { this._anchor = v; }

    protected applyTransform(node: Node, transformComponent: TransformComponent) {
        const uiTransform = transformComponent.getNodeComponentByType(node, UITransform);
        if (!uiTransform) return this;

        uiTransform.setAnchorPoint(this.anchor);

        return this;
    }

    protected copyData(source: AnchorComponent) {
        this.anchor = source.anchor.clone();
    }

}
