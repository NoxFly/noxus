import { I as IRendererEventMessage, a as IResponse, b as IRequest, c as IBatchRequestItem, d as IBatchResponsePayload } from './request-Dx_5Prte.mjs';
export { A as AtomicHttpMethod, H as HttpMethod, e as IBatchRequestPayload, f as RENDERER_EVENT_TYPE, R as Request, g as createRendererEventMessage, i as isRendererEventMessage } from './request-Dx_5Prte.mjs';
import './app-injector-B3MvgV3k.mjs';

/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 */
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

export { IBatchRequestItem, IBatchResponsePayload, type IPortRequester, IRendererEventMessage, IRequest, IResponse, NoxRendererClient, type NoxusPreloadAPI, type NoxusPreloadOptions, type RendererClientOptions, type RendererEventHandler, RendererEventRegistry, type RendererEventSubscription, exposeNoxusBridge };
