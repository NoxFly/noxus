/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 */

import { Type } from "./types";

/**
 * A function that returns a type.
 * Used for forward references to types that are not yet defined.
 */
export interface ForwardRefFn<T = any> {
    (): Type<T>;
}

/**
 * A wrapper class for forward referenced types.
 */
export class ForwardReference<T = any> {
    constructor(public readonly forwardRefFn: ForwardRefFn<T>) {}
}

/**
 * Creates a forward reference to a type.
 * @param fn A function that returns the type.
 * @returns A ForwardReference instance.
 */
export function forwardRef<T = any>(fn: ForwardRefFn<T>): ForwardReference<T> {
    return new ForwardReference(fn);
}
