/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 */

import { Guard } from '../decorators/guards.decorator';
import { Middleware } from '../decorators/middleware.decorator';

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
     * Optional when the route only serves as a parent for `children`.
     *
     * @example
     * load: () => import('./modules/users/users.controller')
     */
    load?: () => Promise<unknown>;

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

    /**
     * Nested child routes. Guards and middlewares declared here are
     * inherited (merged) by all children.
     */
    children?: RouteDefinition[];
}

/**
 * Defines the application routing table.
 * Each entry maps a path prefix to a lazily-loaded controller.
 *
 * This is the single source of truth for routing — no path is declared
 * in @Controller(), preventing duplicate route prefixes across controllers.
 *
 * Supports nested routes via the `children` property. Guards and middlewares
 * from parent entries are inherited (merged) into each child.
 *
 * @example
 * export const routes = defineRoutes([
 *     {
 *         path: 'users',
 *         load: () => import('./modules/users/users.controller'),
 *         guards: [authGuard],
 *     },
 *     {
 *         path: 'admin',
 *         guards: [authGuard, adminGuard],
 *         children: [
 *             { path: 'users',    load: () => import('./admin/users.controller') },
 *             { path: 'products', load: () => import('./admin/products.controller') },
 *         ],
 *     },
 * ]);
 */
export function defineRoutes(routes: RouteDefinition[]): RouteDefinition[] {
    const flat = flattenRoutes(routes);

    const paths = flat.map(r => r.path);

    // Check exact duplicates
    const duplicates = paths.filter((p, i) => paths.indexOf(p) !== i);
    if (duplicates.length > 0) {
        throw new Error(
            `[Noxus] Duplicate route prefixes detected: ${[...new Set(duplicates)].map(d => `"${d}"`).join(', ')}`
        );
    }

    // Check overlapping prefixes (e.g. 'users' and 'users/admin')
    const sorted = [...paths].sort();
    for (let i = 0; i < sorted.length - 1; i++) {
        const a = sorted[i]!;
        const b = sorted[i + 1]!;
        if (b.startsWith(a + '/')) {
            throw new Error(
                `[Noxus] Overlapping route prefixes detected: "${a}" and "${b}". ` +
                `Use nested children under "${a}" instead of declaring both as top-level routes.`
            );
        }
    }

    return flat;
}

/**
 * Recursively flattens nested route definitions, merging parent guards / middlewares.
 */
function flattenRoutes(
    routes: RouteDefinition[],
    parentPath = '',
    parentGuards: Guard[] = [],
    parentMiddlewares: Middleware[] = [],
): RouteDefinition[] {
    const result: RouteDefinition[] = [];

    for (const route of routes) {
        const path = [parentPath, route.path.replace(/^\/+|\/+$/g, '')]
            .filter(Boolean)
            .join('/');

        const guards = [...new Set([...parentGuards, ...(route.guards ?? [])])];
        const middlewares = [...new Set([...parentMiddlewares, ...(route.middlewares ?? [])])];

        if (route.load) {
            result.push({ ...route, path, guards, middlewares });
        }

        if (route.children?.length) {
            result.push(...flattenRoutes(route.children, path, guards, middlewares));
        }

        if (!route.load && !route.children?.length) {
            throw new Error(
                `[Noxus] Route "${path}" has neither a load function nor children. ` +
                `It must have at least one of them.`
            );
        }
    }

    return result;
}
