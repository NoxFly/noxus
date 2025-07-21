/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 */

import { IResponse, Request } from "src/request";
import { Logger } from "src/utils/logger";
import { MaybeAsync, Type } from "src/utils/types";

/**
 * NextFunction is a function that is called to continue the middleware chain.
 * It returns an Promise that emits when the next middleware is done.
 */
export type NextFunction = () => Promise<void>;

/**
 * IMiddleware interface defines a middleware that can be used in the application.
 * It has an `invoke` method that takes a request, a response, and a next function.
 * The `invoke` method can return a MaybeAsync, which means it can return either a value or a Promise.
 *
 * Use it on a class that should be registered as a middleware in the application.
 */
export interface IMiddleware {
    invoke(request: Request, response: IResponse, next: NextFunction): MaybeAsync<void>;
}

/**
 * UseMiddlewares decorator can be used to register middlewares for a controller or a controller action.
 *
 * @param mdlw - The middlewares list to register for the controller or the controller action.
 */
export function UseMiddlewares(mdlw: Type<IMiddleware>[]): ClassDecorator & MethodDecorator {
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

        if(middlewares.has(key)) {
            throw new Error(`Middlewares(s) already registered for ${key}`);
        }

        Logger.debug(`Registering middleware(s) for ${key}: ${mdlw.map(c => c.name).join(', ')}`);

        middlewares.set(key, mdlw);
    };
}

/**
 * Gets the middlewares for a controller or a controller action.
 * This function retrieves the middlewares registered with the UseMiddlewares decorator.
 * It returns an array of middleware classes that can be used to process requests for the specified controller.
 * @param controllerName The name of the controller to get the middlewares for.
 * @returns An array of middlewares for the controller.
 */
export function getMiddlewaresForController(controllerName: string): Type<IMiddleware>[] {
    const key = `${controllerName}`;
    return middlewares.get(key) ?? [];
}

/**
 * Gets the middlewares for a controller action.
 * This function retrieves the middlewares registered with the UseMiddlewares decorator for a specific action in a controller.
 * It returns an array of middleware classes that can be used to process requests for the specified controller action.
 * @param controllerName The name of the controller to get the middlewares for.
 * @param actionName The name of the action to get the middlewares for.
 * @returns An array of middlewares for the controller action.
 */
export function getMiddlewaresForControllerAction(controllerName: string, actionName: string): Type<IMiddleware>[] {
    const key = `${controllerName}.${actionName}`;
    return middlewares.get(key) ?? [];
}

const middlewares = new Map<string, Type<IMiddleware>[]>();
