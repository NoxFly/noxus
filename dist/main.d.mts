import { M as MaybeAsync, T as Type } from './app-injector-B3MvgV3k.mjs';
export { A as AppInjector, F as ForwardRefFn, a as ForwardReference, I as IBinding, L as Lifetime, R as RootInjector, f as forwardRef, i as inject } from './app-injector-B3MvgV3k.mjs';
import { R as Request, I as IResponse, a as IGuard, b as IPortRequester } from './index-DQBQQfMw.mjs';
export { e as AtomicHttpMethod, A as Authorize, D as Delete, G as Get, H as HttpMethod, l as IBatchRequestItem, m as IBatchRequestPayload, n as IBatchResponsePayload, p as IRendererEventMessage, k as IRequest, d as IRouteMetadata, N as NoxRendererClient, i as Patch, P as Post, h as Put, o as RENDERER_EVENT_TYPE, j as ROUTE_METADATA_KEY, v as RendererClientOptions, s as RendererEventHandler, u as RendererEventRegistry, t as RendererEventSubscription, q as createRendererEventMessage, g as getGuardForController, c as getGuardForControllerAction, f as getRouteMetadata, r as isRendererEventMessage } from './index-DQBQQfMw.mjs';
import { BrowserWindow } from 'electron/main';
export { BadGatewayException, BadRequestException, ConflictException, ForbiddenException, GatewayTimeoutException, HttpVersionNotSupportedException, INJECTABLE_METADATA_KEY, INJECT_METADATA_KEY, Inject, Injectable, InsufficientStorageException, InternalServerException, LogLevel, Logger, LoopDetectedException, MethodNotAllowedException, NetworkAuthenticationRequiredException, NetworkConnectTimeoutException, NotAcceptableException, NotExtendedException, NotFoundException, NotImplementedException, PaymentRequiredException, RequestTimeoutException, ResponseException, ServiceUnavailableException, TooManyRequestsException, UnauthorizedException, UpgradeRequiredException, VariantAlsoNegotiatesException, getInjectableMetadata, hasInjectableMetadata } from './child.mjs';

/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 */

/**
 * NextFunction is a function that is called to continue the middleware chain.
 * It returns an Promise that emits when the next middleware is done.
 */
type NextFunction = () => Promise<void>;
/**
 * IMiddleware interface defines a middleware that can be used in the application.
 * It has an `invoke` method that takes a request, a response, and a next function.
 * The `invoke` method can return a MaybeAsync, which means it can return either a value or a Promise.
 *
 * Use it on a class that should be registered as a middleware in the application.
 */
interface IMiddleware {
    invoke(request: Request, response: IResponse, next: NextFunction): MaybeAsync<void>;
}
/**
 * UseMiddlewares decorator can be used to register middlewares for a controller or a controller action.
 *
 * @param mdlw - The middlewares list to register for the controller or the controller action.
 */
declare function UseMiddlewares(mdlw: Type<IMiddleware>[]): ClassDecorator & MethodDecorator;
/**
 * Gets the middlewares for a controller or a controller action.
 * This function retrieves the middlewares registered with the UseMiddlewares decorator.
 * It returns an array of middleware classes that can be used to process requests for the specified controller.
 * @param controllerName The name of the controller to get the middlewares for.
 * @returns An array of middlewares for the controller.
 */
declare function getMiddlewaresForController(controllerName: string): Type<IMiddleware>[];
/**
 * Gets the middlewares for a controller action.
 * This function retrieves the middlewares registered with the UseMiddlewares decorator for a specific action in a controller.
 * It returns an array of middleware classes that can be used to process requests for the specified controller action.
 * @param controllerName The name of the controller to get the middlewares for.
 * @param actionName The name of the action to get the middlewares for.
 * @returns An array of middlewares for the controller action.
 */
declare function getMiddlewaresForControllerAction(controllerName: string, actionName: string): Type<IMiddleware>[];


/**
 * IRouteDefinition interface defines the structure of a route in the application.
 * It includes the HTTP method, path, controller class, handler method name,
 * guards, and middlewares associated with the route.
 */
interface IRouteDefinition {
    method: string;
    path: string;
    controller: Type<any>;
    handler: string;
    guards: Type<IGuard>[];
    middlewares: Type<IMiddleware>[];
}
/**
 * This type defines a function that represents an action in a controller.
 * It takes a Request and an IResponse as parameters and returns a value or a Promise.
 */
type ControllerAction = (request: Request, response: IResponse) => any;
/**
 * Router class is responsible for managing the application's routing.
 * It registers controllers, handles requests, and manages middlewares and guards.
 */
declare class Router {
    private readonly routes;
    private readonly rootMiddlewares;
    /**
     * Registers a controller class with the router.
     * This method extracts the route metadata from the controller class and registers it in the routing tree.
     * It also handles the guards and middlewares associated with the controller.
     * @param controllerClass - The controller class to register.
     */
    registerController(controllerClass: Type<unknown>): Router;
    /**
     * Defines a middleware for the root of the application.
     * This method allows you to register a middleware that will be applied to all requests
     * to the application, regardless of the controller or action.
     * @param middleware - The middleware class to register.
     */
    defineRootMiddleware(middleware: Type<IMiddleware>): Router;
    /**
     * Shuts down the message channel for a specific sender ID.
     * This method closes the IPC channel for the specified sender ID and
     * removes it from the messagePorts map.
     * @param channelSenderId - The ID of the sender channel to shut down.
     */
    handle(request: Request): Promise<IResponse>;
    private handleAtomic;
    private handleBatch;
    private normalizeBatchPayload;
    private normalizeBatchItem;
    /**
     * Finds the route definition for a given request.
     * This method searches the routing tree for a matching route based on the request's path and method.
     * If no matching route is found, it throws a NotFoundException.
     * @param request - The Request object containing the method and path to search for.
     * @returns The IRouteDefinition for the matched route.
     */
    private findRoute;
    /**
     * Resolves the controller for a given route definition.
     * This method creates an instance of the controller class and prepares the request parameters.
     * It also runs the request pipeline, which includes executing middlewares and guards.
     * @param request - The Request object containing the request data.
     * @param response - The IResponse object to populate with the response data.
     * @param routeDef - The IRouteDefinition for the matched route.
     * @return A Promise that resolves when the controller action has been executed.
     * @throws UnauthorizedException if the request is not authorized by the guards.
     */
    private resolveController;
    /**
     * Runs the request pipeline for a given request.
     * This method executes the middlewares and guards associated with the route,
     * and finally calls the controller action.
     * @param request - The Request object containing the request data.
     * @param response - The IResponse object to populate with the response data.
     * @param routeDef - The IRouteDefinition for the matched route.
     * @param controllerInstance - The instance of the controller class.
     * @return A Promise that resolves when the request pipeline has been executed.
     * @throws ResponseException if the response status is not successful.
     */
    private runRequestPipeline;
    /**
     * Runs a middleware function in the request pipeline.
     * This method creates an instance of the middleware and invokes its `invoke` method,
     * passing the request, response, and next function.
     * @param request - The Request object containing the request data.
     * @param response - The IResponse object to populate with the response data.
     * @param next - The NextFunction to call to continue the middleware chain.
     * @param middlewareType - The type of the middleware to run.
     * @return A Promise that resolves when the middleware has been executed.
     */
    private runMiddleware;
    /**
     * Runs a guard to check if the request is authorized.
     * This method creates an instance of the guard and calls its `canActivate` method.
     * If the guard returns false, it throws an UnauthorizedException.
     * @param request - The Request object containing the request data.
     * @param guardType - The type of the guard to run.
     * @return A Promise that resolves if the guard allows the request, or throws an UnauthorizedException if not.
     * @throws UnauthorizedException if the guard denies access to the request.
     */
    private runGuard;
    /**
     * Extracts parameters from the actual request path based on the template path.
     * This method splits the actual path and the template path into segments,
     * then maps the segments to parameters based on the template.
     * @param actual - The actual request path.
     * @param template - The template path to extract parameters from.
     * @returns An object containing the extracted parameters.
     */
    private extractParams;
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


/**
 * The application service should implement this interface, as
 * the NoxApp class instance will use it to notify the given service
 * about application lifecycle events.
 */
interface IApp {
    dispose(): Promise<void>;
    onReady(mainWindow?: BrowserWindow): Promise<void>;
    onActivated(): Promise<void>;
}
/**
 * NoxApp is the main application class that manages the application lifecycle,
 * handles IPC communication, and integrates with the Router.
 */
declare class NoxApp {
    private readonly router;
    private readonly socket;
    private app;
    private mainWindow;
    /**
     *
     */
    private readonly onRendererMessage;
    constructor(router: Router, socket: NoxSocket);
    /**
     * Initializes the NoxApp instance.
     * This method sets up the IPC communication, registers event listeners,
     * and prepares the application for use.
     */
    init(): Promise<NoxApp>;
    /**
     * Handles the request from the renderer process.
     * This method creates a Request object from the IPC event data,
     * processes it through the Router, and sends the response back
     * to the renderer process using the MessageChannel.
     */
    private giveTheRendererAPort;
    /**
     * MacOS specific behavior.
     */
    private onAppActivated;
    /**
     * Shuts down the message channel for a specific sender ID.
     * This method closes the IPC channel for the specified sender ID and
     * removes it from the messagePorts map.
     * @param channelSenderId - The ID of the sender channel to shut down.
     * @param remove - Whether to remove the channel from the messagePorts map.
     */
    private shutdownChannel;
    /**
     * Handles the application shutdown process.
     * This method is called when all windows are closed, and it cleans up the message channels
     */
    private onAllWindowsClosed;
    /**
     * Sets the main BrowserWindow that was created early by bootstrapApplication.
     * This window will be passed to IApp.onReady when start() is called.
     * @param window - The BrowserWindow created during bootstrap.
     */
    setMainWindow(window: BrowserWindow): void;
    /**
     * Configures the NoxApp instance with the provided application class.
     * This method allows you to set the application class that will handle lifecycle events.
     * @param app - The application class to configure.
     * @returns NoxApp instance for method chaining.
     */
    configure(app: Type<IApp>): NoxApp;
    /**
     * Registers a middleware for the root of the application.
     * This method allows you to define a middleware that will be applied to all requests
     * @param middleware - The middleware class to register.
     * @returns NoxApp instance for method chaining.
     */
    use(middleware: Type<IMiddleware>): NoxApp;
    /**
     * Should be called after the bootstrapApplication function is called.
     * Passes the early-created BrowserWindow (if any) to the configured IApp service.
     * @returns NoxApp instance for method chaining.
     */
    start(): NoxApp;
}


/**
 * Options for bootstrapping the Noxus application.
 */
interface BootstrapOptions {
    /**
     * If provided, Noxus creates a BrowserWindow immediately after Electron is ready,
     * before any DI processing occurs. This window is passed to the configured
     * IApp service via onReady(). It allows the user to see a window as fast as possible,
     * even before the application is fully initialized.
     */
    window?: Electron.BrowserWindowConstructorOptions;
}
/**
 * Bootstraps the Noxus application.
 * This function initializes the application by creating an instance of NoxApp,
 * registering the root module, and starting the application.
 *
 * When {@link BootstrapOptions.window} is provided, a BrowserWindow is created
 * immediately after Electron readiness — before DI resolution — so the user
 * sees a window as quickly as possible.
 *
 * @param rootModule - The root module of the application, decorated with @Module.
 * @param options - Optional bootstrap configuration.
 * @return A promise that resolves to the NoxApp instance.
 * @throws Error if the root module is not decorated with @Module, or if the electron process could not start.
 */
declare function bootstrapApplication(rootModule: Type<any>, options?: BootstrapOptions): Promise<NoxApp>;


/**
 * The configuration that waits a controller's decorator.
 */
interface IControllerMetadata {
    path: string;
    guards: Type<IGuard>[];
}
/**
 * Controller decorator is used to define a controller in the application.
 * It is a kind of node in the routing tree, that can contains routes and middlewares.
 *
 * @param path - The path for the controller.
 */
declare function Controller(path: string): ClassDecorator;
/**
 * Gets the controller metadata for a given target class.
 * This metadata includes the path and guards defined by the @Controller decorator.
 * @param target - The target class to get the controller metadata from.
 * @returns The controller metadata if it exists, otherwise undefined.
 */
declare function getControllerMetadata(target: Type<unknown>): IControllerMetadata | undefined;
declare const CONTROLLER_METADATA_KEY: unique symbol;


interface IModuleMetadata {
    imports?: Type<unknown>[];
    exports?: Type<unknown>[];
    providers?: Type<unknown>[];
    controllers?: Type<unknown>[];
}
/**
 * Module decorator is used to define a module in the application.
 * It is a kind of node in the routing tree, that can contains controllers, services, and other modules.
 *
 * @param metadata - The metadata for the module.
 */
declare function Module(metadata: IModuleMetadata): ClassDecorator;
declare function getModuleMetadata(target: Function): IModuleMetadata | undefined;
declare const MODULE_METADATA_KEY: unique symbol;


interface NoxusPreloadAPI extends IPortRequester {
}
interface NoxusPreloadOptions {
    exposeAs?: string;
    initMessageType?: string;
    requestChannel?: string;
    responseChannel?: string;
    targetWindow?: Window;
}
/**
 * Exposes a minimal bridge in the isolated preload context so renderer processes
 * can request the two MessagePorts required by Noxus. The bridge forwards both
 * request/response and socket ports to the renderer via window.postMessage.
 */
declare function exposeNoxusBridge(options?: NoxusPreloadOptions): NoxusPreloadAPI;

export { type BootstrapOptions, CONTROLLER_METADATA_KEY, Controller, type ControllerAction, type IApp, type IControllerMetadata, IGuard, type IMiddleware, type IModuleMetadata, IPortRequester, IResponse, type IRouteDefinition, MODULE_METADATA_KEY, MaybeAsync, Module, type NextFunction, NoxApp, NoxSocket, type NoxusPreloadAPI, type NoxusPreloadOptions, Request, Router, Type, UseMiddlewares, bootstrapApplication, exposeNoxusBridge, getControllerMetadata, getMiddlewaresForController, getMiddlewaresForControllerAction, getModuleMetadata };
