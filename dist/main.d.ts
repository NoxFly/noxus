import { R as Request, I as IResponse, M as MaybeAsync, T as Type, a as IGuard, L as Lifetime, b as IPortRequester } from './index-CzSI-LvO.js';
export { l as AppInjector, e as AtomicHttpMethod, A as Authorize, D as Delete, G as Get, H as HttpMethod, t as IBatchRequestItem, u as IBatchRequestPayload, v as IBatchResponsePayload, k as IBinding, x as IRendererEventMessage, s as IRequest, d as IRouteMetadata, N as NoxRendererClient, i as Patch, P as Post, h as Put, w as RENDERER_EVENT_TYPE, j as ROUTE_METADATA_KEY, o as RendererClientOptions, p as RendererEventHandler, r as RendererEventRegistry, q as RendererEventSubscription, n as RootInjector, y as createRendererEventMessage, g as getGuardForController, c as getGuardForControllerAction, f as getRouteMetadata, m as inject, z as isRendererEventMessage } from './index-CzSI-LvO.js';

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


/**
 * The application service should implement this interface, as
 * the NoxApp class instance will use it to notify the given service
 * about application lifecycle events.
 */
interface IApp {
    dispose(): Promise<void>;
    onReady(): Promise<void>;
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
     * @returns NoxApp instance for method chaining.
     */
    start(): NoxApp;
}


/**
 * Bootstraps the Noxus application.
 * This function initializes the application by creating an instance of NoxApp,
 * registering the root module, and starting the application.
 * @param rootModule - The root module of the application, decorated with @Module.
 * @return A promise that resolves to the NoxApp instance.
 * @throws Error if the root module is not decorated with @Module, or if the electron process could not start.
 */
declare function bootstrapApplication(rootModule: Type<any>): Promise<NoxApp>;


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


/**
 * The Injectable decorator marks a class as injectable.
 * It allows the class to be registered in the dependency injection system.
 * A class decorated with @Injectable can be injected into other classes
 * either from the constructor of the class that needs it of from the `inject` function.
 * @param lifetime - The lifetime of the injectable. Can be 'singleton', 'scope', or 'transient'.
 */
declare function Injectable(lifetime?: Lifetime): ClassDecorator;
/**
 * Gets the injectable metadata for a given target class.
 * This metadata includes the lifetime of the injectable defined by the @Injectable decorator.
 * @param target - The target class to get the injectable metadata from.
 * @returns The lifetime of the injectable if it exists, otherwise undefined.
 */
declare function getInjectableMetadata(target: Type<unknown>): Lifetime | undefined;
declare const INJECTABLE_METADATA_KEY: unique symbol;


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

/**
 * Logger is a utility class for logging messages to the console.
 */
type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug' | 'comment';
declare namespace Logger {
    /**
     * Sets the log level for the logger.
     * This function allows you to change the log level dynamically at runtime.
     * This won't affect the startup logs.
     * @param level Sets the log level for the logger.
     */
    function setLogLevel(level: LogLevel): void;
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

export { BadGatewayException, BadRequestException, CONTROLLER_METADATA_KEY, ConflictException, Controller, type ControllerAction, ForbiddenException, GatewayTimeoutException, HttpVersionNotSupportedException, type IApp, type IControllerMetadata, IGuard, type IMiddleware, type IModuleMetadata, INJECTABLE_METADATA_KEY, IPortRequester, IResponse, type IRouteDefinition, Injectable, InsufficientStorageException, InternalServerException, Lifetime, type LogLevel, Logger, LoopDetectedException, MODULE_METADATA_KEY, MaybeAsync, MethodNotAllowedException, Module, NetworkAuthenticationRequiredException, NetworkConnectTimeoutException, type NextFunction, NotAcceptableException, NotExtendedException, NotFoundException, NotImplementedException, NoxApp, NoxSocket, type NoxusPreloadAPI, type NoxusPreloadOptions, PaymentRequiredException, Request, RequestTimeoutException, ResponseException, Router, ServiceUnavailableException, TooManyRequestsException, Type, UnauthorizedException, UpgradeRequiredException, UseMiddlewares, VariantAlsoNegotiatesException, bootstrapApplication, exposeNoxusBridge, getControllerMetadata, getInjectableMetadata, getMiddlewaresForController, getMiddlewaresForControllerAction, getModuleMetadata };
