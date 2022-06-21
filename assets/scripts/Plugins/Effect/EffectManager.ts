import { _decorator, Node, Vec2, Enum, Prefab, Component, ParticleSystem2D, CCInteger, ParticleSystem } from "cc";

import Pool from "../Pool/Pool";
import Events from "../../Enums/Events";
import PoolElement from "../Pool/PoolElement";
import Effects from "./Effects";
import { GlobalEvent } from "../GlobalEvent";


export interface IEffectParams {
    parent?: Node,
    position?: Vec2,
    scale?: number,
}


const { ccclass, property, executeInEditMode } = _decorator;


@ccclass('EffectSettings')
export class EffectSettings {
    @property({ type: Enum(Effects), readonly: true }) effect: Effects = Effects.None;
    @property(Prefab) prefab: Prefab = null;
    @property(CCInteger) instantiateCount: number = 1;

    @property({ visible: false }) effectKey: string = '';
}


@ccclass
export default class EffectManager extends Component {

    // #region cocos editor fields

    @property([EffectSettings]) effects: EffectSettings[] = [];

    // #endregion


    // #region private fields

    private static instance: EffectManager = null;
    private static pools: Pool[] = [];

    // #endregion


    // #region life-cycles callbacks

    protected onLoad(): void {
        // if (CC_EDITOR) {
        //     this.initializeEffects();
        //     return;
        // }

        EffectManager.instance = this;

        this.createPools();

        GlobalEvent.getInstance().on(Events.EFFECT_SPAWN.toString(), this.onEffectSpawn, this);
    }

    // #endregion


    // #region public methods

    public static spawn(
        name: number,
        allParamsOrParent: IEffectParams | Node,
        effectPosition: Vec2,
        effectScale: number
    ): Node {
        const effect = EffectManager.createEffect(name, allParamsOrParent, effectPosition, effectScale);
        EffectManager.play(effect);
        return effect;
    }

    public static play(effect: Node, isReturnToPool: boolean = false): void {
        const emitters = effect.children;
        let maxDuration = 0;
        if (emitters.length > 0) {
            for (const emitter of emitters) {
                EffectManager.startParticleSystem(emitter);
                maxDuration = Math.max(maxDuration, EffectManager.getEmitterDuration(emitter))
            }
        } else {
            EffectManager.startParticleSystem(effect);
            maxDuration = EffectManager.getEmitterDuration(effect);
        }

        if (maxDuration === Infinity || !isReturnToPool) return;

        EffectManager.instance.scheduleOnce(() => {
            const poolElement = effect.getComponent(PoolElement);
            poolElement && poolElement.returnToPool();
        }, maxDuration);
    }

    public static stop(effect: Node): void {
        const emitters = effect.children;

        if (emitters.length > 0) {
            for (const emitter of emitters) {
                EffectManager.stopParticleSystem(emitter);
            }
        } else {
            EffectManager.stopParticleSystem(effect);
        }
    }

    // #endregion


    // #region private methods

    private initializeEffects(): void {
        const keys = Object.keys(Effects);

        for (let i = 0, length = this.effects.length; i < length; i++) {
            if (keys.find(k => k === this.effects[i].effectKey) === undefined) {
                this.effects.splice(i, 1);
                i--;
                length--;
            }
        }

        for (let i = 1, length = keys.length; i < length; i++) {
            let effectSettings = this.effects.find(e => e.effectKey === keys[i]);

            if (effectSettings === undefined) {
                effectSettings = new EffectSettings();
                effectSettings.effect = Effects[keys[i]];
                effectSettings.effectKey = keys[i];

                this.effects.push(effectSettings);
            } else {
                effectSettings.effect = Effects[effectSettings.effectKey];
            }
        }
    }

    private createPools(): void {
        for (const effect of this.effects) {
            if (!effect.prefab) continue;

            const pool = new Pool(effect.prefab, effect.instantiateCount, effect.effect.toString());
            EffectManager.pools.push(pool);
        }
    }

    private static createEffect(
        name: number,
        allParamsOrParent: IEffectParams | Node = EffectManager.instance.node,
        effectPosition: Vec2 = Vec2.ZERO,
        effectScale: number = 1
    ): Node {
        const pool = Pool.getPoolByName(name, EffectManager.pools);
        if (pool === undefined) return;

        let position: Vec2 = effectPosition;
        let scale: number = effectScale;
        let parent: Node;

        if (allParamsOrParent instanceof Node) {
            parent = allParamsOrParent;
        } else if (allParamsOrParent) {
            if (allParamsOrParent.parent) parent = allParamsOrParent.parent;
            if (allParamsOrParent.position) position = allParamsOrParent.position;
            if (allParamsOrParent.scale) scale = allParamsOrParent.scale;
        }

        if (!parent) {
            parent = EffectManager.instance.node;
        }

        const effect = pool.pop();
        effect.setParent(parent);
        effect.setPosition(position.x, position.y, position.z ? position.z : 0);
        effect.setScale(scale, scale, scale);
        effect.active = true;

        return effect;
    }

    private static startParticleSystem(node: Node): void {
        const particleSystem = node.getComponent(ParticleSystem2D);
        if (particleSystem) {
            particleSystem.resetSystem();
        } else {
            const particleSystem3d = node.getComponent(ParticleSystem);
            particleSystem3d && particleSystem3d.play();
        }
    }

    private static stopParticleSystem(node: Node): void {
        const particleSystem = node.getComponent(ParticleSystem2D);
        particleSystem && particleSystem.stopSystem();
    }

    private static getEmitterDuration(node: Node): number {
        const particleSystem = node.getComponent(ParticleSystem2D);
        if (particleSystem) {
            const particleDuration = particleSystem.duration;

            if (particleDuration === -1) {
                return Infinity;
            }

            const minParticleLife = particleSystem.life - particleSystem.lifeVar;
            const maxParticleLife = particleSystem.life + particleSystem.lifeVar;

            return maxParticleLife + (particleDuration < minParticleLife ? 0 : particleDuration);
        } else {
            const particleSystem3d = node.getComponent(ParticleSystem);
            const particleDuration = particleSystem3d.duration;

            if (particleDuration === -1) {
                return Infinity;
            }

            const maxParticleLife = particleSystem3d.startLifetime.getMax();

            return maxParticleLife + particleDuration;
        }
    }

    // #endregion


    // #region event handlers

    private onEffectSpawn(
        name: number,
        allParamsOrParent: IEffectParams | Node,
        effectPosition: Vec2,
        effectScale: number
    ): void {
        const effect = EffectManager.createEffect(name, allParamsOrParent, effectPosition, effectScale);
        EffectManager.play(effect, true);
    }

    // #endregion
}
