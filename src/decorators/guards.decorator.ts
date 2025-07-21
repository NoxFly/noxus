/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 */

import { Request } from 'src/request';
import { Logger } from 'src/utils/logger';
import { MaybeAsync, Type } from 'src/utils/types';

/**
 * IGuard interface defines a guard that can be used to protect routes.
 * It has a `canActivate` method that takes a request and returns a MaybeAsync boolean.
 * The `canActivate` method can return either a value or a Promise.
 * Use it on a class that should be registered as a guard in the application.
 * Guards can be used to protect routes or controller actions.
 * For example, you can use guards to check if the user is authenticated or has the right permissions.
 * You can use the `Authorize` decorator to register guards for a controller or a controller action.
 * @see Authorize
 */
export interface IGuard {
    canActivate(request: Request): MaybeAsync<boolean>;
}

/**
 * Can be used to protect the routes of a controller.
 * Can be used on a controller class or on a controller method.
 */
export function Authorize(...guardClasses: Type<IGuard>[]): MethodDecorator & ClassDecorator {
    return (target: Function | object, propertyKey?: string | symbol) => {
        let key: string;

        // Method decorator
        if(propertyKey) {
            const ctrlName = target.constructor.name;
            const actionName = propertyKey as string;
            key = `${ctrlName}.${actionName}`;
        }
        // Class decorator
        else {
            const ctrlName = (target as Type<unknown>).name;
            key = `${ctrlName}`;
        }

        if(authorizations.has(key)) {
            throw new Error(`Guard(s) already registered for ${key}`);
        }

        Logger.debug(`Registering guard(s) for ${key}: ${guardClasses.map(c => c.name).join(', ')}`);

        authorizations.set(key, guardClasses);
    };
}

/**
 * Gets the guards for a controller or a controller action.
 * @param controllerName The name of the controller to get the guards for.
 * @returns An array of guards for the controller.
 */
export function getGuardForController(controllerName: string): Type<IGuard>[] {
    const key = `${controllerName}`;
    return authorizations.get(key) ?? [];
}

/**
 * Gets the guards for a controller action.
 * @param controllerName The name of the controller to get the guards for.
 * @param actionName The name of the action to get the guards for.
 * @returns An array of guards for the controller action.
 */
export function getGuardForControllerAction(controllerName: string, actionName: string): Type<IGuard>[] {
    const key = `${controllerName}.${actionName}`;
    return authorizations.get(key) ?? [];
}

const authorizations = new Map<string, Type<IGuard>[]>();
