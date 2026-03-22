import { M as MaybeAsync, A as AppInjector } from './app-injector-Bz3Upc0y.mjs';

/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 */

/**
 * A guard decides whether an incoming request should reach the handler.
 * Implement this interface and pass the class to @Controller({ guards }) or @Get('path', { guards }).
 */
type Guard = (request: Request) => MaybeAsync<boolean>;


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

export { type AtomicHttpMethod as A, Delete as D, type Guard as G, type HttpMethod as H, type IRendererEventMessage as I, type Middleware as M, type NextFunction as N, Patch as P, RENDERER_EVENT_TYPE as R, type IResponse as a, type IRequest as b, type IBatchRequestItem as c, type IBatchResponsePayload as d, type IBatchRequestPayload as e, Request as f, createRendererEventMessage as g, Get as h, isRendererEventMessage as i, type IRouteMetadata as j, type IRouteOptions as k, Post as l, Put as m, getRouteMetadata as n, isAtomicHttpMethod as o };
