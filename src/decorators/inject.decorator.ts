/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 */

import 'reflect-metadata';

export const INJECT_METADATA_KEY = 'custom:inject';

/**
 * Decorator to manually inject a dependency.
 * Useful for handling circular dependencies with `forwardRef` or injecting specific tokens.
 *
 * @param token The token or forward reference to inject.
 */
export function Inject(token: any): ParameterDecorator {
    return (target, propertyKey, parameterIndex) => {
        // target is the constructor for constructor parameters
        const existingParameters = Reflect.getOwnMetadata(INJECT_METADATA_KEY, target) || [];
        existingParameters[parameterIndex] = token;
        Reflect.defineMetadata(INJECT_METADATA_KEY, existingParameters, target);
    };
}
