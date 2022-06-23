import { _decorator, Component, Enum, CCInteger, CCFloat, math, UITransform, Vec2 } from 'cc';
import Easings from '../Enums/Easings';
import InputManager from '../Plugins/Input/InputManager';
import { InputManagerData } from '../Plugins/Input/InputManagerData';
import InputSources from '../Plugins/Input/InputSources';
import InputTypes from '../Plugins/Input/InputTypes';
import { ITile } from '../Tiles/ITile';
import { FieldGenerator } from './FieldGenerator';
import { FieldGeneratorConfig } from './FieldGeneratorConfig';
import { FieldConverter } from './FieldConverter';
const { ccclass, property } = _decorator;

@ccclass('Field')
export class Field extends Component {
    @property(CCInteger) tilesToMatch: number = 3;
    @property(CCFloat) tileFallTimeByCell: number = 0.5;
    @property({ type: Enum(Easings) }) tileFallEasing: Easings = Easings.bounceOut;

    @property(FieldGeneratorConfig) fieldGeneratorConfig: FieldGeneratorConfig = null;

    private fieldConverter: FieldConverter = null;
    private fieldGenerator: FieldGenerator = null;

    private tiles: ITile[] = [];

    onLoad() {
        const uiTransform = this.node.getComponent(UITransform);
        const tileSize = this.fieldGeneratorConfig.tilePrefab.data.getComponent(UITransform).contentSize;
        this.fieldConverter = new FieldConverter(this.fieldGeneratorConfig.fieldSize, uiTransform, tileSize);
        this.fieldGenerator = this.node.addComponent(FieldGenerator);
        this.fieldGenerator.init(this.fieldGeneratorConfig, this.fieldConverter);
        
        this.tiles = this.fieldGenerator.createField();

        InputManager.getInstance().on(InputTypes.Down, this.onInput, this);
    }

    private getTileByPosition(position: Vec2): ITile {
        for (let i = 0; i < this.tiles.length; i++) {
            if (this.tiles[i].position.equals(math.v2(position.x, position.y))) {
                return this.tiles[i];
            }
        }

        return null;
    }

    private onInput(data: InputManagerData): void {
        if (data.source !== InputSources.Field) return;

        const touchPosition = data.touch.getUILocation();
        const position = this.fieldConverter.getPositionByTouchPosition(touchPosition);

        if (position.x < 0 
            || position.y < 0 
            || position.x >= this.fieldGeneratorConfig.fieldSize.width 
            || position.y >= this.fieldGeneratorConfig.fieldSize.height
            ) return;

        const tile = this.getTileByPosition(position);
        if (!tile) return;

        this.tiles.splice(this.tiles.indexOf(tile), 1);
        tile.remove();

        for (let y = position.y - 1; y >= 0; y--) {
            this.getTileByPosition(math.v2(position.x, y))?.fall(math.v2(position.x, y + 1), this.fieldConverter.getRealPosition(math.v2(position.x, y + 1)), this.tileFallTimeByCell * 1, this.tileFallEasing);
        }
    }
}

