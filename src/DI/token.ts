/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 */

import { Type } from '../utils/types';

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
export class Token<T> {
    public readonly description: string;

    constructor(
        public readonly target: Type<T> | string,
    ) {
        this.description = typeof target === 'string' ? target : target.name;
    }

    public toString(): string {
        return `Token(${this.description})`;
    }
}

/**
 * Creates a DI token for a class type or a named value.
 *
 * @example
 * export const MY_SERVICE = token(MyService);
 * export const DB_URL = token<string>('DB_URL');
 */
export function token<T>(target: Type<T> | string): Token<T> {
    return new Token<T>(target);
}

/**
 * The key used to look up a class token in the registry.
 * For class tokens, the key is the class constructor itself.
 * For named tokens, the key is the Token instance.
 */
export type TokenKey<T = unknown> = Type<T> | Token<T>;
