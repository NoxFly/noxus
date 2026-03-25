/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 */
interface Type<T> extends Function {
    new (...args: any[]): T;
}


type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'BATCH';
type AtomicHttpMethod = Exclude<HttpMethod, 'BATCH'>;


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
    readonly body: unknown;
    readonly context: AppInjector;
    readonly params: Record<string, string>;
    readonly query: Record<string, unknown>;
    constructor(event: Electron.MessageEvent, senderId: number, id: string, method: HttpMethod, path: string, body: unknown, query?: Record<string, unknown>);
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
    query?: Record<string, unknown>;
}
interface IBatchRequestItem<TBody = unknown> {
    requestId?: string;
    path: string;
    method: AtomicHttpMethod;
    body?: TBody;
    query?: Record<string, unknown>;
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
    /**
     * Timeout in milliseconds for IPC requests.
     * If the main process does not respond within this duration,
     * the request Promise is rejected and the pending entry cleaned up.
     * Defaults to 10 000 ms. Set to 0 to disable.
     */
    requestTimeout?: number;
    /** @default true */
    enableLogging?: boolean;
}
interface PendingRequest<T = unknown> {
    resolve: (value: T) => void;
    reject: (reason: IResponse<T>) => void;
    request: IRequest;
    submittedAt: number;
    timer?: ReturnType<typeof setTimeout>;
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
    private readonly requestTimeout;
    private isReady;
    private setupPromise;
    private setupResolve;
    private setupReject;
    private enableLogging;
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

export { type AtomicHttpMethod, type HttpMethod, type IBatchRequestItem, type IBatchRequestPayload, type IBatchResponsePayload, type IPortRequester, type IRendererEventMessage, type IRequest, type IResponse, NoxRendererClient, RENDERER_EVENT_TYPE, type RendererClientOptions, type RendererEventHandler, RendererEventRegistry, type RendererEventSubscription, Request, createRendererEventMessage, isRendererEventMessage };
