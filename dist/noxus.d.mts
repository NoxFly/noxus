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
 * Represents a lifetime of a binding in the dependency injection system.
 * It can be one of the following:
 * - 'singleton': The instance is created once and shared across the application.
 * - 'scope': The instance is created once per scope (e.g., per request).
 * - 'transient': A new instance is created every time it is requested.
 */
type Lifetime = 'singleton' | 'scope' | 'transient';
/**
 * Represents a binding in the dependency injection system.
 * It contains the lifetime of the binding, the implementation type, and optionally an instance.
 */
interface IBinding {
    lifetime: Lifetime;
    implementation: Type<unknown>;
    instance?: InstanceType<Type<unknown>>;
}
/**
 * AppInjector is the root dependency injection container.
 * It is used to register and resolve dependencies in the application.
 * It supports different lifetimes for dependencies:
 * This should not be manually instantiated, outside of the framework.
 * Use the `RootInjector` instance instead.
 */
declare class AppInjector {
    readonly name: string | null;
    bindings: Map<Type<unknown>, IBinding>;
    singletons: Map<Type<unknown>, unknown>;
    scoped: Map<Type<unknown>, unknown>;
    constructor(name?: string | null);
    /**
     * Typically used to create a dependency injection scope
     * at the "scope" level (i.e., per-request lifetime).
     *
     * SHOULD NOT BE USED by anything else than the framework itself.
     */
    createScope(): AppInjector;
    /**
     * Called when resolving a dependency,
     * i.e., retrieving the instance of a given class.
     */
    resolve<T extends Type<unknown>>(target: T): InstanceType<T>;
    /**
     *
     */
    private instantiate;
}
/**
 * Injects a type from the dependency injection system.
 * This function is used to retrieve an instance of a type that has been registered in the dependency injection system.
 * It is typically used in the constructor of a class to inject dependencies.
 * @param t - The type to inject.
 * @returns An instance of the type.
 * @throws If the type is not registered in the dependency injection system.
 */
declare function inject<T>(t: Type<T>): T;
declare const RootInjector: AppInjector;


/**
 * IRouteMetadata interface defines the metadata for a route.
 * It includes the HTTP method, path, handler name, and guards associated with the route.
 * This metadata is used to register the route in the application.
 * This is the configuration that waits a route's decorator.
 */
interface IRouteMetadata {
    method: HttpMethod;
    path: string;
    handler: string;
    guards: Type<IGuard>[];
}
/**
 * The different HTTP methods that can be used in the application.
 */
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
/**
 * Gets the route metadata for a given target class.
 * This metadata includes the HTTP method, path, handler, and guards defined by the route decorators.
 * @see Get
 * @see Post
 * @see Put
 * @see Patch
 * @see Delete
 * @param target The target class to get the route metadata from.
 * @returns An array of route metadata if it exists, otherwise an empty array.
 */
declare function getRouteMetadata(target: Type<unknown>): IRouteMetadata[];
/**
 * Route decorator that defines a leaf in the routing tree, attaching it to a controller method
 * that will be called when the route is matched.
 * This route will have to be called with the GET method.
 */
declare const Get: (path: string) => MethodDecorator;
/**
 * Route decorator that defines a leaf in the routing tree, attaching it to a controller method
 * that will be called when the route is matched.
 * This route will have to be called with the POST method.
 */
declare const Post: (path: string) => MethodDecorator;
/**
 * Route decorator that defines a leaf in the routing tree, attaching it to a controller method
 * that will be called when the route is matched.
 * This route will have to be called with the PUT method.
 */
declare const Put: (path: string) => MethodDecorator;
/**
 * Route decorator that defines a leaf in the routing tree, attaching it to a controller method
 * that will be called when the route is matched.
 * This route will have to be called with the PATCH method.
 */
declare const Patch: (path: string) => MethodDecorator;
/**
 * Route decorator that defines a leaf in the routing tree, attaching it to a controller method
 * that will be called when the route is matched.
 * This route will have to be called with the DELETE method.
 */
declare const Delete: (path: string) => MethodDecorator;
declare const ROUTE_METADATA_KEY: unique symbol;


/**
 * The Request class represents an HTTP request in the Noxus framework.
 * It encapsulates the request data, including the event, ID, method, path, and body.
 * It also provides a context for dependency injection through the AppInjector.
 */
declare class Request {
    readonly event: Electron.MessageEvent;
    readonly id: string;
    readonly method: HttpMethod;
    readonly path: string;
    readonly body: any;
    readonly context: AppInjector;
    readonly params: Record<string, string>;
    constructor(event: Electron.MessageEvent, id: string, method: HttpMethod, path: string, body: any);
}
/**
 * The IRequest interface defines the structure of a request object.
 * It includes properties for the sender ID, request ID, path, method, and an optional body.
 * This interface is used to standardize the request data across the application.
 */
interface IRequest<T = any> {
    senderId: number;
    requestId: string;
    path: string;
    method: HttpMethod;
    body?: T;
}
/**
 * Creates a Request object from the IPC event data.
 * This function extracts the necessary information from the IPC event and constructs a Request instance.
 */
interface IResponse<T = any> {
    requestId: string;
    status: number;
    body?: T;
    error?: string;
}


/**
 * IGuard interface defines a guard that can be used to protect routes.
 * It has a `canActivate` method that takes a request and returns a MaybeAsync boolean.
 * The `canActivate` method can return either a value or a Promise.
 * Use it on a class that should be registered as a guard in the application.
 * Guards can be used to protect routes or controller actions.
 * For example, you can use guards to check if the user is authenticated or has the right permissions.
 * You can use the `Authorize` decorator to register guards for a controller or a controller action.
 * @see Authorize
 */
interface IGuard {
    canActivate(request: Request): MaybeAsync<boolean>;
}
/**
 * Can be used to protect the routes of a controller.
 * Can be used on a controller class or on a controller method.
 */
declare function Authorize(...guardClasses: Type<IGuard>[]): MethodDecorator & ClassDecorator;
/**
 * Gets the guards for a controller or a controller action.
 * @param controllerName The name of the controller to get the guards for.
 * @returns An array of guards for the controller.
 */
declare function getGuardForController(controllerName: string): Type<IGuard>[];
/**
 * Gets the guards for a controller action.
 * @param controllerName The name of the controller to get the guards for.
 * @param actionName The name of the action to get the guards for.
 * @returns An array of guards for the controller action.
 */
declare function getGuardForControllerAction(controllerName: string, actionName: string): Type<IGuard>[];


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
    private readonly messagePorts;
    private app;
    constructor(router: Router);
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
     * Electron specific message handling.
     * Replaces HTTP calls by using Electron's IPC mechanism.
     */
    private onRendererMessage;
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

export { AppInjector, Authorize, BadGatewayException, BadRequestException, CONTROLLER_METADATA_KEY, ConflictException, Controller, type ControllerAction, Delete, ForbiddenException, GatewayTimeoutException, Get, type HttpMethod, HttpVersionNotSupportedException, type IApp, type IBinding, type IControllerMetadata, type IGuard, type IMiddleware, type IModuleMetadata, INJECTABLE_METADATA_KEY, type IRequest, type IResponse, type IRouteDefinition, type IRouteMetadata, Injectable, InsufficientStorageException, InternalServerException, type Lifetime, type LogLevel, Logger, LoopDetectedException, MODULE_METADATA_KEY, type MaybeAsync, MethodNotAllowedException, Module, NetworkAuthenticationRequiredException, NetworkConnectTimeoutException, type NextFunction, NotAcceptableException, NotExtendedException, NotFoundException, NotImplementedException, NoxApp, Patch, PaymentRequiredException, Post, Put, ROUTE_METADATA_KEY, Request, RequestTimeoutException, ResponseException, RootInjector, Router, ServiceUnavailableException, TooManyRequestsException, type Type, UnauthorizedException, UpgradeRequiredException, UseMiddlewares, VariantAlsoNegotiatesException, bootstrapApplication, getControllerMetadata, getGuardForController, getGuardForControllerAction, getInjectableMetadata, getMiddlewaresForController, getMiddlewaresForControllerAction, getModuleMetadata, getRouteMetadata, inject };
