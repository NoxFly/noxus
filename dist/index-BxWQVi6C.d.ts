import { M as MaybeAsync, T as Type, A as AppInjector } from './app-injector-B3MvgV3k.js';

/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 */

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

export { Authorize as A, Delete as D, Get as G, type HttpMethod as H, type IResponse as I, NoxRendererClient as N, Post as P, Request as R, type IGuard as a, type IPortRequester as b, getGuardForControllerAction as c, type IRouteMetadata as d, type AtomicHttpMethod as e, getRouteMetadata as f, getGuardForController as g, Put as h, Patch as i, ROUTE_METADATA_KEY as j, type IRequest as k, type IBatchRequestItem as l, type IBatchRequestPayload as m, type IBatchResponsePayload as n, RENDERER_EVENT_TYPE as o, type IRendererEventMessage as p, createRendererEventMessage as q, isRendererEventMessage as r, type RendererEventHandler as s, type RendererEventSubscription as t, RendererEventRegistry as u, type RendererClientOptions as v };
