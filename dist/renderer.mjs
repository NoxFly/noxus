/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 */
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/utils/forward-ref.ts
var _ForwardReference = class _ForwardReference {
  constructor(forwardRefFn) {
    this.forwardRefFn = forwardRefFn;
  }
};
__name(_ForwardReference, "ForwardReference");
var ForwardReference = _ForwardReference;

// src/DI/token.ts
var _Token = class _Token {
  constructor(target) {
    this.target = target;
    this.description = typeof target === "string" ? target : target.name;
  }
  toString() {
    return `Token(${this.description})`;
  }
};
__name(_Token, "Token");
var Token = _Token;

// src/DI/app-injector.ts
function keyOf(k) {
  return k;
}
__name(keyOf, "keyOf");
var _AppInjector = class _AppInjector {
  constructor(name = null) {
    this.name = name;
    this.bindings = /* @__PURE__ */ new Map();
    this.singletons = /* @__PURE__ */ new Map();
    this.scoped = /* @__PURE__ */ new Map();
  }
  /**
   * Creates a child scope for per-request lifetime resolution.
   */
  createScope() {
    const scope = new _AppInjector();
    scope.bindings = this.bindings;
    scope.singletons = this.singletons;
    return scope;
  }
  /**
   * Registers a binding explicitly.
   */
  register(key, implementation, lifetime, deps = []) {
    const k = keyOf(key);
    if (!this.bindings.has(k)) {
      this.bindings.set(k, { lifetime, implementation, deps });
    }
  }
  /**
   * Resolves a dependency by token or class reference.
   */
  resolve(target) {
    if (target instanceof ForwardReference) {
      return this._resolveForwardRef(target);
    }
    const k = keyOf(target);
    const binding = this.bindings.get(k);
    if (!binding) {
      const name = target instanceof Token ? target.description : target.name ?? "unknown";
      throw new Error(
        `[Noxus DI] No binding found for "${name}".
Did you forget to declare it in @Injectable({ deps }) or in bootstrapApplication({ singletons })?`
      );
    }
    switch (binding.lifetime) {
      case "transient":
        return this._instantiate(binding);
      case "scope": {
        if (this.scoped.has(k)) return this.scoped.get(k);
        const inst = this._instantiate(binding);
        this.scoped.set(k, inst);
        return inst;
      }
      case "singleton": {
        if (this.singletons.has(k)) return this.singletons.get(k);
        const inst = this._instantiate(binding);
        this.singletons.set(k, inst);
        if (binding.instance === void 0) {
          binding.instance = inst;
        }
        return inst;
      }
    }
  }
  // -------------------------------------------------------------------------
  _resolveForwardRef(ref) {
    return new Proxy({}, {
      get: /* @__PURE__ */ __name((_obj, prop, receiver) => {
        const realType = ref.forwardRefFn();
        const instance = this.resolve(realType);
        const value = Reflect.get(instance, prop, receiver);
        return typeof value === "function" ? value.bind(instance) : value;
      }, "get"),
      set: /* @__PURE__ */ __name((_obj, prop, value, receiver) => {
        const realType = ref.forwardRefFn();
        const instance = this.resolve(realType);
        return Reflect.set(instance, prop, value, receiver);
      }, "set"),
      getPrototypeOf: /* @__PURE__ */ __name(() => {
        const realType = ref.forwardRefFn();
        return realType.prototype;
      }, "getPrototypeOf")
    });
  }
  _instantiate(binding) {
    const resolvedDeps = binding.deps.map((dep) => this.resolve(dep));
    return new binding.implementation(...resolvedDeps);
  }
};
__name(_AppInjector, "AppInjector");
var AppInjector = _AppInjector;
var RootInjector = new AppInjector("root");

// src/request.ts
var _Request = class _Request {
  constructor(event, senderId, id, method, path, body) {
    this.event = event;
    this.senderId = senderId;
    this.id = id;
    this.method = method;
    this.path = path;
    this.body = body;
    this.context = RootInjector.createScope();
    this.params = {};
    this.path = path.replace(/^\/|\/$/g, "");
  }
};
__name(_Request, "Request");
var Request = _Request;
var RENDERER_EVENT_TYPE = "noxus:event";
function createRendererEventMessage(event, payload) {
  return {
    type: RENDERER_EVENT_TYPE,
    event,
    payload
  };
}
__name(createRendererEventMessage, "createRendererEventMessage");
function isRendererEventMessage(value) {
  if (value === null || typeof value !== "object") {
    return false;
  }
  const possibleMessage = value;
  return possibleMessage.type === RENDERER_EVENT_TYPE && typeof possibleMessage.event === "string";
}
__name(isRendererEventMessage, "isRendererEventMessage");

// src/preload-bridge.ts
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

// src/renderer-events.ts
var _RendererEventRegistry = class _RendererEventRegistry {
  constructor() {
    this.listeners = /* @__PURE__ */ new Map();
  }
  /**
   *
   */
  subscribe(eventName, handler) {
    const normalizedEventName = eventName.trim();
    if (normalizedEventName.length === 0) {
      throw new Error("Renderer event name must be a non-empty string.");
    }
    const handlers = this.listeners.get(normalizedEventName) ?? /* @__PURE__ */ new Set();
    handlers.add(handler);
    this.listeners.set(normalizedEventName, handlers);
    return {
      unsubscribe: /* @__PURE__ */ __name(() => this.unsubscribe(normalizedEventName, handler), "unsubscribe")
    };
  }
  /**
   *
   */
  unsubscribe(eventName, handler) {
    const handlers = this.listeners.get(eventName);
    if (!handlers) {
      return;
    }
    handlers.delete(handler);
    if (handlers.size === 0) {
      this.listeners.delete(eventName);
    }
  }
  /**
   *
   */
  clear(eventName) {
    if (eventName) {
      this.listeners.delete(eventName);
      return;
    }
    this.listeners.clear();
  }
  /**
   *
   */
  dispatch(message) {
    const handlers = this.listeners.get(message.event);
    if (!handlers || handlers.size === 0) {
      return;
    }
    handlers.forEach((handler) => {
      try {
        handler(message.payload);
      } catch (error) {
        console.error(`[Noxus] Renderer event handler for "${message.event}" threw an error.`, error);
      }
    });
  }
  /**
   *
   */
  tryDispatchFromMessageEvent(event) {
    if (!isRendererEventMessage(event.data)) {
      return false;
    }
    this.dispatch(event.data);
    return true;
  }
  /**
   *
   */
  hasHandlers(eventName) {
    const handlers = this.listeners.get(eventName);
    return !!handlers && handlers.size > 0;
  }
};
__name(_RendererEventRegistry, "RendererEventRegistry");
var RendererEventRegistry = _RendererEventRegistry;

// src/renderer-client.ts
var DEFAULT_INIT_EVENT2 = "init-port";
var DEFAULT_BRIDGE_NAMES = ["noxus", "ipcRenderer"];
function defaultRequestId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(16)}-${Math.floor(Math.random() * 1e8).toString(16)}`;
}
__name(defaultRequestId, "defaultRequestId");
function normalizeBridgeNames(preferred) {
  const names = [];
  const add = /* @__PURE__ */ __name((name) => {
    if (!name)
      return;
    if (!names.includes(name)) {
      names.push(name);
    }
  }, "add");
  if (Array.isArray(preferred)) {
    for (const name of preferred) {
      add(name);
    }
  } else {
    add(preferred);
  }
  for (const fallback of DEFAULT_BRIDGE_NAMES) {
    add(fallback);
  }
  return names;
}
__name(normalizeBridgeNames, "normalizeBridgeNames");
function resolveBridgeFromWindow(windowRef, preferred) {
  const names = normalizeBridgeNames(preferred);
  const globalRef = windowRef;
  if (!globalRef) {
    return null;
  }
  for (const name of names) {
    const candidate = globalRef[name];
    if (candidate && typeof candidate.requestPort === "function") {
      return candidate;
    }
  }
  return null;
}
__name(resolveBridgeFromWindow, "resolveBridgeFromWindow");
var _NoxRendererClient = class _NoxRendererClient {
  constructor(options = {}) {
    this.events = new RendererEventRegistry();
    this.pendingRequests = /* @__PURE__ */ new Map();
    this.isReady = false;
    this.onWindowMessage = /* @__PURE__ */ __name((event) => {
      if (event.data?.type !== this.initMessageType) {
        return;
      }
      if (!Array.isArray(event.ports) || event.ports.length < 2) {
        const error = new Error("[Noxus] Renderer expected two MessagePorts (request + socket).");
        console.error(error);
        this.setupReject?.(error);
        this.resetSetupState();
        return;
      }
      this.windowRef.removeEventListener("message", this.onWindowMessage);
      this.requestPort = event.ports[0];
      this.socketPort = event.ports[1];
      this.senderId = event.data.senderId;
      if (this.requestPort === void 0 || this.socketPort === void 0) {
        const error = new Error("[Noxus] Renderer failed to receive valid MessagePorts.");
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
    }, "onWindowMessage");
    this.onSocketMessage = /* @__PURE__ */ __name((event) => {
      if (this.events.tryDispatchFromMessageEvent(event)) {
        return;
      }
      console.warn("[Noxus] Received a socket message that is not a renderer event payload.", event.data);
    }, "onSocketMessage");
    this.onRequestMessage = /* @__PURE__ */ __name((event) => {
      if (this.events.tryDispatchFromMessageEvent(event)) {
        return;
      }
      const response = event.data;
      if (!response || typeof response.requestId !== "string") {
        console.error("[Noxus] Renderer received an invalid response payload.", response);
        return;
      }
      const pending = this.pendingRequests.get(response.requestId);
      if (!pending) {
        console.error(`[Noxus] No pending handler found for request ${response.requestId}.`);
        return;
      }
      this.pendingRequests.delete(response.requestId);
      this.onRequestCompleted(pending, response);
      if (response.status >= 400) {
        pending.reject(response);
        return;
      }
      pending.resolve(response.body);
    }, "onRequestMessage");
    this.windowRef = options.windowRef ?? window;
    const resolvedBridge = options.bridge ?? resolveBridgeFromWindow(this.windowRef, options.bridgeName);
    this.bridge = resolvedBridge ?? null;
    this.initMessageType = options.initMessageType ?? DEFAULT_INIT_EVENT2;
    this.generateRequestId = options.generateRequestId ?? defaultRequestId;
  }
  async setup() {
    if (this.isReady) {
      return Promise.resolve();
    }
    if (this.setupPromise) {
      return this.setupPromise;
    }
    if (!this.bridge || typeof this.bridge.requestPort !== "function") {
      throw new Error("[Noxus] Renderer bridge is missing requestPort().");
    }
    this.setupPromise = new Promise((resolve, reject) => {
      this.setupResolve = resolve;
      this.setupReject = reject;
    });
    this.windowRef.addEventListener("message", this.onWindowMessage);
    this.bridge.requestPort();
    return this.setupPromise;
  }
  dispose() {
    this.windowRef.removeEventListener("message", this.onWindowMessage);
    this.requestPort?.close();
    this.socketPort?.close();
    this.requestPort = void 0;
    this.socketPort = void 0;
    this.senderId = void 0;
    this.isReady = false;
    this.pendingRequests.clear();
  }
  async request(request) {
    const senderId = this.senderId;
    const requestId = this.generateRequestId();
    if (senderId === void 0) {
      return Promise.reject(this.createErrorResponse(requestId, "MessagePort is not available"));
    }
    const readinessError = this.validateReady(requestId);
    if (readinessError) {
      return Promise.reject(readinessError);
    }
    const message = {
      requestId,
      senderId,
      ...request
    };
    return new Promise((resolve, reject) => {
      const pending = {
        resolve,
        reject: /* @__PURE__ */ __name((response) => reject(response), "reject"),
        request: message,
        submittedAt: Date.now()
      };
      this.pendingRequests.set(message.requestId, pending);
      this.requestPort.postMessage(message);
    });
  }
  async batch(requests) {
    return this.request({
      method: "BATCH",
      path: "",
      body: {
        requests
      }
    });
  }
  getSenderId() {
    return this.senderId;
  }
  onRequestCompleted(pending, response) {
    if (typeof console.groupCollapsed === "function") {
      console.groupCollapsed(`${response.status} ${pending.request.method} /${pending.request.path}`);
    }
    if (response.error) {
      console.error("error message:", response.error);
    }
    if (response.body !== void 0) {
      console.info("response:", response.body);
    }
    console.info("request:", pending.request);
    console.info(`Request duration: ${Date.now() - pending.submittedAt} ms`);
    if (typeof console.groupCollapsed === "function") {
      console.groupEnd();
    }
  }
  attachRequestPort(port) {
    port.onmessage = this.onRequestMessage;
    port.start();
  }
  attachSocketPort(port) {
    port.onmessage = this.onSocketMessage;
    port.start();
  }
  validateReady(requestId) {
    if (!this.isElectronEnvironment()) {
      return this.createErrorResponse(requestId, "Not running in Electron environment");
    }
    if (!this.requestPort) {
      return this.createErrorResponse(requestId, "MessagePort is not available");
    }
    return void 0;
  }
  createErrorResponse(requestId, message) {
    return {
      status: 500,
      requestId,
      error: message
    };
  }
  resetSetupState(success = false) {
    if (!success) {
      this.setupPromise = void 0;
    }
    this.setupResolve = void 0;
    this.setupReject = void 0;
  }
  isElectronEnvironment() {
    return typeof window !== "undefined" && /Electron/.test(window.navigator.userAgent);
  }
};
__name(_NoxRendererClient, "NoxRendererClient");
var NoxRendererClient = _NoxRendererClient;
export {
  NoxRendererClient,
  RENDERER_EVENT_TYPE,
  RendererEventRegistry,
  Request,
  createRendererEventMessage,
  exposeNoxusBridge,
  isRendererEventMessage
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
 * Entry point for renderer process and preload consumers.
 */
//# sourceMappingURL=renderer.mjs.map