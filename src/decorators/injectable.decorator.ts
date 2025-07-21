/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 */

import { Lifetime } from "src/DI/app-injector";
import { InjectorExplorer } from "src/DI/injector-explorer";
import { Type } from "src/utils/types";

/**
 * The Injectable decorator marks a class as injectable.
 * It allows the class to be registered in the dependency injection system.
 * A class decorated with @Injectable can be injected into other classes
 * either from the constructor of the class that needs it of from the `inject` function.
 * @param lifetime - The lifetime of the injectable. Can be 'singleton', 'scope', or 'transient'.
 */
export function Injectable(lifetime: Lifetime = 'scope'): ClassDecorator {
    return (target) => {
        if(typeof target !== 'function' || !target.prototype) {
            throw new Error(`@Injectable can only be used on classes, not on ${typeof target}`);
        }

        Reflect.defineMetadata(INJECTABLE_METADATA_KEY, lifetime, target);
        InjectorExplorer.register(target as unknown as Type<any>, lifetime);
    };
}

/**
 * Gets the injectable metadata for a given target class.
 * This metadata includes the lifetime of the injectable defined by the @Injectable decorator.
 * @param target - The target class to get the injectable metadata from.
 * @returns The lifetime of the injectable if it exists, otherwise undefined.
 */
export function getInjectableMetadata(target: Type<unknown>): Lifetime | undefined {
    return Reflect.getMetadata(INJECTABLE_METADATA_KEY, target);
}

export const INJECTABLE_METADATA_KEY = Symbol('INJECTABLE_METADATA_KEY');
