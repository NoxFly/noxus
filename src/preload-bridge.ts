/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 */

import { contextBridge, ipcRenderer } from 'electron/renderer';
import type { IPortRequester } from 'src/renderer-client';

export interface NoxusPreloadAPI extends IPortRequester {}

export interface NoxusPreloadOptions {
    exposeAs?: string;
    initMessageType?: string;
    requestChannel?: string;
    responseChannel?: string;
    targetWindow?: Window;
}

const DEFAULT_EXPOSE_NAME = 'noxus';
const DEFAULT_INIT_EVENT = 'init-port';
const DEFAULT_REQUEST_CHANNEL = 'gimme-my-port';
const DEFAULT_RESPONSE_CHANNEL = 'port';

/**
 * Exposes a minimal bridge in the isolated preload context so renderer processes
 * can request the two MessagePorts required by Noxus. The bridge forwards both
 * request/response and socket ports to the renderer via window.postMessage.
 */
export function exposeNoxusBridge(options: NoxusPreloadOptions = {}): NoxusPreloadAPI {
    const {
        exposeAs = DEFAULT_EXPOSE_NAME,
        initMessageType = DEFAULT_INIT_EVENT,
        requestChannel = DEFAULT_REQUEST_CHANNEL,
        responseChannel = DEFAULT_RESPONSE_CHANNEL,
        targetWindow = window,
    } = options;

    const api: NoxusPreloadAPI = {
        requestPort: () => {
            ipcRenderer.send(requestChannel);

            ipcRenderer.once(responseChannel, (event, message: { senderId: number }) => {
                const ports = (event.ports ?? []).filter((port): port is MessagePort => port !== undefined);

                if(ports.length === 0) {
                    console.error('[Noxus] No MessagePort received from main process.');
                    return;
                }

                for(const port of ports) {
                    try {
                        port.start();
                    }
                    catch(error) {
                        console.error('[Noxus] Failed to start MessagePort.', error);
                    }
                }

                targetWindow.postMessage(
                    {
                        type: initMessageType,
                        senderId: message?.senderId,
                    },
                    '*',
                    ports,
                );
            });
        },
    };

    contextBridge.exposeInMainWorld(exposeAs, api);

    return api;
}
