import type { Lifetime } from "src/DI/app-injector";

export const INJECTABLE_METADATA_KEY = Symbol("INJECTABLE_METADATA_KEY");

export function defineInjectableMetadata(target: Function, lifetime: Lifetime): void {
    Reflect.defineMetadata(INJECTABLE_METADATA_KEY, lifetime, target);
}

export function getInjectableMetadata(target: Function): Lifetime | undefined {
    return Reflect.getMetadata(INJECTABLE_METADATA_KEY, target) as Lifetime | undefined;
}

export function hasInjectableMetadata(target: Function): boolean {
    return Reflect.hasMetadata(INJECTABLE_METADATA_KEY, target);
}
