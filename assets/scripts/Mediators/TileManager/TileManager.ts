import { math, Size, Vec2 } from "cc";
import { Field } from "../../Field/Field";
import { AncientFieldState } from "../../Field/FieldStates/AncientFieldState";
import { BombFieldState } from "../../Field/FieldStates/BombFieldState";
import { ColorTileFieldState } from "../../Field/FieldStates/ColorTileFieldState";
import { RocketFieldState } from "../../Field/FieldStates/RocketFieldState";
import { ITile } from "../../Tiles/ITile";
import { SuperTile } from "../../Tiles/SuperTile";
import TileAbilities from "../../Tiles/TileAbilities";
import { Mediator } from "../Mediator";
import TileManagerEvents from "./TileManagerEvents";

export class TileManager implements Mediator {
    private field: Field = null;
    private fieldSize: Size = math.size();
    private tiles: ITile[][] = [];

    constructor(fieldSize: Size, field: Field) {
        this.field = field;
        this.fieldSize = fieldSize;

        for (let y = 0; y < fieldSize.y; y++) {
            this.tiles.push([]);
            for (let x = 0; x < fieldSize.x; x++) {
                this.tiles[y].push(null);
            }
        }
    }

    public notify(tile: ITile, event: TileManagerEvents): void {
        if (event === TileManagerEvents.Tap) {
            this.field.selectTile(tile);
        } else if (event === TileManagerEvents.Remove) {
            this.removeTile(tile);
        }
    }

    public addTile(tile: ITile, position: Vec2): void {
        if (!this.isCorrectPosition(position)) {
            return;
        }

        this.tiles[position.y][position.x] = tile;
    }

    public removeTile(tile: ITile): void {
        const position = this.getTilePosition(tile);

        if (position) {
            this.removeTileByPosition(position);
        }
    }

    public removeTileByPosition(position: Vec2): void {
        if (!this.isCorrectPosition(position)) {
            return;
        }

        this.tiles[position.y][position.x] = null;
    }

    public moveTile(tile: ITile, position: Vec2): void {
        this.removeTile(tile);
        this.addTile(tile, position);
    }

    public swapTiles(firstTile: ITile, secondTile: ITile): void {
        const firstTilePosition = this.getTilePosition(firstTile);
        const secondTilePosition = this.getTilePosition(secondTile);

        this.moveTile(firstTile, secondTilePosition);
        this.moveTile(secondTile, firstTilePosition);
    }

    public getTilePosition(tile: ITile): Vec2 {
        for (let y = 0; y < this.tiles.length; y++) {
            for (let x = 0; x < this.tiles[y].length; x++) {
                if (this.tiles[y][x] === tile) {
                    return math.v2(x, y);
                }
            }
        }

        return null;
    }

    public getTileByPosition(position: Vec2): ITile {
        if (!this.isCorrectPosition(position)) {
            return null;
        }

        return this.tiles[position.y][position.x]
    }

    public getAll(): ITile[] {
        const tiles = [];

        for (let y = 0; y < this.tiles.length; y++) {
            for (let x = 0; x < this.tiles[y].length; x++) {
                if (this.tiles[y][x]) {
                    tiles.push(this.tiles[y][x]);
                }
            }        
        }

        return tiles;
    }

    public getRow(row: number): ITile[] {
        const tiles = [];

        for (let x = 0; x < this.fieldSize.width; x++) {
            if (this.tiles[row][x]) {
                tiles.push(this.tiles[row][x]);
            }
        }

        return tiles;
    }

    public getColumn(column: number): ITile[] {
        const tiles = [];

        for (let y = 0; y < this.fieldSize.height; y++) {
            if (this.tiles[y][column]) {
                tiles.push(this.tiles[y][column]);
            }
        }

        return tiles;
    }

    private isCorrectPosition(position: Vec2): boolean {
        if (position.x < 0 || position.y < 0) {
            return false;
        }

        if (position.x >= this.fieldSize.width || position.y >= this.fieldSize.height) {
            return false;
        }

        return true;
    }
}
