/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 */

import { Lifetime, RootInjector } from './app-injector';
import { TokenKey } from './token';
import { Type } from '../utils/types';
import { Logger } from '../utils/logger';
import { Guard } from '../decorators/guards.decorator';
import { Middleware } from '../decorators/middleware.decorator';

export interface PendingRegistration {
    key: TokenKey;
    implementation: Type<unknown>;
    lifetime: Lifetime;
    deps: ReadonlyArray<TokenKey>;
    isController: boolean;
    pathPrefix?: string;
}

/**
 * Callback invoked for each controller registration discovered during flush.
 * Decouples InjectorExplorer from the Router to avoid circular imports.
 */
export type ControllerRegistrar = (
    controllerClass: Type<unknown>,
    pathPrefix: string,
    routeGuards: Guard[],
    routeMiddlewares: Middleware[],
) => void;

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
    private static loadingLock: Promise<void> = Promise.resolve();
    private static controllerRegistrar: ControllerRegistrar | null = null;

    // -------------------------------------------------------------------------
    // Public API
    // -------------------------------------------------------------------------

    /**
     * Sets the callback used to register controllers.
     * Must be called once before processPending (typically by bootstrapApplication).
     */
    public static setControllerRegistrar(registrar: ControllerRegistrar): void {
        InjectorExplorer.controllerRegistrar = registrar;
    }

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
     * Serialised through a lock to prevent concurrent lazy loads from corrupting the queue.
     */
    public static flushAccumulated(
        routeGuards: Guard[] = [],
        routeMiddlewares: Middleware[] = [],
        pathPrefix = '',
    ): Promise<void> {
        InjectorExplorer.loadingLock = InjectorExplorer.loadingLock.then(() => {
            InjectorExplorer.accumulating = false;
            const queue = [...InjectorExplorer.pending];
            InjectorExplorer.pending.length = 0;
            InjectorExplorer._phaseOne(queue);

            // Stamp the path prefix on controller registrations
            for (const reg of queue) {
                if (reg.isController) reg.pathPrefix = pathPrefix;
            }

            InjectorExplorer._phaseTwo(queue, undefined, routeGuards, routeMiddlewares);
        });

        return InjectorExplorer.loadingLock;
    }

    /**
     * Returns a Promise that resolves once all pending flushAccumulated calls
     * have completed. Useful for awaiting lazy-load serialisation.
     */
    public static waitForFlush(): Promise<void> {
        return InjectorExplorer.loadingLock;
    }

    /**
     * Resets the explorer state. Intended for tests only.
     */
    public static reset(): void {
        InjectorExplorer.pending.length = 0;
        InjectorExplorer.processed = false;
        InjectorExplorer.accumulating = false;
        InjectorExplorer.loadingLock = Promise.resolve();
        InjectorExplorer.controllerRegistrar = null;
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

    /** Phase 2: validate deps, resolve singletons and register controllers via the registrar callback. */
    private static _phaseTwo(
        queue: PendingRegistration[],
        overrides?: Map<TokenKey, unknown>,
        routeGuards: Guard[] = [],
        routeMiddlewares: Middleware[] = [],
    ): void {
        // Early dependency validation: warn about deps that have no binding
        for (const reg of queue) {
            for (const dep of reg.deps) {
                if (!RootInjector.bindings.has(dep as any) && !RootInjector.singletons.has(dep as any)) {
                    Logger.warn(`[Noxus DI] "${reg.implementation.name}" declares dep "${(dep as any).name ?? dep}" which has no binding`);
                }
            }
        }

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
                if (!InjectorExplorer.controllerRegistrar) {
                    throw new Error('[Noxus DI] No controller registrar set. Call InjectorExplorer.setControllerRegistrar() before processing.');
                }
                InjectorExplorer.controllerRegistrar(
                    reg.implementation,
                    reg.pathPrefix ?? '',
                    routeGuards,
                    routeMiddlewares,
                );
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

        if (reg.isController && InjectorExplorer.controllerRegistrar) {
            InjectorExplorer.controllerRegistrar(reg.implementation, '', [], []);
        }
    }
}
