import { Vec2 } from "cc";

export default class Utilities {
    static getRandomInt(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);

        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static getRandomFloat(min: number, max: number): number {
        return Math.random() * (max - min + 1) + min;
    }

    static getRandomVec2(min: Vec2, max: Vec2): Vec2 {
        const vector = new Vec2(this.getRandomFloat(min.x, max.x), this.getRandomFloat(min.y, max.y));

        return vector;
    }
}
