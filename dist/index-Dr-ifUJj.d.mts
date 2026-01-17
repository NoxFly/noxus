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
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'BATCH';
/**
 * Atomic HTTP verbs supported by controllers. BATCH is handled at the router level only.
 */
type AtomicHttpMethod = Exclude<HttpMethod, 'BATCH'>;
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
    resolve<T>(target: Type<T> | ForwardReference<T>): T;
    /**
     * Instantiates a class, resolving its dependencies.
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
declare function inject<T>(t: Type<T> | ForwardReference<T>): T;
declare const RootInjector: AppInjector;


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
 * Lightweight event registry to help renderer processes subscribe to
 * push messages sent by the main process through Noxus.
 */

type RendererEventHandler<TPayload = unknown> = (payload: TPayload) => void;
interface RendererEventSubscription {
    unsubscribe(): void;
}
declare class RendererEventRegistry {
    private readonly listeners;
    /**
     *
     */
    subscribe<TPayload>(eventName: string, handler: RendererEventHandler<TPayload>): RendererEventSubscription;
    /**
     *
     */
    unsubscribe<TPayload>(eventName: string, handler: RendererEventHandler<TPayload>): void;
    /**
     *
     */
    clear(eventName?: string): void;
    /**
     *
     */
    dispatch<TPayload>(message: IRendererEventMessage<TPayload>): void;
    /**
     *
     */
    tryDispatchFromMessageEvent(event: MessageEvent): boolean;
    /**
     *
     */
    hasHandlers(eventName: string): boolean;
}


interface IPortRequester {
    requestPort(): void;
}
interface RendererClientOptions {
    bridge?: IPortRequester | null;
    bridgeName?: string | string[];
    initMessageType?: string;
    windowRef?: Window;
    generateRequestId?: () => string;
}
interface PendingRequest<T = unknown> {
    resolve: (value: T) => void;
    reject: (reason: IResponse<T>) => void;
    request: IRequest;
    submittedAt: number;
}
declare class NoxRendererClient {
    readonly events: RendererEventRegistry;
    protected readonly pendingRequests: Map<string, PendingRequest<unknown>>;
    protected requestPort: MessagePort | undefined;
    protected socketPort: MessagePort | undefined;
    protected senderId: number | undefined;
    private readonly bridge;
    private readonly initMessageType;
    private readonly windowRef;
    private readonly generateRequestId;
    private isReady;
    private setupPromise;
    private setupResolve;
    private setupReject;
    constructor(options?: RendererClientOptions);
    setup(): Promise<void>;
    dispose(): void;
    request<TResponse, TBody = unknown>(request: Omit<IRequest<TBody>, 'requestId' | 'senderId'>): Promise<TResponse>;
    batch(requests: Omit<IBatchRequestItem<unknown>, 'requestId'>[]): Promise<IBatchResponsePayload>;
    getSenderId(): number | undefined;
    private readonly onWindowMessage;
    private readonly onSocketMessage;
    private readonly onRequestMessage;
    protected onRequestCompleted(pending: PendingRequest, response: IResponse): void;
    private attachRequestPort;
    private attachSocketPort;
    private validateReady;
    private createErrorResponse;
    private resetSetupState;
    isElectronEnvironment(): boolean;
}

export { AppInjector as A, RendererEventRegistry as B, type RendererClientOptions as C, Delete as D, type ForwardRefFn as F, Get as G, type HttpMethod as H, type IResponse as I, type Lifetime as L, type MaybeAsync as M, NoxRendererClient as N, Post as P, Request as R, type Type as T, type IGuard as a, type IPortRequester as b, type IBinding as c, RootInjector as d, Authorize as e, getGuardForControllerAction as f, getGuardForController as g, type IRouteMetadata as h, inject as i, type AtomicHttpMethod as j, getRouteMetadata as k, Put as l, Patch as m, ROUTE_METADATA_KEY as n, ForwardReference as o, forwardRef as p, type IRequest as q, type IBatchRequestItem as r, type IBatchRequestPayload as s, type IBatchResponsePayload as t, RENDERER_EVENT_TYPE as u, type IRendererEventMessage as v, createRendererEventMessage as w, isRendererEventMessage as x, type RendererEventHandler as y, type RendererEventSubscription as z };
