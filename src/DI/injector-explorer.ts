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

    /**
     * Enqueues a class for deferred registration.
     * Called by the @Injectable decorator at import time. No instantiation occurs here.
     */
    public static enqueue(target: Type<unknown>, lifetime: Lifetime): void {
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
            if(lifetime === 'singleton') {
                RootInjector.resolve(target);
            }

            if(getModuleMetadata(target)) {
                Logger.log(`${target.name} dependencies initialized`);
                continue;
            }

            const controllerMeta = getControllerMetadata(target);

            if(controllerMeta) {
                const router = RootInjector.resolve(Router);
                router?.registerController(target);
                continue;
            }

            if(getRouteMetadata(target).length > 0) {
                continue;
            }

            if(getInjectableMetadata(target)) {
                Logger.log(`Registered ${target.name} as ${lifetime}`);
            }
        }

        queue.length = 0;
    }
}
