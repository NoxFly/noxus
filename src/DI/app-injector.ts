/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 */

import { ForwardReference } from '../utils/forward-ref';
import { Type } from '../utils/types';
import { Token, TokenKey } from './token';

/**
 * Lifetime of a binding in the DI container.
 * - singleton: created once, shared for the lifetime of the app.
 * - scope:     created once per request scope.
 * - transient: new instance every time it is resolved.
 */
export type Lifetime = 'singleton' | 'scope' | 'transient';

/**
 * Internal representation of a registered binding.
 */
export interface IBinding<T = unknown> {
    lifetime: Lifetime;
    implementation: Type<T>;
    /** Explicit constructor dependencies, declared by the class itself. */
    deps: ReadonlyArray<TokenKey>;
    instance?: T;
}

function keyOf<T>(k: TokenKey<T>): Type<T> | Token<T> {
    return k;
}

/**
 * AppInjector is the core DI container.
 * It no longer uses reflect-metadata — all dependency information
 * comes from explicitly declared `deps` arrays on each binding.
 */
export class AppInjector {
    public readonly bindings = new Map<Type<unknown> | Token<unknown>, IBinding<unknown>>();
    public readonly singletons = new Map<Type<unknown> | Token<unknown>, unknown>();
    public readonly scoped = new Map<Type<unknown> | Token<unknown>, unknown>();

    constructor(public readonly name: string | null = null) {}

    /**
     * Creates a child scope for per-request lifetime resolution.
     */
    public createScope(): AppInjector {
        const scope = new AppInjector();
        (scope as any).bindings = this.bindings;
        (scope as any).singletons = this.singletons;
        return scope;
    }

    /**
     * Registers a binding explicitly.
     */
    public register<T>(
        key: TokenKey<T>,
        implementation: Type<T>,
        lifetime: Lifetime,
        deps: ReadonlyArray<TokenKey> = [],
    ): void {
        const k = keyOf(key) as TokenKey<unknown>;
        if (!this.bindings.has(k)) {
            this.bindings.set(k, { lifetime, implementation: implementation as Type<unknown>, deps });
        }
    }

    /**
     * Resolves a dependency by token or class reference.
     */
    public resolve<T>(target: TokenKey<T> | ForwardReference<T>): T {
        if (target instanceof ForwardReference) {
            return this._resolveForwardRef(target);
        }

        const k = keyOf(target) as TokenKey<unknown>;

        if (this.singletons.has(k)) {
            return this.singletons.get(k) as T;
        }

        const binding = this.bindings.get(k);

        if (!binding) {
            const name = target instanceof Token
                ? target.description
                : (target as Type<unknown>).name
                ?? 'unknown';

            throw new Error(
                `[Noxus DI] No binding found for "${name}".\n`
                + `Did you forget to declare it in @Injectable({ deps }) or in bootstrapApplication({ singletons })?`,
            );
        }

        switch (binding.lifetime) {
            case 'transient':
                return this._instantiate(binding) as T;

            case 'scope': {
                if (this.scoped.has(k)) return this.scoped.get(k) as T;
                const inst = this._instantiate(binding);
                this.scoped.set(k, inst);
                return inst as T;
            }

            case 'singleton': {
                if (this.singletons.has(k)) return this.singletons.get(k) as T;
                const inst = this._instantiate(binding);
                this.singletons.set(k, inst);
                if (binding.instance === undefined) {
                    (binding as IBinding<unknown>).instance = inst as unknown;
                }
                return inst as T;
            }
        }
    }

    // -------------------------------------------------------------------------

    private _resolveForwardRef<T>(ref: ForwardReference<T>): T {
        let resolved: T | undefined;
        return new Proxy({} as object, {
            get: (_obj, prop, receiver) => {
                resolved ??= this.resolve(ref.forwardRefFn()) as T;
                const value = Reflect.get(resolved as object, prop, receiver);
                return typeof value === 'function' ? (value as Function).bind(resolved) : value;
            },
            set: (_obj, prop, value, receiver) => {
                resolved ??= this.resolve(ref.forwardRefFn()) as T;
                return Reflect.set(resolved as object, prop, value, receiver);
            },
            getPrototypeOf: () => {
                resolved ??= this.resolve(ref.forwardRefFn()) as T;
                return Object.getPrototypeOf(resolved);
            },
        }) as T;
    }

    private _instantiate<T>(binding: IBinding<T>): T {
        const resolvedDeps = binding.deps.map((dep) => this.resolve(dep));
        return new binding.implementation(...resolvedDeps) as T;
    }
}

/**
 * The global root injector. All singletons live here.
 */
export const RootInjector = new AppInjector('root');

/**
 * Resets the root injector to a clean state.
 * **Intended for testing only** — clears all bindings, singletons, and scoped instances
 * so that each test can start from a fresh DI container without restarting the process.
 */
export function resetRootInjector(): void {
    RootInjector.bindings.clear();
    RootInjector.singletons.clear();
    RootInjector.scoped.clear();
    // Lazy import to avoid circular dependency (InjectorExplorer → app-injector → InjectorExplorer)
    const { InjectorExplorer } = require('./injector-explorer') as typeof import('./injector-explorer');
    InjectorExplorer.reset();
}

/**
 * Convenience function: resolve a token from the root injector.
 */
export function inject<T>(t: TokenKey<T> | ForwardReference<T>): T {
    return RootInjector.resolve(t);
}
