/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 */
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/preload.ts
var preload_exports = {};
__export(preload_exports, {
  exposeNoxusBridge: () => exposeNoxusBridge
});
module.exports = __toCommonJS(preload_exports);

// src/internal/preload-bridge.ts
var import_renderer = require("electron/renderer");
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
      import_renderer.ipcRenderer.send(requestChannel);
      import_renderer.ipcRenderer.once(responseChannel, (event, message) => {
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
  import_renderer.contextBridge.exposeInMainWorld(exposeAs, api);
  return api;
}
__name(exposeNoxusBridge, "exposeNoxusBridge");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  exposeNoxusBridge
});
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
//# sourceMappingURL=preload.js.map