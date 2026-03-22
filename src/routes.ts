/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 */

import { Guard } from './decorators/guards.decorator';
import { Middleware } from './decorators/middleware.decorator';

/**
 * A single route entry in the application routing table.
 */
export interface RouteDefinition {
    /**
     * The path prefix for this route (e.g. 'users', 'orders').
     * All actions defined in the controller will be prefixed with this path.
     */
    path: string;

    /**
     * Dynamic import function returning the controller file.
     * The controller is loaded lazily on the first IPC request targeting this prefix.
     *
     * @example
     * load: () => import('./modules/users/users.controller')
     */
    load: () => Promise<unknown>;

    /**
     * Guards applied to every action in this controller.
     * Merged with action-level guards.
     */
    guards?: Guard[];

    /**
     * Middlewares applied to every action in this controller.
     * Merged with action-level middlewares.
     */
    middlewares?: Middleware[];
}

/**
 * Defines the application routing table.
 * Each entry maps a path prefix to a lazily-loaded controller.
 *
 * This is the single source of truth for routing — no path is declared
 * in @Controller(), preventing duplicate route prefixes across controllers.
 *
 * @example
 * export const routes = defineRoutes([
 *     {
 *         path: 'users',
 *         load: () => import('./modules/users/users.controller'),
 *         guards: [authGuard],
 *     },
 *     {
 *         path: 'orders',
 *         load: () => import('./modules/orders/orders.controller'),
 *         guards: [authGuard],
 *         middlewares: [logMiddleware],
 *     },
 * ]);
 */
export function defineRoutes(routes: RouteDefinition[]): RouteDefinition[] {
    const paths = routes.map(r => r.path.replace(/^\/+|\/+$/g, ''));
    const duplicates = paths.filter((p, i) => paths.indexOf(p) !== i);

    if (duplicates.length > 0) {
        throw new Error(
            `[Noxus] Duplicate route prefixes detected: ${[...new Set(duplicates)].map(d => `"${d}"`).join(', ')}`
        );
    }

    return routes.map(r => ({
        ...r,
        path: r.path.replace(/^\/+|\/+$/g, ''),
    }));
}
