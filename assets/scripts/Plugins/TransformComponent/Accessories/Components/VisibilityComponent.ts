import { Color, color, Node, Sprite, _decorator } from "cc";
import { TransformComponent } from "../../TransformComponent";
import SimpleTransformComponent from "../Base/SimpleTransformComponent";


const { ccclass, property } = _decorator;

@ccclass('VisibilityComponent')
export default class VisibilityComponent extends SimpleTransformComponent {

    @property(Color) private _color: Color = color(255, 255, 255, 255);

    @property({ visible() { return this.isActive; } })
    public get color(): Color { return this._color; }
    public set color(v: Color) { this._color = v; }

    protected applyTransform(node: Node, transformComponent: TransformComponent): this {
        const sprite = transformComponent.getNodeComponentByType(node, Sprite);
        if (!sprite) return null;

        sprite.color = this.color;

        return this;
    }

    protected copyData(source: VisibilityComponent): void {
        this.color = source.color.clone();
    }
}

