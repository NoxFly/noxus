/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 */

import { IResponse, Request } from "src/request";
import { Logger } from "src/utils/logger";
import { MaybeAsync, Type } from "src/utils/types";


export type NextFunction = () => Promise<void>;

export interface IMiddleware {
    invoke(request: Request, response: IResponse, next: NextFunction): MaybeAsync<void>;
}

const middlewares = new Map<string, Type<IMiddleware>[]>();

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

export function getMiddlewaresForController(controllerName: string): Type<IMiddleware>[] {
    const key = `${controllerName}`;
    return middlewares.get(key) ?? [];
}

export function getMiddlewaresForControllerAction(controllerName: string, actionName: string): Type<IMiddleware>[] {
    const key = `${controllerName}.${actionName}`;
    return middlewares.get(key) ?? [];
}