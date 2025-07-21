/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 */

import 'reflect-metadata';
import { InternalServerException } from 'src/exceptions';
import { Type } from 'src/utils/types';

/**
 * Represents a lifetime of a binding in the dependency injection system.
 * It can be one of the following:
 * - 'singleton': The instance is created once and shared across the application.
 * - 'scope': The instance is created once per scope (e.g., per request).
 * - 'transient': A new instance is created every time it is requested.
 */
export type Lifetime = 'singleton' | 'scope' | 'transient';

/**
 * Represents a binding in the dependency injection system.
 * It contains the lifetime of the binding, the implementation type, and optionally an instance.
 */
export interface IBinding {
    lifetime: Lifetime;
    implementation: Type<unknown>;
    instance?: InstanceType<Type<unknown>>;
}

/**
 * AppInjector is the root dependency injection container.
 * It is used to register and resolve dependencies in the application.
 * It supports different lifetimes for dependencies:
 * This should not be manually instantiated, outside of the framework.
 * Use the `RootInjector` instance instead.
 */
export class AppInjector {
    public bindings = new Map<Type<unknown>, IBinding>();
    public singletons = new Map<Type<unknown>, InstanceType<Type<unknown>>>();
    public scoped = new Map<Type<unknown>, InstanceType<Type<unknown>>>();

    constructor(
        public readonly name: string | null = null,
    ) {}

    /**
     * Typically used to create a dependency injection scope
     * at the "scope" level (i.e., per-request lifetime).
     *
     * SHOULD NOT BE USED by anything else than the framework itself.
     */
    public createScope(): AppInjector {
        const scope = new AppInjector();
        scope.bindings = this.bindings; // pass injectable declarations
        scope.singletons = this.singletons; // share parent's singletons to avoid recreating them
        // do not keep parent's scoped instances
        return scope;
    }

    /**
     * Called when resolving a dependency,
     * i.e., retrieving the instance of a given class.
     */
    public resolve<T extends Type<unknown>>(target: T): InstanceType<T> {
        const binding = this.bindings.get(target);

        if(!binding)
            throw new InternalServerException(
                `Failed to resolve a dependency injection : No binding for type ${target.name}.\n`
                + `Did you forget to use @Injectable() decorator ?`
            );

        switch(binding.lifetime) {
            case 'transient':
                return this.instantiate(binding.implementation) as InstanceType<T>;

            case 'scope': {
                if(this.scoped.has(target)) {
                    return this.scoped.get(target) as InstanceType<T>;
                }

                const instance = this.instantiate(binding.implementation);
                this.scoped.set(target, instance);

                return instance as InstanceType<T>;
            }

            case 'singleton': {
                if(binding.instance === undefined && this.name === 'root') {
                    binding.instance = this.instantiate(binding.implementation);
                    this.singletons.set(target, binding.instance);
                }

                return binding.instance as InstanceType<T>;
            }
        }
    }

    /**
     *
     */
    private instantiate<T extends Type<unknown>>(target: T): InstanceType<T> {
        const paramTypes = Reflect.getMetadata('design:paramtypes', target) || [];
        const params = paramTypes.map((p: any) => this.resolve(p));
        return new target(...params) as InstanceType<T>;
    }
}

/**
 * Injects a type from the dependency injection system.
 * This function is used to retrieve an instance of a type that has been registered in the dependency injection system.
 * It is typically used in the constructor of a class to inject dependencies.
 * @param t - The type to inject.
 * @returns An instance of the type.
 * @throws If the type is not registered in the dependency injection system.
 */
export function inject<T>(t: Type<T>): T {
    return RootInjector.resolve(t);
}

export const RootInjector = new AppInjector('root');
