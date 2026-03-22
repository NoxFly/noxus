/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 */

import { Lifetime } from '../DI/app-injector';
import { InjectorExplorer } from '../DI/injector-explorer';
import { Token, TokenKey } from '../DI/token';
import { Type } from '../utils/types';

export interface InjectableOptions {
    /**
     * Lifetime of this injectable.
     * @default 'scope'
     */
    lifetime?: Lifetime;

    /**
     * Explicit list of constructor dependencies, in the same order as the constructor parameters.
     * Each entry is either a class constructor or a Token created with token().
     *
     * This replaces reflect-metadata / emitDecoratorMetadata entirely.
     *
     * @example
     * @Injectable({ lifetime: 'singleton', deps: [MyRepo, DB_URL] })
     * class MyService {
     *   constructor(private repo: MyRepo, private dbUrl: string) {}
     * }
     */
    deps?: ReadonlyArray<TokenKey>;
}

/**
 * Marks a class as injectable into the Noxus DI container.
 *
 * Unlike the v2 @Injectable, this decorator:
 * - Does NOT require reflect-metadata or emitDecoratorMetadata.
 * - Requires you to declare deps explicitly when the class has constructor parameters.
 * - Supports standalone usage — no module declaration needed.
 *
 * @example
 * // No dependencies
 * @Injectable()
 * class Logger {}
 *
 * // With dependencies
 * @Injectable({ lifetime: 'singleton', deps: [Logger, MyRepo] })
 * class MyService {
 *   constructor(private logger: Logger, private repo: MyRepo) {}
 * }
 *
 * // With a named token
 * const DB_URL = token<string>('DB_URL');
 *
 * @Injectable({ deps: [DB_URL] })
 * class DbService {
 *   constructor(private url: string) {}
 * }
 */
export function Injectable(options: InjectableOptions = {}): ClassDecorator {
    const { lifetime = 'scope', deps = [] } = options;

    return (target) => {
        if (typeof target !== 'function' || !target.prototype) {
            throw new Error(`@Injectable can only be applied to classes, not ${typeof target}`);
        }

        const key = target as unknown as Type<unknown>;

        InjectorExplorer.enqueue({
            key,
            implementation: key,
            lifetime,
            deps,
            isController: false,
        });
    };
}

export { Token, TokenKey };
