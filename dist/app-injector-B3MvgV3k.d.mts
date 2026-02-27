/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 */
interface Type<T> extends Function {
    new (...args: any[]): T;
}
/**
 * Represents a generic type that can be either a value or a promise resolving to that value.
 */
type MaybeAsync<T> = T | Promise<T>;


/**
 * A function that returns a type.
 * Used for forward references to types that are not yet defined.
 */
interface ForwardRefFn<T = any> {
    (): Type<T>;
}
/**
 * A wrapper class for forward referenced types.
 */
declare class ForwardReference<T = any> {
    readonly forwardRefFn: ForwardRefFn<T>;
    constructor(forwardRefFn: ForwardRefFn<T>);
}
/**
 * Creates a forward reference to a type.
 * @param fn A function that returns the type.
 * @returns A ForwardReference instance.
 */
declare function forwardRef<T = any>(fn: ForwardRefFn<T>): ForwardReference<T>;


/**
 * Represents a lifetime of a binding in the dependency injection system.
 * It can be one of the following:
 * - 'singleton': The instance is created once and shared across the application.
 * - 'scope': The instance is created once per scope (e.g., per request).
 * - 'transient': A new instance is created every time it is requested.
 */
type Lifetime = 'singleton' | 'scope' | 'transient';
/**
 * Represents a binding in the dependency injection system.
 * It contains the lifetime of the binding, the implementation type, and optionally an instance.
 */
interface IBinding {
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
declare class AppInjector {
    readonly name: string | null;
    bindings: Map<Type<unknown>, IBinding>;
    singletons: Map<Type<unknown>, unknown>;
    scoped: Map<Type<unknown>, unknown>;
    constructor(name?: string | null);
    /**
     * Typically used to create a dependency injection scope
     * at the "scope" level (i.e., per-request lifetime).
     *
     * SHOULD NOT BE USED by anything else than the framework itself.
     */
    createScope(): AppInjector;
    /**
     * Called when resolving a dependency,
     * i.e., retrieving the instance of a given class.
     */
    resolve<T>(target: Type<T> | ForwardReference<T>): T;
    /**
     * Instantiates a class, resolving its dependencies.
     */
    private instantiate;
}
/**
 * Injects a type from the dependency injection system.
 * This function is used to retrieve an instance of a type that has been registered in the dependency injection system.
 * It is typically used in the constructor of a class to inject dependencies.
 * @param t - The type to inject.
 * @returns An instance of the type.
 * @throws If the type is not registered in the dependency injection system.
 */
declare function inject<T>(t: Type<T> | ForwardReference<T>): T;
declare const RootInjector: AppInjector;

export { AppInjector as A, type ForwardRefFn as F, type IBinding as I, type Lifetime as L, type MaybeAsync as M, RootInjector as R, type Type as T, ForwardReference as a, forwardRef as f, inject as i };
