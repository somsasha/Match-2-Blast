import { Mat4, Mesh, Node, Vec2, Vec3, Tween } from "cc";

export default class Utilities {

    public static traverse(node: Node, callback?: (n: Node) => void) {
        node.children.forEach((c) => {
            callback(c);
            this.traverse(c, callback);
        });
    }

    public static isEquals(a: number, b: number, precision: number = Number.EPSILON): boolean {
        return Math.abs(a - b) < precision;
    }

    static randomItem<T>(items: T[]): T {
        return items[Math.floor(Math.random() * items.length)];
    }

    static isUndefinedOrNull(v: any) {
        return v === undefined || v === null;
    }

    static removeTween(tween: Tween<any>) {
        if (tween) {
            tween.stop();
        }

        tween = null;

        return tween;
    }

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

    static roundVec2(out: Vec2, round: number = 0): void {
        const coef = Math.pow(10, round);
        out.x = Math.round(out.x * coef) / coef;
        out.y = Math.round(out.y * coef) / coef;
    }

    static clamp(value: number, min: number, max: number): number {
        return Math.min(Math.max(value, min), max);
    }

    static toString(value: number): string {
        return `${value}`;
    }

    static getRandomElementFromArray<T>(array: T[]): T {
        const index: number = this.getRandomInt(0, array.length);
        return array[index];
    }

    static getType(obj: any): string {
        return obj ? obj.__proto__.constructor.name : obj;
    }

    static getWorldAngle(node: Node): number {
        let worldAngle = node.angle;
        let parent = node.parent;

        while (parent) {
            worldAngle += parent.angle;
            parent = parent.parent;
        }

        return worldAngle;
    }

    static getWorldScale(node: Node): Vec3 {
        let worldScale = node.getScale(new Vec3());
        let parent = node.parent;

        while (parent) {
            worldScale = worldScale.multiply(parent.getScale(new Vec3()));
            parent = parent.parent;
        }

        return worldScale;
    }

    static moveTowards(startPosition: Vec2, endPosition: Vec2, maxDistanceDelta: number): Vec2 {
        const direction: Vec2 = endPosition.subtract(startPosition).normalize();

        let step: Vec2 = direction.multiplyScalar(maxDistanceDelta);

        if (startPosition.x < endPosition.x) {
            if ((startPosition.x + step.x) > endPosition.x) {
                step.x = endPosition.x - startPosition.x;
            }

            if ((startPosition.y + step.y) > endPosition.y) {
                step.y = endPosition.y - startPosition.y;
            }
        } else {
            if ((startPosition.x + step.x) < endPosition.x) {
                step.x = endPosition.x - startPosition.x;
            }

            if ((startPosition.y + step.y) < endPosition.y) {
                step.y = endPosition.y - startPosition.y;
            }
        }


        return startPosition.add(step);
    }

    static moveTowards3(startPosition: Vec3, endPosition: Vec3, maxDistanceDelta: number): Vec3 {
        const direction: Vec3 = endPosition.subtract(startPosition).normalize();

        let step: Vec3 = direction.multiplyScalar(maxDistanceDelta);

        if (startPosition.x < endPosition.x) {
            if ((startPosition.x + step.x) > endPosition.x) {
                step.x = endPosition.x - startPosition.x;
            }

            if ((startPosition.y + step.y) > endPosition.y) {
                step.y = endPosition.y - startPosition.y;
            }

            if ((startPosition.z + step.z) > endPosition.z) {
                step.z = endPosition.z - startPosition.z;
            }
        } else {
            if ((startPosition.x + step.x) < endPosition.x) {
                step.x = endPosition.x - startPosition.x;
            }

            if ((startPosition.y + step.y) < endPosition.y) {
                step.y = endPosition.y - startPosition.y;
            }

            if ((startPosition.z + step.z) < endPosition.z) {
                step.z = endPosition.z - startPosition.z;
            }
        }


        return startPosition.add(step);
    }

    static speedLerp(current: number, end: number, speed: number, dt: number, isNeedToEquate: boolean = false): number {
        let result = current;

        const delta = dt * speed;

        if (result > end) {
            result = result - delta;

            if (isNeedToEquate && result < end) {
                result = end;
            }
        } else {
            result = result + delta;

            if (isNeedToEquate && result > end) {
                result = end;
            }
        }

        return result;
    }

    static compareToFloatsWithPrecision(f1: number, f2: number, p: number = 100) {
        return ((Math.round(f1 * p) / p === Math.round(f2 * p) / p))
    }
}
