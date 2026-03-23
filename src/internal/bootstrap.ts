/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 */

import { app } from 'electron/main';
import { inject, RootInjector } from '../DI/app-injector';
import { InjectorExplorer } from '../DI/injector-explorer';
import { TokenKey } from '../DI/token';
import { Logger } from '../utils/logger';
import { NoxApp } from './app';
import { RouteDefinition } from "./routes";
import { Router } from './router';

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

    /**
     * Controls framework log verbosity.
     * - `'debug'`: all messages (default during development).
     * - `'info'`: info, warn, error, critical only.
     * - `'none'`: completely silent — no framework logs.
     *
     * You can also pass an array of specific log levels to enable.
     */
    logLevel?: 'debug' | 'info' | 'none' | import('../utils/logger').LogLevel[];
}

/**
 * Bootstraps the Noxus application.
 */
export async function bootstrapApplication(config: BootstrapConfig = {}): Promise<NoxApp> {
    await app.whenReady();

    // Apply log level configuration
    if (config.logLevel !== undefined) {
        if (config.logLevel === 'none') {
            Logger.setLogLevel([]);
        } else if (Array.isArray(config.logLevel)) {
            Logger.setLogLevel(config.logLevel);
        } else {
            Logger.setLogLevel(config.logLevel);
        }
    }

    // Build override map for the DI flush phase
    const overrides = new Map<TokenKey, unknown>();

    for (const { token, useValue } of config.singletons ?? []) {
        overrides.set(token, useValue);
        // Pre-register the binding so the injector knows the token exists
        RootInjector.singletons.set(token as any, useValue);
    }

    // Flush all classes enqueued by decorators at import time (two-phase)
    // Wire the controller registrar so InjectorExplorer can register controllers
    // without directly importing Router (avoids circular dependency).
    InjectorExplorer.setControllerRegistrar((controllerClass, pathPrefix, routeGuards, routeMiddlewares) => {
        const router = inject(Router);
        router.registerController(controllerClass, pathPrefix, routeGuards, routeMiddlewares);
    });

    InjectorExplorer.processPending(overrides);

    // Resolve core framework singletons
    const noxApp = inject(NoxApp);

    // Register routes from the routing table
    if (config.routes?.length) {
        for (const route of config.routes) {
            if (route.load) {
                noxApp.lazy(route.path, route.load, route.guards, route.middlewares);
            }
        }
    }

    // Eagerly load optional modules
    if (config.eagerLoad?.length) {
        await noxApp.load(config.eagerLoad);
    }

    await noxApp.init();

    return noxApp;
}
