/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 */

import { getControllerMetadata } from "src/decorators/controller.decorator";
import { getInjectableMetadata } from "src/decorators/injectable.metadata";
import { getRouteMetadata } from "src/decorators/method.decorator";
import { getModuleMetadata } from "src/decorators/module.decorator";
import { Lifetime, RootInjector } from "src/DI/app-injector";
import { Router } from "src/router";
import { Logger } from "src/utils/logger";
import { Type } from "src/utils/types";

interface PendingRegistration {
    target: Type<unknown>;
    lifetime: Lifetime;
}

/**
 * InjectorExplorer is a utility class that explores the dependency injection system at the startup.
 * It collects decorated classes during the import phase and defers their actual registration
 * and resolution to when {@link processPending} is called by bootstrapApplication.
 */
export class InjectorExplorer {
    private static readonly pending: PendingRegistration[] = [];
    private static processed = false;

    /**
     * Enqueues a class for deferred registration.
     * Called by the @Injectable decorator at import time.
     *
     * If {@link processPending} has already been called (i.e. after bootstrap),
     * the class is registered immediately so that late dynamic imports
     * (e.g. middlewares loaded after bootstrap) work correctly.
     */
    public static enqueue(target: Type<unknown>, lifetime: Lifetime): void {
        if(InjectorExplorer.processed) {
            InjectorExplorer.registerImmediate(target, lifetime);
            return;
        }

        InjectorExplorer.pending.push({ target, lifetime });
    }

    /**
     * Processes all pending registrations in two phases:
     * 1. Register all bindings (no instantiation) so every dependency is known.
     * 2. Resolve singletons, register controllers and log module readiness.
     *
     * This two-phase approach makes the system resilient to import ordering:
     * all bindings exist before any singleton is instantiated.
     */
    public static processPending(): void {
        const queue = InjectorExplorer.pending;

        // Phase 1: register all bindings without instantiation
        for(const { target, lifetime } of queue) {
            if(!RootInjector.bindings.has(target)) {
                RootInjector.bindings.set(target, {
                    implementation: target,
                    lifetime
                });
            }
        }

        // Phase 2: resolve singletons, register controllers, log modules
        for(const { target, lifetime } of queue) {
            InjectorExplorer.processRegistration(target, lifetime);
        }

        queue.length = 0;
        InjectorExplorer.processed = true;
    }

    /**
     * Registers a single class immediately (post-bootstrap path).
     * Used for classes discovered via late dynamic imports.
     */
    private static registerImmediate(target: Type<unknown>, lifetime: Lifetime): void {
        if(RootInjector.bindings.has(target)) {
            return;
        }

        RootInjector.bindings.set(target, {
            implementation: target,
            lifetime
        });

        InjectorExplorer.processRegistration(target, lifetime);
    }

    /**
     * Performs phase-2 work for a single registration: resolve singletons,
     * register controllers, and log module readiness.
     */
    private static processRegistration(target: Type<unknown>, lifetime: Lifetime): void {
        if(lifetime === 'singleton') {
            RootInjector.resolve(target);
        }

        if(getModuleMetadata(target)) {
            Logger.log(`${target.name} dependencies initialized`);
            return;
        }

        const controllerMeta = getControllerMetadata(target);

        if(controllerMeta) {
            const router = RootInjector.resolve(Router);
            router?.registerController(target);
            return;
        }

        if(getRouteMetadata(target).length > 0) {
            return;
        }

        if(getInjectableMetadata(target)) {
            Logger.log(`Registered ${target.name} as ${lifetime}`);
        }
    }
}
