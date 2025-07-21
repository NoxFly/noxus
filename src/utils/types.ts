/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 */


/**
 * Represents a generic type that can be either a class or a function.
 * This is used to define types that can be instantiated or called.
 */
declare const Type: FunctionConstructor;
export interface Type<T> extends Function {
    // eslint-disable-next-line @typescript-eslint/prefer-function-type
    new (...args: any[]): T;
}

/**
 * Represents a generic type that can be either a value or a promise resolving to that value.
 */
export type MaybeAsync<T> = T | Promise<T>;
