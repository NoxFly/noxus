import { T as Type, a as TokenKey } from './app-injector-Bz3Upc0y.mjs';
export { A as AppInjector, F as ForwardRefFn, b as ForwardReference, I as IBinding, L as Lifetime, M as MaybeAsync, R as RootInjector, c as Token, f as forwardRef, i as inject, t as token } from './app-injector-Bz3Upc0y.mjs';
import { f as Request, a as IResponse, G as Guard, M as Middleware } from './request-qJ9EiDZc.mjs';
export { A as AtomicHttpMethod, D as Delete, h as Get, H as HttpMethod, c as IBatchRequestItem, e as IBatchRequestPayload, d as IBatchResponsePayload, I as IRendererEventMessage, b as IRequest, j as IRouteMetadata, k as IRouteOptions, N as NextFunction, P as Patch, l as Post, m as Put, R as RENDERER_EVENT_TYPE, g as createRendererEventMessage, n as getRouteMetadata, o as isAtomicHttpMethod, i as isRendererEventMessage } from './request-qJ9EiDZc.mjs';
import { BrowserWindow } from 'electron/main';
export { BadGatewayException, BadRequestException, ConflictException, ForbiddenException, GatewayTimeoutException, HttpVersionNotSupportedException, Injectable, InjectableOptions, InsufficientStorageException, InternalServerException, LogLevel, Logger, LoopDetectedException, MethodNotAllowedException, NetworkAuthenticationRequiredException, NetworkConnectTimeoutException, NotAcceptableException, NotExtendedException, NotFoundException, NotImplementedException, PaymentRequiredException, RequestTimeoutException, ResponseException, ServiceUnavailableException, TooManyRequestsException, UnauthorizedException, UpgradeRequiredException, VariantAlsoNegotiatesException } from './child.mjs';

/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 */

interface ILazyRoute {
    load: () => Promise<unknown>;
    guards: Guard[];
    middlewares: Middleware[];
    loading: Promise<void> | null;
    loaded: boolean;
}
interface IRouteDefinition {
    method: string;
    path: string;
    controller: Type<unknown>;
    handler: string;
    guards: Guard[];
    middlewares: Middleware[];
}
type ControllerAction = (request: Request, response: IResponse) => unknown;
declare class Router {
    private readonly routes;
    private readonly rootMiddlewares;
    private readonly lazyRoutes;
    registerController(controllerClass: Type<unknown>, pathPrefix: string, routeGuards?: Guard[], routeMiddlewares?: Middleware[]): this;
    registerLazyRoute(pathPrefix: string, load: () => Promise<unknown>, guards?: Guard[], middlewares?: Middleware[]): this;
    defineRootMiddleware(middleware: Middleware): this;
    handle(request: Request): Promise<IResponse>;
    private handleAtomic;
    private handleBatch;
    private tryFindRoute;
    private findRoute;
    private tryLoadLazyRoute;
    private loadLazyModule;
    private resolveController;
    private runPipeline;
    private runMiddleware;
    private runGuard;
    private extractParams;
    private normalizeBatchPayload;
    private normalizeBatchItem;
    private fillErrorResponse;
    private logResponse;
}


interface WindowConfig extends Electron.BrowserWindowConstructorOptions {
    /**
     * If true, the window expands to fill the work area after creation
     * using an animated setBounds. The content is loaded only after
     * the animation completes, preventing the viewbox freeze issue.
     * @default false
     */
    expandToWorkArea?: boolean;
    /**
     * Duration in ms to wait for the setBounds animation to complete
     * before loading content. Only used when expandToWorkArea is true.
     * @default 600
     */
    expandAnimationDuration?: number;
}
interface WindowRecord {
    window: BrowserWindow;
    id: number;
}
/**
 * WindowManager is a singleton service that centralizes BrowserWindow lifecycle.
 *
 * Features:
 * - Creates and tracks all application windows.
 * - Handles the animated expand-to-work-area pattern correctly,
 *   loading content only after the animation ends to avoid the viewbox freeze.
 * - Provides convenience methods to get windows by id, get the main window, etc.
 * - Automatically removes windows from the registry on close.
 *
 * @example
 * // In your IApp.onReady():
 * const wm = inject(WindowManager);
 *
 * const win = await wm.create({
 *   width: 600, height: 600, center: true,
 *   expandToWorkArea: true,
 *   webPreferences: { preload: path.join(__dirname, 'preload.js') },
 * });
 *
 * win.loadFile('index.html');
 */
declare class WindowManager {
    private readonly _windows;
    private _mainWindowId;
    /**
     * Creates a BrowserWindow, optionally performs an animated expand to the
     * work area, and registers it in the manager.
     *
     * If expandToWorkArea is true:
     * 1. The window is created at the given initial size (defaults to 600×600, centered).
     * 2. An animated setBounds expands it to the full work area.
     * 3. The returned promise resolves only after the animation, so callers
     *    can safely call win.loadFile() without the viewbox freeze.
     *
     * @param config Window configuration.
     * @param isMain Mark this window as the main window (accessible via getMain()).
     */
    create(config: WindowConfig, isMain?: boolean): Promise<BrowserWindow>;
    /**
     * Creates the initial "splash" window that is shown immediately after
     * app.whenReady(). It is displayed instantly (show: true, no preload
     * loading) and then expanded to the work area with animation.
     *
     * After the animation completes you can call win.loadFile() without
     * experiencing the viewbox freeze.
     *
     * This is the recommended way to get pixels on screen as fast as possible.
     *
     * @example
     * const win = await wm.createSplash({
     *   webPreferences: { preload: path.join(__dirname, 'preload.js') }
     * });
     * win.loadFile('index.html');
     */
    createSplash(options?: Electron.BrowserWindowConstructorOptions & {
        animationDuration?: number;
    }): Promise<BrowserWindow>;
    /** Returns all currently open windows. */
    getAll(): BrowserWindow[];
    /** Returns the window designated as main, or undefined. */
    getMain(): BrowserWindow | undefined;
    /** Returns a window by its Electron id, or undefined. */
    getById(id: number): BrowserWindow | undefined;
    /** Returns the number of open windows. */
    get count(): number;
    /** Closes and destroys a window by id. */
    close(id: number): void;
    /** Closes all windows. */
    closeAll(): void;
    /**
     * Sends a message to a specific window via webContents.send.
     * @param id Target window id.
     * @param channel IPC channel name.
     * @param args Payload.
     */
    send(id: number, channel: string, ...args: unknown[]): void;
    /**
     * Broadcasts a message to all open windows.
     */
    broadcast(channel: string, ...args: unknown[]): void;
    private _register;
    /**
     * Animates the window to the full work area of the primary display.
     * Resolves only after the animation is complete, so that content loaded
     * afterward gets the correct surface size (no viewbox freeze).
     */
    private _expandToWorkArea;
}


/**
 * Your application service should implement IApp.
 * Noxus calls these lifecycle methods at the appropriate time.
 *
 * Unlike v2, IApp no longer receives a BrowserWindow in onReady.
 * Use the injected WindowManager instead — it is more flexible and
 * does not couple the lifecycle to a single pre-created window.
 *
 * @example
 * @Injectable({ lifetime: 'singleton', deps: [WindowManager, MyService] })
 * class AppService implements IApp {
 *   constructor(private wm: WindowManager, private svc: MyService) {}
 *
 *   async onReady() {
 *     const win = await this.wm.createSplash({ webPreferences: { preload: ... } });
 *     win.loadFile('index.html');
 *   }
 *
 *   async onActivated() { ... }
 *   async dispose() { ... }
 * }
 */
interface IApp {
    dispose(): Promise<void>;
    onReady(): Promise<void>;
    onActivated(): Promise<void>;
}
declare class NoxApp {
    private appService;
    private readonly router;
    private readonly socket;
    readonly windowManager: WindowManager;
    init(): Promise<this>;
    /**
     * Registers a lazy route. The file behind this prefix is dynamically
     * imported on the first IPC request that targets it.
     *
     * The import function should NOT statically reference heavy modules —
     * the whole point is to defer their loading.
     *
     * @example
     * noxApp.lazy('auth', () => import('./modules/auth/auth.controller.js'));
     * noxApp.lazy('reporting', () => import('./modules/reporting/index.js'));
     */
    lazy(pathPrefix: string, load: () => Promise<unknown>, guards?: Guard[], middlewares?: Middleware[]): this;
    /**
     * Eagerly loads a set of modules (controllers + services) before start().
     * Use this for modules that provide services needed by your IApp.onReady().
     *
     * All imports run in parallel; DI is flushed with the two-phase guarantee.
     */
    load(importFns: Array<() => Promise<unknown>>): Promise<this>;
    /**
     * Registers a global middleware applied to every route.
     */
    use(middleware: Middleware): this;
    /**
     * Sets the application service (implements IApp) that receives lifecycle events.
     * @param appClass - Class decorated with @Injectable that implements IApp.
     */
    configure(appClass: Type<IApp>): this;
    /**
     * Calls IApp.onReady(). Should be called after configure() and any lazy()
     * registrations are set up.
     */
    start(): this;
    private readonly onRendererMessage;
    private giveTheRendererAPort;
    private onAppActivated;
    private onAllWindowsClosed;
    private shutdownChannel;
}


/**
 * A single route entry in the application routing table.
 */
interface RouteDefinition {
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
declare function defineRoutes(routes: RouteDefinition[]): RouteDefinition[];


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
interface SingletonOverride<T = unknown> {
    token: TokenKey<T>;
    useValue: T;
}
/**
 * Configuration object for bootstrapApplication.
 */
interface BootstrapConfig {
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
declare function bootstrapApplication(config?: BootstrapConfig): Promise<NoxApp>;


interface ControllerOptions {
    /**
     * Explicit constructor dependencies.
     */
    deps?: ReadonlyArray<TokenKey>;
}
interface IControllerMetadata {
    deps: ReadonlyArray<TokenKey>;
}
/**
 * Marks a class as a Noxus controller.
 * Controllers are always scope-scoped injectables.
 * The route prefix and guards/middlewares are declared in defineRoutes(), not here.
 *
 * @example
 * @Controller({ deps: [UserService] })
 * export class UserController {
 *   constructor(private svc: UserService) {}
 *
 *   @Get('byId/:userId')
 *   getUserById(req: Request) { ... }
 * }
 */
declare function Controller(options?: ControllerOptions): ClassDecorator;
declare function getControllerMetadata(target: object): IControllerMetadata | undefined;

interface RendererChannels {
    request: Electron.MessageChannelMain;
    socket: Electron.MessageChannelMain;
}
declare class NoxSocket {
    private readonly channels;
    register(senderId: number, requestChannel: Electron.MessageChannelMain, socketChannel: Electron.MessageChannelMain): void;
    get(senderId: number): RendererChannels | undefined;
    unregister(senderId: number): void;
    getSenderIds(): number[];
    emit<TPayload = unknown>(eventName: string, payload?: TPayload, targetSenderIds?: number[]): number;
    emitToRenderer<TPayload = unknown>(senderId: number, eventName: string, payload?: TPayload): boolean;
}

export { type BootstrapConfig, Controller, type ControllerAction, type ControllerOptions, Guard, type IApp, type IControllerMetadata, type ILazyRoute, IResponse, type IRouteDefinition, Middleware, NoxApp, NoxSocket, Request, type RouteDefinition, Router, type SingletonOverride, TokenKey, Type, type WindowConfig, WindowManager, type WindowRecord, bootstrapApplication, defineRoutes, getControllerMetadata };
