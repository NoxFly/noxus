/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 */

import { Lifetime, RootInjector } from './app-injector';
import { TokenKey } from './token';
import { Type } from '../utils/types';
import { Logger } from '../utils/logger';
import { Guard, Middleware } from "src/main";

export interface PendingRegistration {
    key: TokenKey;
    implementation: Type<unknown>;
    lifetime: Lifetime;
    deps: ReadonlyArray<TokenKey>;
    isController: boolean;
    pathPrefix?: string;
}

/**
 * InjectorExplorer accumulates registrations emitted by decorators
 * at import time, then flushes them in two phases (bind → resolve)
 * once bootstrapApplication triggers processing.
 *
 * Because deps are now explicit arrays (no reflect-metadata), this class
 * no longer needs to introspect constructor parameter types.
 */
export class InjectorExplorer {
    private static readonly pending: PendingRegistration[] = [];
    private static processed = false;
    private static accumulating = false;

    // -------------------------------------------------------------------------
    // Public API
    // -------------------------------------------------------------------------

    public static enqueue(reg: PendingRegistration): void {
        if (InjectorExplorer.processed && !InjectorExplorer.accumulating) {
            InjectorExplorer._registerImmediate(reg);
            return;
        }
        InjectorExplorer.pending.push(reg);
    }

    /**
     * Two-phase flush of all pending registrations collected at startup.
     * Called by bootstrapApplication after app.whenReady().
     */
    public static processPending(singletonOverrides?: Map<TokenKey, unknown>): void {
        const queue = [...InjectorExplorer.pending];
        InjectorExplorer.pending.length = 0;

        InjectorExplorer._phaseOne(queue);
        InjectorExplorer._phaseTwo(queue, singletonOverrides);

        InjectorExplorer.processed = true;
    }

    /** Enters accumulation mode for lazy-loaded batches. */
    public static beginAccumulate(): void {
        InjectorExplorer.accumulating = true;
    }

    /**
     * Exits accumulation mode and flushes queued registrations
     * with the same two-phase guarantee as processPending.
     */
    public static flushAccumulated(
        routeGuards: Guard[] = [],
        routeMiddlewares: Middleware[] = [],
        pathPrefix = '',
    ): void {
        InjectorExplorer.accumulating = false;
        const queue = [...InjectorExplorer.pending];
        InjectorExplorer.pending.length = 0;
        InjectorExplorer._phaseOne(queue);

        // Stamp the path prefix on controller registrations
        for (const reg of queue) {
            if (reg.isController) reg.pathPrefix = pathPrefix;
        }

        InjectorExplorer._phaseTwo(queue, undefined, routeGuards, routeMiddlewares);
    }

    // -------------------------------------------------------------------------
    // Private helpers
    // -------------------------------------------------------------------------

    /** Phase 1: register all bindings without instantiating anything. */
    private static _phaseOne(queue: PendingRegistration[]): void {
        for (const reg of queue) {
            RootInjector.register(reg.key, reg.implementation, reg.lifetime, reg.deps);
        }
    }

    /** Phase 2: resolve singletons and register controllers in the router. */
    private static _phaseTwo(
        queue: PendingRegistration[],
        overrides?: Map<TokenKey, unknown>,
        routeGuards: Guard[] = [],
        routeMiddlewares: Middleware[] = [],
    ): void {
        for (const reg of queue) {
            // Apply value overrides (e.g. singleton instances provided via bootstrapApplication config)
            if (overrides?.has(reg.key)) {
                const override = overrides.get(reg.key);
                RootInjector.singletons.set(reg.key as any, override);
                Logger.log(`Registered ${reg.implementation.name} as singleton (overridden)`);
                continue;
            }

            if (reg.lifetime === 'singleton') {
                RootInjector.resolve(reg.key);
            }

            if (reg.isController) {
                // Lazily import Router to avoid circular dependency at module load time
                const { Router } = require('../router') as { Router: { prototype: { registerController(t: Type<unknown>): void } } };
                const router = RootInjector.resolve(Router as any) as { registerController(t: Type<unknown>, pathPrefix: string, routeGuards: Guard[], routeMiddlewares: Middleware[]): void };
                router.registerController(reg.implementation, reg.pathPrefix ?? '', routeGuards, routeMiddlewares);
            } else if (reg.lifetime !== 'singleton') {
                Logger.log(`Registered ${reg.implementation.name} as ${reg.lifetime}`);
            }
        }
    }

    private static _registerImmediate(reg: PendingRegistration): void {
        RootInjector.register(reg.key, reg.implementation, reg.lifetime, reg.deps);

        if (reg.lifetime === 'singleton') {
            RootInjector.resolve(reg.key);
        }

        if (reg.isController) {
            const { Router } = require('../router') as { Router: { prototype: { registerController(t: Type<unknown>): void } } };
            const router = RootInjector.resolve(Router as any) as { registerController(t: Type<unknown>): void };
            router.registerController(reg.implementation);
        }
    }
}
