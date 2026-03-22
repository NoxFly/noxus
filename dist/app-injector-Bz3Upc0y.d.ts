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
 * A DI token uniquely identifies a dependency.
 * It can wrap a class (Type<T>) or be a named symbol token.
 *
 * Using tokens instead of reflect-metadata means dependencies are
 * declared explicitly — no magic type inference, no emitDecoratorMetadata.
 *
 * @example
 * // Class token (most common)
 * const MY_SERVICE = token(MyService);
 *
 * // Named symbol token (for interfaces or non-class values)
 * const DB_URL = token<string>('DB_URL');
 */
declare class Token<T> {
    readonly target: Type<T> | string;
    readonly description: string;
    constructor(target: Type<T> | string);
    toString(): string;
}
/**
 * Creates a DI token for a class type or a named value.
 *
 * @example
 * export const MY_SERVICE = token(MyService);
 * export const DB_URL = token<string>('DB_URL');
 */
declare function token<T>(target: Type<T> | string): Token<T>;
/**
 * The key used to look up a class token in the registry.
 * For class tokens, the key is the class constructor itself.
 * For named tokens, the key is the Token instance.
 */
type TokenKey<T = unknown> = Type<T> | Token<T>;


/**
 * Lifetime of a binding in the DI container.
 * - singleton: created once, shared for the lifetime of the app.
 * - scope:     created once per request scope.
 * - transient: new instance every time it is resolved.
 */
type Lifetime = 'singleton' | 'scope' | 'transient';
/**
 * Internal representation of a registered binding.
 */
interface IBinding<T = unknown> {
    lifetime: Lifetime;
    implementation: Type<T>;
    /** Explicit constructor dependencies, declared by the class itself. */
    deps: ReadonlyArray<TokenKey>;
    instance?: T;
}
/**
 * AppInjector is the core DI container.
 * It no longer uses reflect-metadata — all dependency information
 * comes from explicitly declared `deps` arrays on each binding.
 */
declare class AppInjector {
    readonly name: string | null;
    readonly bindings: Map<Type<unknown> | Token<unknown>, IBinding<unknown>>;
    readonly singletons: Map<Type<unknown> | Token<unknown>, unknown>;
    readonly scoped: Map<Type<unknown> | Token<unknown>, unknown>;
    constructor(name?: string | null);
    /**
     * Creates a child scope for per-request lifetime resolution.
     */
    createScope(): AppInjector;
    /**
     * Registers a binding explicitly.
     */
    register<T>(key: TokenKey<T>, implementation: Type<T>, lifetime: Lifetime, deps?: ReadonlyArray<TokenKey>): void;
    /**
     * Resolves a dependency by token or class reference.
     */
    resolve<T>(target: TokenKey<T> | ForwardReference<T>): T;
    private _resolveForwardRef;
    private _instantiate;
}
/**
 * The global root injector. All singletons live here.
 */
declare const RootInjector: AppInjector;
/**
 * Convenience function: resolve a token from the root injector.
 */
declare function inject<T>(t: TokenKey<T> | ForwardReference<T>): T;

export { AppInjector as A, type ForwardRefFn as F, type IBinding as I, type Lifetime as L, type MaybeAsync as M, RootInjector as R, type Type as T, type TokenKey as a, ForwardReference as b, Token as c, forwardRef as f, inject as i, token as t };
