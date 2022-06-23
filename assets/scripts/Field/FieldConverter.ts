import { math, Size, UITransform, Vec2 } from "cc";

export class FieldConverter {
    private fieldSize: Size = math.size();
    private fieldUiTransform: UITransform = null;
    private tileSize: Size = math.size();
    
    private fieldRealSize: Size = math.size();
    private tileScaledSize: Size = math.size();
    private tilesOffset: Vec2 = math.v2();
    private tilesStartPosition: Vec2 = math.v2();

    private tileScale: number = 1;
    // #TODO
    public get tilesScale(): number {
        return this.tileScale;
    }

    public constructor(fieldSize: Size, uiTransform: UITransform, tileSize: Size) {
        this.fieldSize = fieldSize;
        this.fieldUiTransform = uiTransform;
        this.tileSize = tileSize;

        this.fieldRealSize = this.fieldUiTransform.contentSize;

        const tileScaleX = (this.fieldRealSize.width / this.fieldSize.width) / this.tileSize.width;
        const tileScaleY = (this.fieldRealSize.height / this.fieldSize.height) / this.tileSize.height;
        this.tileScale = Math.min(tileScaleX, tileScaleY);

        this.tileScaledSize = math.size(this.tileSize.width * this.tileScale, this.tileSize.height * this.tileScale);

        const tilesOffsetX = (this.fieldRealSize.width - this.tileScaledSize.width * this.fieldSize.width) / this.fieldSize.width;
        const tilesOffsetY = (this.fieldRealSize.height - this.tileScaledSize.height * this.fieldSize.height) / this.fieldSize.height;
        this.tilesOffset = math.v2(tilesOffsetX, tilesOffsetY);

        // get up-left tile position
        const tilesStartPosX = -this.fieldRealSize.width / 2 + this.tilesOffset.x / 2 + this.tileScaledSize.width / 2;
        const tilesStartPosY = this.fieldRealSize.height / 2 - this.tilesOffset.y / 2 - this.tileScaledSize.width / 2;
        this.tilesStartPosition = math.v2(tilesStartPosX, tilesStartPosY);
    }

    public getRealPosition(position: Vec2): Vec2 {
        const tileSpawnPosX = this.tilesStartPosition.x + position.x * (this.tileScaledSize.width + this.tilesOffset.x);
        const tileSpawnPosY = this.tilesStartPosition.y - position.y * (this.tileScaledSize.height + this.tilesOffset.y);

        return math.v2(tileSpawnPosX, tileSpawnPosY)
    }

    public getPositionByTouchPosition(touchPosition: Vec2): Vec2 {
        const touchLocalPosition = this.fieldUiTransform.convertToNodeSpaceAR(math.v3(touchPosition.x, touchPosition.y));

        const x = Math.round((touchLocalPosition.x - this.tilesStartPosition.x) / (this.tileScaledSize.width + this.tilesOffset.x));
        const y = -Math.round((touchLocalPosition.y - this.tilesStartPosition.y) / (this.tileScaledSize.height + this.tilesOffset.y));
        
        return math.v2(x, y);
    }
}

