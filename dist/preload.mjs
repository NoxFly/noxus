/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 */
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/internal/preload-bridge.ts
import { contextBridge, ipcRenderer } from "electron/renderer";
var DEFAULT_EXPOSE_NAME = "noxus";
var DEFAULT_INIT_EVENT = "init-port";
var DEFAULT_REQUEST_CHANNEL = "gimme-my-port";
var DEFAULT_RESPONSE_CHANNEL = "port";
function exposeNoxusBridge(options = {}) {
  const {
    exposeAs = DEFAULT_EXPOSE_NAME,
    initMessageType = DEFAULT_INIT_EVENT,
    requestChannel = DEFAULT_REQUEST_CHANNEL,
    responseChannel = DEFAULT_RESPONSE_CHANNEL,
    targetWindow = window
  } = options;
  const api = {
    requestPort: /* @__PURE__ */ __name(() => {
      ipcRenderer.send(requestChannel);
      ipcRenderer.once(responseChannel, (event, message) => {
        const ports = (event.ports ?? []).filter((port) => port !== void 0);
        if (ports.length === 0) {
          console.error("[Noxus] No MessagePort received from main process.");
          return;
        }
        for (const port of ports) {
          try {
            port.start();
          } catch (error) {
            console.error("[Noxus] Failed to start MessagePort.", error);
          }
        }
        targetWindow.postMessage(
          {
            type: initMessageType,
            senderId: message?.senderId
          },
          "*",
          ports
        );
      });
    }, "requestPort")
  };
  contextBridge.exposeInMainWorld(exposeAs, api);
  return api;
}
__name(exposeNoxusBridge, "exposeNoxusBridge");
export {
  exposeNoxusBridge
};
/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 */
/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 *
 * Entry point for Electron preload scripts.
 * Imports electron/renderer — must NOT be bundled into renderer web code.
 */
//# sourceMappingURL=preload.mjs.map