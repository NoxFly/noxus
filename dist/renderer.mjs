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
  constructor(event, id, method, path, body) {
    __publicField(this, "event");
    __publicField(this, "id");
    __publicField(this, "method");
    __publicField(this, "path");
    __publicField(this, "body");
    __publicField(this, "context", RootInjector.createScope());
    __publicField(this, "params", {});
    this.event = event;
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
export {
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