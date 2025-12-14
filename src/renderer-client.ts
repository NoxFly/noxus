/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 */

import { IBatchRequestItem, IBatchResponsePayload, IRequest, IResponse } from 'src/request';
import { RendererEventRegistry } from 'src/renderer-events';

export interface IPortRequester {
    requestPort(): void;
}

export interface RendererClientOptions {
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

const DEFAULT_INIT_EVENT = 'init-port';
const DEFAULT_BRIDGE_NAMES = ['noxus', 'ipcRenderer'];

function defaultRequestId(): string {
    if(typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }

    return `${Date.now().toString(16)}-${Math.floor(Math.random() * 1e8).toString(16)}`;
}

function normalizeBridgeNames(preferred?: string | string[]): string[] {
    const names: string[] = [];

    const add = (name: string | undefined): void => {
        if(!name)
            return;

        if(!names.includes(name)) {
            names.push(name);
        }
    };

    if(Array.isArray(preferred)) {
        for(const name of preferred) {
            add(name);
        }
    }
    else {
        add(preferred);
    }

    for(const fallback of DEFAULT_BRIDGE_NAMES) {
        add(fallback);
    }

    return names;
}

function resolveBridgeFromWindow(windowRef: Window, preferred?: string | string[]): IPortRequester | null {
    const names = normalizeBridgeNames(preferred);
    const globalRef = windowRef as unknown as Record<string, unknown> | null | undefined;

    if(!globalRef) {
        return null;
    }

    for(const name of names) {
        const candidate = globalRef[name];

        if(candidate && typeof (candidate as IPortRequester).requestPort === 'function') {
            return candidate as IPortRequester;
        }
    }

    return null;
}

export class NoxRendererClient {
    public readonly events = new RendererEventRegistry();

    protected readonly pendingRequests = new Map<string, PendingRequest>();

    protected requestPort: MessagePort | undefined;
    protected socketPort: MessagePort | undefined;
    protected senderId: number | undefined;

    private readonly bridge: IPortRequester | null;
    private readonly initMessageType: string;
    private readonly windowRef: Window;
    private readonly generateRequestId: () => string;

    private isReady = false;
    private setupPromise: Promise<void> | undefined;
    private setupResolve: (() => void) | undefined;
    private setupReject: ((reason: Error) => void) | undefined;

    constructor(options: RendererClientOptions = {}) {
        this.windowRef = options.windowRef ?? window;
        const resolvedBridge = options.bridge ?? resolveBridgeFromWindow(this.windowRef, options.bridgeName);
        this.bridge = resolvedBridge ?? null;
        this.initMessageType = options.initMessageType ?? DEFAULT_INIT_EVENT;
        this.generateRequestId = options.generateRequestId ?? defaultRequestId;
    }

    public async setup(): Promise<void> {
        if(this.isReady) {
            return Promise.resolve();
        }

        if(this.setupPromise) {
            return this.setupPromise;
        }

        if(!this.bridge || typeof this.bridge.requestPort !== 'function') {
            throw new Error('[Noxus] Renderer bridge is missing requestPort().');
        }

        this.setupPromise = new Promise<void>((resolve, reject) => {
            this.setupResolve = resolve;
            this.setupReject = reject;
        });

        this.windowRef.addEventListener('message', this.onWindowMessage);
        this.bridge.requestPort();

        return this.setupPromise;
    }

    public dispose(): void {
        this.windowRef.removeEventListener('message', this.onWindowMessage);

        this.requestPort?.close();
        this.socketPort?.close();

        this.requestPort = undefined;
        this.socketPort = undefined;
        this.senderId = undefined;
        this.isReady = false;

        this.pendingRequests.clear();
    }

    public async request<TResponse, TBody = unknown>(request: Omit<IRequest<TBody>, 'requestId' | 'senderId'>): Promise<TResponse> {
        const senderId = this.senderId;
        const requestId = this.generateRequestId();

        if(senderId === undefined) {
            return Promise.reject(this.createErrorResponse(requestId, 'MessagePort is not available'));
        }

        const readinessError = this.validateReady(requestId);

        if(readinessError) {
            return Promise.reject(readinessError as IResponse<TResponse>);
        }

        const message: IRequest<TBody> = {
            requestId,
            senderId,
            ...request,
        };

        return new Promise<TResponse>((resolve, reject) => {
            const pending: PendingRequest<TResponse> = {
                resolve,
                reject: (response: IResponse<TResponse>) => reject(response),
                request: message,
                submittedAt: Date.now(),
            };

            this.pendingRequests.set(message.requestId, pending as PendingRequest);

            this.requestPort!.postMessage(message);
        });
    }

    public async batch(requests: Omit<IBatchRequestItem<unknown>, 'requestId'>[]): Promise<IBatchResponsePayload> {
        return this.request<IBatchResponsePayload>({
            method: 'BATCH',
            path: '',
            body: {
                requests,
            },
        });
    }

    public getSenderId(): number | undefined {
        return this.senderId;
    }

    private readonly onWindowMessage = (event: MessageEvent): void => {
        if(event.data?.type !== this.initMessageType) {
            return;
        }

        if(!Array.isArray(event.ports) || event.ports.length < 2) {
            const error = new Error('[Noxus] Renderer expected two MessagePorts (request + socket).');

            console.error(error);
            this.setupReject?.(error);
            this.resetSetupState();
            return;
        }

        this.windowRef.removeEventListener('message', this.onWindowMessage);

        this.requestPort = event.ports[0];
        this.socketPort = event.ports[1];
        this.senderId = event.data.senderId;

        if(this.requestPort === undefined || this.socketPort === undefined) {
            const error = new Error('[Noxus] Renderer failed to receive valid MessagePorts.');
            console.error(error);
            this.setupReject?.(error);
            this.resetSetupState();
            return;
        }

        this.attachRequestPort(this.requestPort);
        this.attachSocketPort(this.socketPort);

        this.isReady = true;
        this.setupResolve?.();
        this.resetSetupState(true);
    };

    private readonly onSocketMessage = (event: MessageEvent): void => {
        if(this.events.tryDispatchFromMessageEvent(event)) {
            return;
        }

        console.warn('[Noxus] Received a socket message that is not a renderer event payload.', event.data);
    };

    private readonly onRequestMessage = (event: MessageEvent): void => {
        if(this.events.tryDispatchFromMessageEvent(event)) {
            return;
        }

        const response: IResponse = event.data;

        if(!response || typeof response.requestId !== 'string') {
            console.error('[Noxus] Renderer received an invalid response payload.', response);
            return;
        }

        const pending = this.pendingRequests.get(response.requestId);

        if(!pending) {
            console.error(`[Noxus] No pending handler found for request ${response.requestId}.`);
            return;
        }

        this.pendingRequests.delete(response.requestId);

        this.onRequestCompleted(pending, response);

        if(response.status >= 400) {
            pending.reject(response as IResponse<any>);
            return;
        }

        pending.resolve(response.body as unknown);
    };

    protected onRequestCompleted(pending: PendingRequest, response: IResponse): void {
        if(typeof console.groupCollapsed === 'function') {
            console.groupCollapsed(`${response.status} ${pending.request.method} /${pending.request.path}`);
        }

        if(response.error) {
            console.error('error message:', response.error);
        }

        if(response.body !== undefined) {
            console.info('response:', response.body);
        }

        console.info('request:', pending.request);
        console.info(`Request duration: ${Date.now() - pending.submittedAt} ms`);

        if(typeof console.groupCollapsed === 'function') {
            console.groupEnd();
        }
    }

    private attachRequestPort(port: MessagePort): void {
        port.onmessage = this.onRequestMessage;
        port.start();
    }

    private attachSocketPort(port: MessagePort): void {
        port.onmessage = this.onSocketMessage;
        port.start();
    }

    private validateReady(requestId: string): IResponse | undefined {
        if(!this.isElectronEnvironment()) {
            return this.createErrorResponse(requestId, 'Not running in Electron environment');
        }

        if(!this.requestPort) {
            return this.createErrorResponse(requestId, 'MessagePort is not available');
        }

        return undefined;
    }

    private createErrorResponse<T>(requestId: string, message: string): IResponse<T> {
        return {
            status: 500,
            requestId,
            error: message,
        };
    }

    private resetSetupState(success = false): void {
        if(!success) {
            this.setupPromise = undefined;
        }

        this.setupResolve = undefined;
        this.setupReject = undefined;
    }

    public isElectronEnvironment(): boolean {
        return typeof window !== 'undefined' && /Electron/.test(window.navigator.userAgent);
    }
}
