/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 */

import { app } from 'electron/main';
import { inject, RootInjector } from '../DI/app-injector';
import { InjectorExplorer } from '../DI/injector-explorer';
import { TokenKey } from '../DI/token';
import { NoxApp } from './app';
import { RouteDefinition } from "./routes";

/**
 * A singleton value override: provides an already-constructed instance
 * for a given token, bypassing the DI factory.
 *
 * Useful for injecting external singletons (e.g. a database connection,
 * a logger already configured, a third-party SDK wrapper) that cannot
 * or should not be constructed by the DI container.
 *
 * @example
 * { token: MikroORM, useValue: await MikroORM.init(config) }
 * { token: DB_URL,   useValue: process.env.DATABASE_URL }
 */
export interface SingletonOverride<T = unknown> {
    token: TokenKey<T>;
    useValue: T;
}

/**
 * Configuration object for bootstrapApplication.
 */
export interface BootstrapConfig {
    /**
     * Application routing table, produced by defineRoutes().
     * All lazy routes are registered before the app starts.
     */
    routes?: RouteDefinition[];

    /**
     * Pre-built singleton instances to inject into the DI container
     * before the application starts.
     *
     * This replaces the v2 module/provider declaration pattern for
     * external singletons.
     *
     * @example
     * singletons: [
     *   { token: MikroORM, useValue: await MikroORM.init(ormConfig) },
     *   { token: DB_URL,   useValue: process.env.DATABASE_URL! },
     * ]
     */
    singletons?: SingletonOverride[];

    /**
     * Controllers and services to eagerly load before NoxApp.start() is called.
     * Each entry is a dynamic import function — files are imported in parallel.
     *
     * Use this only for things needed at startup (e.g. if your IApp service
     * depends on a service in an otherwise lazy module).
     *
     * Everything else should be registered via noxApp.lazy().
     *
     * @example
     * eagerLoad: [
     *   () => import('./modules/auth/auth.controller.js'),
     * ]
     */
    eagerLoad?: Array<() => Promise<unknown>>;
}

/**
 * Bootstraps the Noxus application.
 */
export async function bootstrapApplication(config: BootstrapConfig = {}): Promise<NoxApp> {
    await app.whenReady();

    // Build override map for the DI flush phase
    const overrides = new Map<TokenKey, unknown>();
    for (const { token, useValue } of config.singletons ?? []) {
        overrides.set(token, useValue);
        // Pre-register the binding so the injector knows the token exists
        RootInjector.singletons.set(token as any, useValue);
    }

    // Flush all classes enqueued by decorators at import time (two-phase)
    InjectorExplorer.processPending(overrides);

    // Resolve core framework singletons
    const noxApp = inject(NoxApp);

    // Register routes from the routing table
    if (config.routes?.length) {
        for (const route of config.routes) {
            noxApp.lazy(route.path, route.load, route.guards, route.middlewares);
        }
    }

    // Eagerly load optional modules
    if (config.eagerLoad?.length) {
        await noxApp.load(config.eagerLoad);
    }

    await noxApp.init();

    return noxApp;
}
