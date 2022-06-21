import { Component, _decorator } from "cc";
import Pool from "./Pool";

const { ccclass } = _decorator;

@ccclass
export default class PoolElement extends Component {
    public pool: Pool = null;
    public inPool: boolean = true;

    public returnToPool(): void {
        if (this.inPool) return;

        this.inPool = true;
        this.pool.push(this.node);
    }
}
