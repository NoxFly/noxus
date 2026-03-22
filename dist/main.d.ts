import { BrowserWindow } from 'electron/main';

/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 */
interface Type<T> extends Function {
    new (...args: any[]): T;
}
/**
 * Represents a generic type that can be either a value or a promise resolving to that value.
 */
type MaybeAsync<T> = T | Promise<T>;


/**
 * A function that returns a type.
 * Used for forward references to types that are not yet defined.
 */
interface ForwardRefFn<T = any> {
    (): Type<T>;
}
/**
 * A wrapper class for forward referenced types.
 */
declare class ForwardReference<T = any> {
    readonly forwardRefFn: ForwardRefFn<T>;
    constructor(forwardRefFn: ForwardRefFn<T>);
}
/**
 * Creates a forward reference to a type.
 * @param fn A function that returns the type.
 * @returns A ForwardReference instance.
 */
declare function forwardRef<T = any>(fn: ForwardRefFn<T>): ForwardReference<T>;


/**
 * A DI token uniquely identifies a dependency.
 * It can wrap a class (Type<T>) or be a named symbol token.
 *
 * Using tokens instead of reflect-metadata means dependencies are
 * declared explicitly — no magic type inference, no emitDecoratorMetadata.
 *
 * @example
 * // Class token (most common)
 * const MY_SERVICE = token(MyService);
 *
 * // Named symbol token (for interfaces or non-class values)
 * const DB_URL = token<string>('DB_URL');
 */
declare class Token<T> {
    readonly target: Type<T> | string;
    readonly description: string;
    constructor(target: Type<T> | string);
    toString(): string;
}
/**
 * Creates a DI token for a class type or a named value.
 *
 * @example
 * export const MY_SERVICE = token(MyService);
 * export const DB_URL = token<string>('DB_URL');
 */
declare function token<T>(target: Type<T> | string): Token<T>;
/**
 * The key used to look up a class token in the registry.
 * For class tokens, the key is the class constructor itself.
 * For named tokens, the key is the Token instance.
 */
type TokenKey<T = unknown> = Type<T> | Token<T>;


/**
 * Lifetime of a binding in the DI container.
 * - singleton: created once, shared for the lifetime of the app.
 * - scope:     created once per request scope.
 * - transient: new instance every time it is resolved.
 */
type Lifetime = 'singleton' | 'scope' | 'transient';
/**
 * Internal representation of a registered binding.
 */
interface IBinding<T = unknown> {
    lifetime: Lifetime;
    implementation: Type<T>;
    /** Explicit constructor dependencies, declared by the class itself. */
    deps: ReadonlyArray<TokenKey>;
    instance?: T;
}
/**
 * AppInjector is the core DI container.
 * It no longer uses reflect-metadata — all dependency information
 * comes from explicitly declared `deps` arrays on each binding.
 */
declare class AppInjector {
    readonly name: string | null;
    readonly bindings: Map<Type<unknown> | Token<unknown>, IBinding<unknown>>;
    readonly singletons: Map<Type<unknown> | Token<unknown>, unknown>;
    readonly scoped: Map<Type<unknown> | Token<unknown>, unknown>;
    constructor(name?: string | null);
    /**
     * Creates a child scope for per-request lifetime resolution.
     */
    createScope(): AppInjector;
    /**
     * Registers a binding explicitly.
     */
    register<T>(key: TokenKey<T>, implementation: Type<T>, lifetime: Lifetime, deps?: ReadonlyArray<TokenKey>): void;
    /**
     * Resolves a dependency by token or class reference.
     */
    resolve<T>(target: TokenKey<T> | ForwardReference<T>): T;
    private _resolveForwardRef;
    private _instantiate;
}
/**
 * The global root injector. All singletons live here.
 */
declare const RootInjector: AppInjector;
/**
 * Convenience function: resolve a token from the root injector.
 */
declare function inject<T>(t: TokenKey<T> | ForwardReference<T>): T;


/**
 * A middleware intercepts requests before they reach guards and the handler.
 * Implement this interface and pass the class to @Controller({ middlewares }) or per-route options.
 */
type Middleware = (request: Request, response: IResponse, next: NextFunction) => MaybeAsync<void>;
type NextFunction = () => Promise<void>;


type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'BATCH';
type AtomicHttpMethod = Exclude<HttpMethod, 'BATCH'>;
declare function isAtomicHttpMethod(m: unknown): m is AtomicHttpMethod;
interface IRouteOptions {
    /**
     * Guards specific to this route (merged with controller guards).
     */
    guards?: Guard[];
    /**
     * Middlewares specific to this route (merged with controller middlewares).
     */
    middlewares?: Middleware[];
}
interface IRouteMetadata {
    method: HttpMethod;
    path: string;
    handler: string;
    guards: Guard[];
    middlewares: Middleware[];
}
declare function getRouteMetadata(target: object): IRouteMetadata[];
declare const Get: (path: string, options?: IRouteOptions) => MethodDecorator;
declare const Post: (path: string, options?: IRouteOptions) => MethodDecorator;
declare const Put: (path: string, options?: IRouteOptions) => MethodDecorator;
declare const Patch: (path: string, options?: IRouteOptions) => MethodDecorator;
declare const Delete: (path: string, options?: IRouteOptions) => MethodDecorator;


/**
 * The Request class represents an HTTP request in the Noxus framework.
 * It encapsulates the request data, including the event, ID, method, path, and body.
 * It also provides a context for dependency injection through the AppInjector.
 */
declare class Request {
    readonly event: Electron.MessageEvent;
    readonly senderId: number;
    readonly id: string;
    readonly method: HttpMethod;
    readonly path: string;
    readonly body: any;
    readonly context: AppInjector;
    readonly params: Record<string, string>;
    constructor(event: Electron.MessageEvent, senderId: number, id: string, method: HttpMethod, path: string, body: any);
}
/**
 * The IRequest interface defines the structure of a request object.
 * It includes properties for the sender ID, request ID, path, method, and an optional body.
 * This interface is used to standardize the request data across the application.
 */
interface IRequest<TBody = unknown> {
    senderId: number;
    requestId: string;
    path: string;
    method: HttpMethod;
    body?: TBody;
}
interface IBatchRequestItem<TBody = unknown> {
    requestId?: string;
    path: string;
    method: AtomicHttpMethod;
    body?: TBody;
}
interface IBatchRequestPayload {
    requests: IBatchRequestItem[];
}
/**
 * Creates a Request object from the IPC event data.
 * This function extracts the necessary information from the IPC event and constructs a Request instance.
 */
interface IResponse<TBody = unknown> {
    requestId: string;
    status: number;
    body?: TBody;
    error?: string;
    stack?: string;
}
interface IBatchResponsePayload {
    responses: IResponse[];
}
declare const RENDERER_EVENT_TYPE = "noxus:event";
interface IRendererEventMessage<TPayload = unknown> {
    type: typeof RENDERER_EVENT_TYPE;
    event: string;
    payload?: TPayload;
}
declare function createRendererEventMessage<TPayload = unknown>(event: string, payload?: TPayload): IRendererEventMessage<TPayload>;
declare function isRendererEventMessage(value: unknown): value is IRendererEventMessage;


/**
 * A guard decides whether an incoming request should reach the handler.
 * Implement this interface and pass the class to @Controller({ guards }) or @Get('path', { guards }).
 */
type Guard = (request: Request) => MaybeAsync<boolean>;


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
        expandToWorkArea?: boolean;
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

declare class ResponseException extends Error {
    readonly status: number;
    constructor(message?: string);
    constructor(statusCode?: number, message?: string);
}
declare class BadRequestException extends ResponseException {
    readonly status = 400;
}
declare class UnauthorizedException extends ResponseException {
    readonly status = 401;
}
declare class PaymentRequiredException extends ResponseException {
    readonly status = 402;
}
declare class ForbiddenException extends ResponseException {
    readonly status = 403;
}
declare class NotFoundException extends ResponseException {
    readonly status = 404;
}
declare class MethodNotAllowedException extends ResponseException {
    readonly status = 405;
}
declare class NotAcceptableException extends ResponseException {
    readonly status = 406;
}
declare class RequestTimeoutException extends ResponseException {
    readonly status = 408;
}
declare class ConflictException extends ResponseException {
    readonly status = 409;
}
declare class UpgradeRequiredException extends ResponseException {
    readonly status = 426;
}
declare class TooManyRequestsException extends ResponseException {
    readonly status = 429;
}
declare class InternalServerException extends ResponseException {
    readonly status = 500;
}
declare class NotImplementedException extends ResponseException {
    readonly status = 501;
}
declare class BadGatewayException extends ResponseException {
    readonly status = 502;
}
declare class ServiceUnavailableException extends ResponseException {
    readonly status = 503;
}
declare class GatewayTimeoutException extends ResponseException {
    readonly status = 504;
}
declare class HttpVersionNotSupportedException extends ResponseException {
    readonly status = 505;
}
declare class VariantAlsoNegotiatesException extends ResponseException {
    readonly status = 506;
}
declare class InsufficientStorageException extends ResponseException {
    readonly status = 507;
}
declare class LoopDetectedException extends ResponseException {
    readonly status = 508;
}
declare class NotExtendedException extends ResponseException {
    readonly status = 510;
}
declare class NetworkAuthenticationRequiredException extends ResponseException {
    readonly status = 511;
}
declare class NetworkConnectTimeoutException extends ResponseException {
    readonly status = 599;
}


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


interface InjectableOptions {
    /**
     * Lifetime of this injectable.
     * @default 'scope'
     */
    lifetime?: Lifetime;
    /**
     * Explicit list of constructor dependencies, in the same order as the constructor parameters.
     * Each entry is either a class constructor or a Token created with token().
     *
     * This replaces reflect-metadata / emitDecoratorMetadata entirely.
     *
     * @example
     * @Injectable({ lifetime: 'singleton', deps: [MyRepo, DB_URL] })
     * class MyService {
     *   constructor(private repo: MyRepo, private dbUrl: string) {}
     * }
     */
    deps?: ReadonlyArray<TokenKey>;
}
/**
 * Marks a class as injectable into the Noxus DI container.
 *
 * Unlike the v2 @Injectable, this decorator:
 * - Does NOT require reflect-metadata or emitDecoratorMetadata.
 * - Requires you to declare deps explicitly when the class has constructor parameters.
 * - Supports standalone usage — no module declaration needed.
 *
 * @example
 * // No dependencies
 * @Injectable()
 * class Logger {}
 *
 * // With dependencies
 * @Injectable({ lifetime: 'singleton', deps: [Logger, MyRepo] })
 * class MyService {
 *   constructor(private logger: Logger, private repo: MyRepo) {}
 * }
 *
 * // With a named token
 * const DB_URL = token<string>('DB_URL');
 *
 * @Injectable({ deps: [DB_URL] })
 * class DbService {
 *   constructor(private url: string) {}
 * }
 */
declare function Injectable(options?: InjectableOptions): ClassDecorator;

/**
 * Logger is a utility class for logging messages to the console.
 */
type LogLevel = 'debug' | 'comment' | 'log' | 'info' | 'warn' | 'error' | 'critical';
declare namespace Logger {
    /**
     * Sets the log level for the logger.
     * This function allows you to change the log level dynamically at runtime.
     * This won't affect the startup logs.
     *
     * If the parameter is a single LogLevel, all log levels with equal or higher severity will be enabled.

    * If the parameter is an array of LogLevels, only the specified levels will be enabled.
     *
     * @param level Sets the log level for the logger.
     */
    function setLogLevel(level: LogLevel | LogLevel[]): void;
    /**
     * Logs a message to the console with log level LOG.
     * This function formats the message with a timestamp, process ID, and the name of the caller function or class.
     * It uses different colors for different log levels to enhance readability.
     * @param args The arguments to log.
     */
    function log(...args: any[]): void;
    /**
     * Logs a message to the console with log level INFO.
     * This function formats the message with a timestamp, process ID, and the name of the caller function or class.
     * It uses different colors for different log levels to enhance readability.
     * @param args The arguments to log.
     */
    function info(...args: any[]): void;
    /**
     * Logs a message to the console with log level WARN.
     * This function formats the message with a timestamp, process ID, and the name of the caller function or class.
     * It uses different colors for different log levels to enhance readability.
     * @param args The arguments to log.
     */
    function warn(...args: any[]): void;
    /**
     * Logs a message to the console with log level ERROR.
     * This function formats the message with a timestamp, process ID, and the name of the caller function or class.
     * It uses different colors for different log levels to enhance readability.
     * @param args The arguments to log.
     */
    function error(...args: any[]): void;
    /**
     * Logs a message to the console with log level ERROR and a grey color scheme.
     */
    function errorStack(...args: any[]): void;
    /**
     * Logs a message to the console with log level DEBUG.
     * This function formats the message with a timestamp, process ID, and the name of the caller function or class.
     * It uses different colors for different log levels to enhance readability.
     * @param args The arguments to log.
     */
    function debug(...args: any[]): void;
    /**
     * Logs a message to the console with log level COMMENT.
     * This function formats the message with a timestamp, process ID, and the name of the caller function or class.
     * It uses different colors for different log levels to enhance readability.
     * @param args The arguments to log.
     */
    function comment(...args: any[]): void;
    /**
     * Logs a message to the console with log level CRITICAL.
     * This function formats the message with a timestamp, process ID, and the name of the caller function or class.
     * It uses different colors for different log levels to enhance readability.
     * @param args The arguments to log.
     */
    function critical(...args: any[]): void;
    /**
     * Enables logging to a file output for the specified log levels.
     * @param filepath The path to the log file.
     * @param levels The log levels to enable file logging for. Defaults to all levels.
     */
    function enableFileLogging(filepath: string, levels?: LogLevel[]): void;
    /**
     * Disables logging to a file output for the specified log levels.
     * @param levels The log levels to disable file logging for. Defaults to all levels.
     */
    function disableFileLogging(levels?: LogLevel[]): void;
    const colors: {
        black: string;
        grey: string;
        red: string;
        green: string;
        brown: string;
        blue: string;
        purple: string;
        darkGrey: string;
        lightRed: string;
        lightGreen: string;
        yellow: string;
        lightBlue: string;
        magenta: string;
        cyan: string;
        white: string;
        initial: string;
    };
}

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

export { AppInjector, type AtomicHttpMethod, BadGatewayException, BadRequestException, type BootstrapConfig, ConflictException, Controller, type ControllerAction, type ControllerOptions, Delete, ForbiddenException, type ForwardRefFn, ForwardReference, GatewayTimeoutException, Get, type Guard, type HttpMethod, HttpVersionNotSupportedException, type IApp, type IBatchRequestItem, type IBatchRequestPayload, type IBatchResponsePayload, type IBinding, type IControllerMetadata, type ILazyRoute, type IRendererEventMessage, type IRequest, type IResponse, type IRouteDefinition, type IRouteMetadata, type IRouteOptions, Injectable, type InjectableOptions, InsufficientStorageException, InternalServerException, type Lifetime, type LogLevel, Logger, LoopDetectedException, type MaybeAsync, MethodNotAllowedException, type Middleware, NetworkAuthenticationRequiredException, NetworkConnectTimeoutException, type NextFunction, NotAcceptableException, NotExtendedException, NotFoundException, NotImplementedException, NoxApp, NoxSocket, Patch, PaymentRequiredException, Post, Put, RENDERER_EVENT_TYPE, Request, RequestTimeoutException, ResponseException, RootInjector, type RouteDefinition, Router, ServiceUnavailableException, type SingletonOverride, Token, type TokenKey, TooManyRequestsException, type Type, UnauthorizedException, UpgradeRequiredException, VariantAlsoNegotiatesException, type WindowConfig, WindowManager, type WindowRecord, bootstrapApplication, createRendererEventMessage, defineRoutes, forwardRef, getControllerMetadata, getRouteMetadata, inject, isAtomicHttpMethod, isRendererEventMessage, token };
