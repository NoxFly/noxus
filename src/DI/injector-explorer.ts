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

/**
 * InjectorExplorer is a utility class that explores the dependency injection system at the startup.
 */
export class InjectorExplorer {
    /**
     * Registers the class as injectable.
     * When a class is instantiated, if it has dependencies and those dependencies
     * are listed using this method, they will be injected into the class constructor.
     */
    public static register(target: Type<unknown>, lifetime: Lifetime): typeof RootInjector {
        if(RootInjector.bindings.has(target)) // already registered
            return RootInjector;

        RootInjector.bindings.set(target, {
            implementation: target,
            lifetime
        });

        if(lifetime === 'singleton') {
            RootInjector.resolve(target);
        }

        if(getModuleMetadata(target)) {
            Logger.log(`${target.name} dependencies initialized`);
            return RootInjector;
        }

        const controllerMeta = getControllerMetadata(target);

        if(controllerMeta) {
            const router = RootInjector.resolve(Router);
            router?.registerController(target);
            return RootInjector;
        }

        const routeMeta = getRouteMetadata(target);

        if(routeMeta) {
            return RootInjector;
        }

        if(getInjectableMetadata(target)) {
            Logger.log(`Registered ${target.name} as ${lifetime}`);
            return RootInjector;
        }

        return RootInjector;
    }
}
