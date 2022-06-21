import { Node, Size, size, UITransform, _decorator } from "cc";
import { TransformComponent } from "../../TransformComponent";
import SimpleTransformComponent from "../Base/SimpleTransformComponent";


const { ccclass, property } = _decorator;

@ccclass('SizeComponent')
export default class SizeComponent extends SimpleTransformComponent {

    @property(Size) private _size: Size = size(1, 1);

    @property({ visible() { return this.isActive; } })
    public get size(): Size { return this._size; }
    public set size(v: Size) { this._size = v; }

    protected applyTransform(node: Node, transformComponent: TransformComponent) {
        const uiTransform = transformComponent.getNodeComponentByType(node, UITransform);
        if (!uiTransform) return null;

        const anchor = uiTransform.anchorPoint.clone();

        uiTransform.setContentSize(this.size);
        uiTransform.setAnchorPoint(anchor);
    }

    protected copyData(source: SizeComponent): void {
        this.size = source.size.clone();
    }
}
