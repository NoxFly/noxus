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

const methodMeta = new WeakMap<Function, IRouteMetadata>();

function createRouteDecorator(verb: HttpMethod) {
    return (path: string, options: IRouteOptions = {}) => {
        return (value: Function, context: ClassMethodDecoratorContext): void => {
            methodMeta.set(value, {
                method: verb,
                path: (path ?? '').trim().replace(/^\/|\/$/g, ''),
                handler: context.name as string,
                guards: options.guards ?? [],
                middlewares: options.middlewares ?? [],
            });
        };
    };
}

export function getRouteMetadata(target: object): IRouteMetadata[] {
    const routes: IRouteMetadata[] = [];
    const proto = (target as { prototype: Record<string, unknown> }).prototype;

    for (const key of Object.getOwnPropertyNames(proto)) {
        const fn = proto[key];

        if (typeof fn === 'function' && methodMeta.has(fn)) {
            const meta = methodMeta.get(fn);

            if (meta) {
                routes.push(meta);
            }
        }
    }

    return routes;
}

export const Get    = createRouteDecorator('GET');
export const Post   = createRouteDecorator('POST');
export const Put    = createRouteDecorator('PUT');
export const Patch  = createRouteDecorator('PATCH');
export const Delete = createRouteDecorator('DELETE');
