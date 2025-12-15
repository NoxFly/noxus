/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 */

import { Lifetime } from "src/DI/app-injector";
import { InjectorExplorer } from "src/DI/injector-explorer";
import { defineInjectableMetadata } from "src/decorators/injectable.metadata";
import { Type } from "src/main";
export { getInjectableMetadata, hasInjectableMetadata, INJECTABLE_METADATA_KEY } from "src/decorators/injectable.metadata";

/**
 * The Injectable decorator marks a class as injectable.
 * It allows the class to be registered in the dependency injection system.
 * A class decorated with @Injectable can be injected into other classes
 * either from the constructor of the class that needs it of from the `inject` function.
 * @param lifetime - The lifetime of the injectable. Can be 'singleton', 'scope', or 'transient'.
 */
export function Injectable(lifetime: Lifetime = "scope"): ClassDecorator {
    return (target) => {
        if (typeof target !== "function" || !target.prototype) {
            throw new Error(`@Injectable can only be used on classes, not on ${typeof target}`);
        }
        defineInjectableMetadata(target, lifetime);
        InjectorExplorer.register(target as unknown as Type<any>, lifetime);
    };
}
