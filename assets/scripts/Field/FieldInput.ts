import InputManager from "../Plugins/Input/InputManager";
import { InputManagerData } from "../Plugins/Input/InputManagerData";
import InputSources from "../Plugins/Input/InputSources";
import InputTypes from "../Plugins/Input/InputTypes";
import { FieldConverter } from "./FieldConverter";
import { TileManager } from "../Mediators/TileManager/TileManager";

export class FieldInput {
    private fieldConverter: FieldConverter = null;
    private tileManager: TileManager = null;

    private isActive: boolean = true;

    constructor(fieldConverter: FieldConverter, tileManager: TileManager) {
        this.fieldConverter = fieldConverter;
        this.tileManager = tileManager;

        InputManager.getInstance().on(InputTypes.Down, this.onInput, this);
    }
    
    private onInput(data: InputManagerData): void {
        if (!this.isActive || data.source !== InputSources.Field) return;

        const touchPosition = data.touch.getUILocation();
        const position = this.fieldConverter.getPositionByTouchPosition(touchPosition);

        if (position.x < 0
            || position.y < 0
            || position.x >= this.fieldConverter.FIELD_SIZE.width
            || position.y >= this.fieldConverter.FIELD_SIZE.height
        ) return;

        const tile = this.tileManager.getTileByPosition(position);

        if (tile) {
            tile.tap();
        }
    }
}