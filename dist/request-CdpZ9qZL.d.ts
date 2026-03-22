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

export { type AtomicHttpMethod as A, Delete as D, Get as G, type HttpMethod as H, type IRendererEventMessage as I, Post as P, Request as R, type IResponse as a, type IRequest as b, type IBatchRequestItem as c, type IBatchResponsePayload as d, type IBatchRequestPayload as e, RENDERER_EVENT_TYPE as f, createRendererEventMessage as g, type IGuard as h, isRendererEventMessage as i, Authorize as j, getGuardForController as k, getGuardForControllerAction as l, type IRouteMetadata as m, getRouteMetadata as n, Put as o, Patch as p, ROUTE_METADATA_KEY as q };
