import { I as IPortRequester } from './renderer-client-BwUWCi2Z.js';
export { b as IBatchRequestItem, c as IBatchRequestPayload, e as IBatchResponsePayload, g as IRendererEventMessage, a as IRequest, d as IResponse, N as NoxRendererClient, f as RENDERER_EVENT_TYPE, m as RendererClientOptions, j as RendererEventHandler, l as RendererEventRegistry, k as RendererEventSubscription, R as Request, h as createRendererEventMessage, i as isRendererEventMessage } from './renderer-client-BwUWCi2Z.js';

/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 */

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

export { IPortRequester, type NoxusPreloadAPI, type NoxusPreloadOptions, exposeNoxusBridge };
