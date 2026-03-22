/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 */

import { InjectorExplorer } from '../DI/injector-explorer';
import { TokenKey } from '../DI/token';
import { Type } from '../utils/types';

export interface ControllerOptions {
    /**
     * Explicit constructor dependencies.
     */
    deps?: ReadonlyArray<TokenKey>;
}

export interface IControllerMetadata {
    deps: ReadonlyArray<TokenKey>;
}

const controllerMetaMap = new WeakMap<object, IControllerMetadata>();

/**
 * Marks a class as a Noxus controller.
 * Controllers are always scope-scoped injectables.
 * The route prefix and guards/middlewares are declared in defineRoutes(), not here.
 *
 * @example
 * @Controller({ deps: [UserService] })
 * export class UserController {
 *   constructor(private svc: UserService) {}
 *
 *   @Get('byId/:userId')
 *   getUserById(req: Request) { ... }
 * }
 */
export function Controller(options: ControllerOptions = {}): ClassDecorator {
    return (target) => {
        const meta: IControllerMetadata = {
            deps: options.deps ?? [],
        };

        controllerMetaMap.set(target, meta);

        InjectorExplorer.enqueue({
            key: target as unknown as Type<unknown>,
            implementation: target as unknown as Type<unknown>,
            lifetime: 'scope',
            deps: options.deps ?? [],
            isController: true,
        });
    };
}

export function getControllerMetadata(target: object): IControllerMetadata | undefined {
    return controllerMetaMap.get(target);
}
