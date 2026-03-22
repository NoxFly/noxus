/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 */

interface IPortRequester {
    requestPort(): void;
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

export { type NoxusPreloadAPI, type NoxusPreloadOptions, exposeNoxusBridge };
