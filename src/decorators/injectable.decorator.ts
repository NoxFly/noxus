import { Lifetime } from "src/DI/app-injector";
import { InjectorExplorer } from "src/DI/injector-explorer";
import { Type } from "src/utils/types";

export function Injectable(lifetime: Lifetime = 'scope'): ClassDecorator {
    return (target) => {
        if(typeof target !== 'function' || !target.prototype) {
            throw new Error(`@Injectable can only be used on classes, not on ${typeof target}`);
        }

        Reflect.defineMetadata(INJECTABLE_METADATA_KEY, lifetime, target);
        InjectorExplorer.register(target as unknown as Type<any>, lifetime);
    };
}

export const INJECTABLE_METADATA_KEY = Symbol('INJECTABLE_METADATA_KEY');

export function getInjectableMetadata(target: Type<unknown>): Lifetime | undefined {
    return Reflect.getMetadata(INJECTABLE_METADATA_KEY, target);
}