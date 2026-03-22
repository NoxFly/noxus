/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 */

import { Guard } from './guards.decorator';
import { Middleware } from './middleware.decorator';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'BATCH';
export type AtomicHttpMethod = Exclude<HttpMethod, 'BATCH'>;

const ATOMIC_METHODS = new Set<AtomicHttpMethod>(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']);
export function isAtomicHttpMethod(m: unknown): m is AtomicHttpMethod {
    return typeof m === 'string' && ATOMIC_METHODS.has(m as AtomicHttpMethod);
}

export interface IRouteOptions {
    /**
     * Guards specific to this route (merged with controller guards).
     */
    guards?: Guard[];
    /**
     * Middlewares specific to this route (merged with controller middlewares).
     */
    middlewares?: Middleware[];
}

export interface IRouteMetadata {
    method: HttpMethod;
    path: string;
    handler: string;
    guards: Guard[];
    middlewares: Middleware[];
}

const routeMetaMap = new WeakMap<object, IRouteMetadata[]>();

function createRouteDecorator(verb: HttpMethod) {
    return (path: string, options: IRouteOptions = {}): MethodDecorator => {
        return (target, propertyKey) => {
            const ctor = target.constructor;
            const existing: IRouteMetadata[] = routeMetaMap.get(ctor) ?? [];

            existing.push({
                method: verb,
                path: (path ?? '').trim().replace(/^\/|\/$/g, ''),
                handler: propertyKey as string,
                guards: options.guards ?? [],
                middlewares: options.middlewares ?? [],
            });

            routeMetaMap.set(ctor, existing);
        };
    };
}

export function getRouteMetadata(target: object): IRouteMetadata[] {
    return routeMetaMap.get(target) ?? [];
}

export const Get    = createRouteDecorator('GET');
export const Post   = createRouteDecorator('POST');
export const Put    = createRouteDecorator('PUT');
export const Patch  = createRouteDecorator('PATCH');
export const Delete = createRouteDecorator('DELETE');
