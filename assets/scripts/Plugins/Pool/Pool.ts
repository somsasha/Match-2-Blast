import { director, instantiate, Node } from "cc";

import PoolElement from "./PoolElement";


export default class Pool {
    private static pools: Pool[] = [];

    private elements: Node[] = [];

    public element: any = null;
    public instantiateCount: number = 0;
    public name: string = '';

    constructor(element: any, instantiateCount: number = 1, name?: string) {
        if (!element) return;

        const pool = Pool.pools.find(p => p.element === element);
        if (pool !== undefined) {
            return pool;
        }

        Pool.pools.push(this);

        this.element = element;
        this.instantiateCount = instantiateCount;
        this.name = name || this.element.name || 'Pool';

        for (let i = 0; i < this.instantiateCount; i++) {
            this.elements.push(this.createElement());
        }
    }

    public static getPoolByName(name: number, pools?: Pool[]): Pool {
        return (pools || Pool.pools).find(p => p.name === '' + (name - 1));
    }

    private createElement(): Node {
        const element = instantiate(this.element);
        element.setParent(director.getScene());
        element.active = false;

        const elementComponent = element.addComponent(PoolElement);
        elementComponent.inPool = true;
        elementComponent.pool = this;

        return element;
    }

    public pop(): Node {
        const element = this.elements.length ? this.elements.pop() : this.createElement();
        const elementComponent = element.getComponent(PoolElement);
        elementComponent.inPool = false;

        return element
    }

    public push(element: Node): void {
        element.active = false;
        this.elements.push(element);
    }
}
