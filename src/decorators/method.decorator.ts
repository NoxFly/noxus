/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 */

import { getGuardForControllerAction, IGuard } from "src/decorators/guards.decorator";
import { Type } from "src/utils/types";

/**
 * IRouteMetadata interface defines the metadata for a route.
 * It includes the HTTP method, path, handler name, and guards associated with the route.
 * This metadata is used to register the route in the application.
 * This is the configuration that waits a route's decorator.
 */
export interface IRouteMetadata {
    method: HttpMethod;
    path: string;
    handler: string;
    guards: Type<IGuard>[];
}

/**
 * The different HTTP methods that can be used in the application.
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'BATCH';

/**
 * Atomic HTTP verbs supported by controllers. BATCH is handled at the router level only.
 */
export type AtomicHttpMethod = Exclude<HttpMethod, 'BATCH'>;

/**
 * The configuration that waits a route's decorator.
 * It contains the HTTP method, path, handler, and guards for the route.
 * @param verb The HTTP method for the route.
 * @returns A method decorator that registers the route with the specified HTTP method.
 */
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

/**
 * Gets the route metadata for a given target class.
 * This metadata includes the HTTP method, path, handler, and guards defined by the route decorators.
 * @see Get
 * @see Post
 * @see Put
 * @see Patch
 * @see Delete
 * @param target The target class to get the route metadata from.
 * @returns An array of route metadata if it exists, otherwise an empty array.
 */
export function getRouteMetadata(target: Type<unknown>): IRouteMetadata[] {
    return Reflect.getMetadata(ROUTE_METADATA_KEY, target) || [];
}

/**
 * Route decorator that defines a leaf in the routing tree, attaching it to a controller method
 * that will be called when the route is matched.
 * This route will have to be called with the GET method.
 */
export const Get = createRouteDecorator('GET');

/**
 * Route decorator that defines a leaf in the routing tree, attaching it to a controller method
 * that will be called when the route is matched.
 * This route will have to be called with the POST method.
 */
export const Post = createRouteDecorator('POST');

/**
 * Route decorator that defines a leaf in the routing tree, attaching it to a controller method
 * that will be called when the route is matched.
 * This route will have to be called with the PUT method.
 */
export const Put = createRouteDecorator('PUT');
/**
 * Route decorator that defines a leaf in the routing tree, attaching it to a controller method
 * that will be called when the route is matched.
 * This route will have to be called with the PATCH method.
 */
export const Patch = createRouteDecorator('PATCH');

/**
 * Route decorator that defines a leaf in the routing tree, attaching it to a controller method
 * that will be called when the route is matched.
 * This route will have to be called with the DELETE method.
 */
export const Delete = createRouteDecorator('DELETE');

export const ROUTE_METADATA_KEY = Symbol('ROUTE_METADATA_KEY');
