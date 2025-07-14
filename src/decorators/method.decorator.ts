import { getGuardForControllerAction, IGuard } from "src/decorators/guards.decorator";
import { Type } from "src/utils/types";

function createRouteDecorator(verb: HttpMethod): (path: string) => MethodDecorator {
    return (path: string): MethodDecorator => {
        return (target, propertyKey) => {
            const existingRoutes: IRouteMetadata[] = Reflect.getMetadata(ROUTE_METADATA_KEY, target.constructor) || [];

            const metadata: IRouteMetadata = {
                method: verb,
                path: path.trim().replace(/^\/|\/$/g, ''),
                handler: propertyKey as string,
                guards: getGuardForControllerAction((target.constructor as any).__controllerName, propertyKey as string),
            };

            existingRoutes.push(metadata);

            Reflect.defineMetadata(ROUTE_METADATA_KEY, existingRoutes, target.constructor);
        };
    };
}

export interface IRouteMetadata {
    method: HttpMethod;
    path: string;
    handler: string;
    guards: Type<IGuard>[];
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export const Get = createRouteDecorator('GET');
export const Post = createRouteDecorator('POST');
export const Put = createRouteDecorator('PUT');
export const Patch = createRouteDecorator('PATCH');
export const Delete = createRouteDecorator('DELETE');

export const ROUTE_METADATA_KEY = Symbol('ROUTE_METADATA_KEY');

export function getRouteMetadata(target: Type<unknown>): IRouteMetadata[] {
    return Reflect.getMetadata(ROUTE_METADATA_KEY, target) || [];
}
