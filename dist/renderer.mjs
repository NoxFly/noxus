/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 */
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// src/request.ts
import "reflect-metadata";

// src/DI/app-injector.ts
import "reflect-metadata";

// src/exceptions.ts
var _ResponseException = class _ResponseException extends Error {
  constructor(statusOrMessage, message) {
    let statusCode;
    if (typeof statusOrMessage === "number") {
      statusCode = statusOrMessage;
    } else if (typeof statusOrMessage === "string") {
      message = statusOrMessage;
    }
    super(message ?? "");
    __publicField(this, "status", 0);
    if (statusCode !== void 0) {
      this.status = statusCode;
    }
    this.name = this.constructor.name.replace(/([A-Z])/g, " $1");
  }
};
__name(_ResponseException, "ResponseException");
var ResponseException = _ResponseException;
var _InternalServerException = class _InternalServerException extends ResponseException {
  constructor() {
    super(...arguments);
    __publicField(this, "status", 500);
  }
};
__name(_InternalServerException, "InternalServerException");
var InternalServerException = _InternalServerException;

// src/DI/app-injector.ts
var _AppInjector = class _AppInjector {
  constructor(name = null) {
    __publicField(this, "name");
    __publicField(this, "bindings", /* @__PURE__ */ new Map());
    __publicField(this, "singletons", /* @__PURE__ */ new Map());
    __publicField(this, "scoped", /* @__PURE__ */ new Map());
    this.name = name;
  }
  /**
   * Typically used to create a dependency injection scope
   * at the "scope" level (i.e., per-request lifetime).
   *
   * SHOULD NOT BE USED by anything else than the framework itself.
   */
  createScope() {
    const scope = new _AppInjector();
    scope.bindings = this.bindings;
    scope.singletons = this.singletons;
    return scope;
  }
  /**
   * Called when resolving a dependency,
   * i.e., retrieving the instance of a given class.
   */
  resolve(target) {
    const binding = this.bindings.get(target);
    if (!binding) throw new InternalServerException(`Failed to resolve a dependency injection : No binding for type ${target.name}.
Did you forget to use @Injectable() decorator ?`);
    switch (binding.lifetime) {
      case "transient":
        return this.instantiate(binding.implementation);
      case "scope": {
        if (this.scoped.has(target)) {
          return this.scoped.get(target);
        }
        const instance = this.instantiate(binding.implementation);
        this.scoped.set(target, instance);
        return instance;
      }
      case "singleton": {
        if (binding.instance === void 0 && this.name === "root") {
          binding.instance = this.instantiate(binding.implementation);
          this.singletons.set(target, binding.instance);
        }
        return binding.instance;
      }
    }
  }
  /**
   *
   */
  instantiate(target) {
    const paramTypes = Reflect.getMetadata("design:paramtypes", target) || [];
    const params = paramTypes.map((p) => this.resolve(p));
    return new target(...params);
  }
};
__name(_AppInjector, "AppInjector");
var AppInjector = _AppInjector;
var RootInjector = new AppInjector("root");

// src/request.ts
var _Request = class _Request {
  constructor(event, senderId, id, method, path, body) {
    __publicField(this, "event");
    __publicField(this, "senderId");
    __publicField(this, "id");
    __publicField(this, "method");
    __publicField(this, "path");
    __publicField(this, "body");
    __publicField(this, "context", RootInjector.createScope());
    __publicField(this, "params", {});
    this.event = event;
    this.senderId = senderId;
    this.id = id;
    this.method = method;
    this.path = path;
    this.body = body;
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

// src/renderer-events.ts
var _RendererEventRegistry = class _RendererEventRegistry {
  constructor() {
    __publicField(this, "listeners", /* @__PURE__ */ new Map());
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
var DEFAULT_INIT_EVENT = "init-port";
var DEFAULT_BRIDGE_NAMES = [
  "noxus",
  "ipcRenderer"
];
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
    if (!name) return;
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
    __publicField(this, "events", new RendererEventRegistry());
    __publicField(this, "pendingRequests", /* @__PURE__ */ new Map());
    __publicField(this, "requestPort");
    __publicField(this, "socketPort");
    __publicField(this, "senderId");
    __publicField(this, "bridge");
    __publicField(this, "initMessageType");
    __publicField(this, "windowRef");
    __publicField(this, "generateRequestId");
    __publicField(this, "isReady", false);
    __publicField(this, "setupPromise");
    __publicField(this, "setupResolve");
    __publicField(this, "setupReject");
    __publicField(this, "onWindowMessage", /* @__PURE__ */ __name((event) => {
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
    }, "onWindowMessage"));
    __publicField(this, "onSocketMessage", /* @__PURE__ */ __name((event) => {
      if (this.events.tryDispatchFromMessageEvent(event)) {
        return;
      }
      console.warn("[Noxus] Received a socket message that is not a renderer event payload.", event.data);
    }, "onSocketMessage"));
    __publicField(this, "onRequestMessage", /* @__PURE__ */ __name((event) => {
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
    }, "onRequestMessage"));
    this.windowRef = options.windowRef ?? window;
    const resolvedBridge = options.bridge ?? resolveBridgeFromWindow(this.windowRef, options.bridgeName);
    this.bridge = resolvedBridge ?? null;
    this.initMessageType = options.initMessageType ?? DEFAULT_INIT_EVENT;
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
  isRendererEventMessage
};
/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 */
//# sourceMappingURL=renderer.mjs.map