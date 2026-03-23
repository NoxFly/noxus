/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 */
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/renderer.ts
var renderer_exports = {};
__export(renderer_exports, {
  NoxRendererClient: () => NoxRendererClient,
  RENDERER_EVENT_TYPE: () => RENDERER_EVENT_TYPE,
  RendererEventRegistry: () => RendererEventRegistry,
  Request: () => Request,
  createRendererEventMessage: () => createRendererEventMessage,
  isRendererEventMessage: () => isRendererEventMessage
});
module.exports = __toCommonJS(renderer_exports);

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

// src/utils/logger.ts
var fs = __toESM(require("fs"));
var path = __toESM(require("path"));
function getPrettyTimestamp() {
  const now = /* @__PURE__ */ new Date();
  return `${now.getDate().toString().padStart(2, "0")}/${(now.getMonth() + 1).toString().padStart(2, "0")}/${now.getFullYear()} ${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;
}
__name(getPrettyTimestamp, "getPrettyTimestamp");
function getLogPrefix(callee, messageType, color) {
  const timestamp = getPrettyTimestamp();
  const spaces = " ".repeat(10 - messageType.length);
  let colReset = Logger.colors.initial;
  let colCallee = Logger.colors.yellow;
  if (color === void 0) {
    color = "";
    colReset = "";
    colCallee = "";
  }
  return `${color}[APP] ${process.pid} - ${colReset}${timestamp}${spaces}${color}${messageType.toUpperCase()}${colReset} ${colCallee}[${callee}]${colReset}`;
}
__name(getLogPrefix, "getLogPrefix");
function formatObject(prefix, arg, enableColor = true) {
  const json = JSON.stringify(arg, null, 2);
  let colStart = "";
  let colLine = "";
  let colReset = "";
  if (enableColor) {
    colStart = Logger.colors.darkGrey;
    colLine = Logger.colors.grey;
    colReset = Logger.colors.initial;
  }
  const prefixedJson = json.split("\n").map((line, idx) => idx === 0 ? `${colStart}${line}` : `${prefix} ${colLine}${line}`).join("\n") + colReset;
  return prefixedJson;
}
__name(formatObject, "formatObject");
function formattedArgs(prefix, args, color) {
  let colReset = Logger.colors.initial;
  if (color === void 0) {
    color = "";
    colReset = "";
  }
  return args.map((arg) => {
    if (typeof arg === "string") {
      return `${color}${arg}${colReset}`;
    } else if (typeof arg === "object") {
      return formatObject(prefix, arg, color !== "");
    }
    return arg;
  });
}
__name(formattedArgs, "formattedArgs");
function getCallee() {
  const stack = new Error().stack?.split("\n") ?? [];
  const caller = stack[3]?.trim().match(/at (.+?)(?:\..+)? .+$/)?.[1]?.replace("Object", "").replace(/^_/, "") || "App";
  return caller;
}
__name(getCallee, "getCallee");
function canLog(level) {
  return logLevels.has(level);
}
__name(canLog, "canLog");
function processLogQueue(filepath) {
  const state = fileStates.get(filepath);
  if (!state || state.isWriting || state.queue.length === 0) {
    return;
  }
  state.isWriting = true;
  const messagesToWrite = state.queue.join("\n") + "\n";
  state.queue = [];
  const dir = path.dirname(filepath);
  fs.mkdir(dir, { recursive: true }, (err) => {
    if (err) {
      console.error(`[Logger] Failed to create directory ${dir}`, err);
      state.isWriting = false;
      return;
    }
    fs.appendFile(filepath, messagesToWrite, { encoding: "utf-8" }, (err2) => {
      state.isWriting = false;
      if (err2) {
        console.error(`[Logger] Failed to write log to ${filepath}`, err2);
      }
      if (state.queue.length > 0) {
        processLogQueue(filepath);
      }
    });
  });
}
__name(processLogQueue, "processLogQueue");
function enqueue(filepath, message) {
  if (!fileStates.has(filepath)) {
    fileStates.set(filepath, { queue: [], isWriting: false });
  }
  const state = fileStates.get(filepath);
  state.queue.push(message);
  processLogQueue(filepath);
}
__name(enqueue, "enqueue");
function output(level, args) {
  if (!canLog(level)) {
    return;
  }
  const callee = getCallee();
  {
    const prefix = getLogPrefix(callee, level, logLevelColors[level]);
    const data = formattedArgs(prefix, args, logLevelColors[level]);
    logLevelChannel[level](prefix, ...data);
  }
  {
    const prefix = getLogPrefix(callee, level);
    const data = formattedArgs(prefix, args);
    const filepath = fileSettings.get(level)?.filepath;
    if (filepath) {
      const message = prefix + " " + data.join(" ").replace(/\x1b\[[0-9;]*m/g, "");
      enqueue(filepath, message);
    }
  }
}
__name(output, "output");
var Logger;
((Logger2) => {
  function setLogLevel(level) {
    logLevels.clear();
    if (Array.isArray(level)) {
      for (const lvl of level) {
        logLevels.add(lvl);
      }
    } else {
      const targetRank = logLevelRank[level];
      for (const [lvl, rank] of Object.entries(logLevelRank)) {
        if (rank >= targetRank) {
          logLevels.add(lvl);
        }
      }
    }
  }
  Logger2.setLogLevel = setLogLevel;
  __name(setLogLevel, "setLogLevel");
  function log(...args) {
    output("log", args);
  }
  Logger2.log = log;
  __name(log, "log");
  function info(...args) {
    output("info", args);
  }
  Logger2.info = info;
  __name(info, "info");
  function warn(...args) {
    output("warn", args);
  }
  Logger2.warn = warn;
  __name(warn, "warn");
  function error(...args) {
    output("error", args);
  }
  Logger2.error = error;
  __name(error, "error");
  function errorStack(...args) {
    output("error", args);
  }
  Logger2.errorStack = errorStack;
  __name(errorStack, "errorStack");
  function debug(...args) {
    output("debug", args);
  }
  Logger2.debug = debug;
  __name(debug, "debug");
  function comment(...args) {
    output("comment", args);
  }
  Logger2.comment = comment;
  __name(comment, "comment");
  function critical(...args) {
    output("critical", args);
  }
  Logger2.critical = critical;
  __name(critical, "critical");
  function enableFileLogging(filepath, levels = ["debug", "comment", "log", "info", "warn", "error", "critical"]) {
    for (const level of levels) {
      fileSettings.set(level, { filepath });
    }
  }
  Logger2.enableFileLogging = enableFileLogging;
  __name(enableFileLogging, "enableFileLogging");
  function disableFileLogging(levels = ["debug", "comment", "log", "info", "warn", "error", "critical"]) {
    for (const level of levels) {
      fileSettings.delete(level);
    }
  }
  Logger2.disableFileLogging = disableFileLogging;
  __name(disableFileLogging, "disableFileLogging");
  Logger2.colors = {
    black: "\x1B[0;30m",
    grey: "\x1B[0;37m",
    red: "\x1B[0;31m",
    green: "\x1B[0;32m",
    brown: "\x1B[0;33m",
    blue: "\x1B[0;34m",
    purple: "\x1B[0;35m",
    darkGrey: "\x1B[1;30m",
    lightRed: "\x1B[1;31m",
    lightGreen: "\x1B[1;32m",
    yellow: "\x1B[1;33m",
    lightBlue: "\x1B[1;34m",
    magenta: "\x1B[1;35m",
    cyan: "\x1B[1;36m",
    white: "\x1B[1;37m",
    initial: "\x1B[0m"
  };
})(Logger || (Logger = {}));
var fileSettings = /* @__PURE__ */ new Map();
var fileStates = /* @__PURE__ */ new Map();
var logLevels = /* @__PURE__ */ new Set();
var logLevelRank = {
  debug: 0,
  comment: 1,
  log: 2,
  info: 3,
  warn: 4,
  error: 5,
  critical: 6
};
var logLevelColors = {
  debug: Logger.colors.purple,
  comment: Logger.colors.grey,
  log: Logger.colors.green,
  info: Logger.colors.blue,
  warn: Logger.colors.brown,
  error: Logger.colors.red,
  critical: Logger.colors.lightRed
};
var logLevelChannel = {
  debug: console.debug,
  comment: console.debug,
  log: console.log,
  info: console.info,
  warn: console.warn,
  error: console.error,
  critical: console.error
};
Logger.setLogLevel("debug");

// src/DI/injector-explorer.ts
var _InjectorExplorer = class _InjectorExplorer {
  // -------------------------------------------------------------------------
  // Public API
  // -------------------------------------------------------------------------
  /**
   * Sets the callback used to register controllers.
   * Must be called once before processPending (typically by bootstrapApplication).
   */
  static setControllerRegistrar(registrar) {
    _InjectorExplorer.controllerRegistrar = registrar;
  }
  static enqueue(reg) {
    if (_InjectorExplorer.processed && !_InjectorExplorer.accumulating) {
      _InjectorExplorer._registerImmediate(reg);
      return;
    }
    _InjectorExplorer.pending.push(reg);
  }
  /**
   * Two-phase flush of all pending registrations collected at startup.
   * Called by bootstrapApplication after app.whenReady().
   */
  static processPending(singletonOverrides) {
    const queue = [..._InjectorExplorer.pending];
    _InjectorExplorer.pending.length = 0;
    _InjectorExplorer._phaseOne(queue);
    _InjectorExplorer._phaseTwo(queue, singletonOverrides);
    _InjectorExplorer.processed = true;
  }
  /** Enters accumulation mode for lazy-loaded batches. */
  static beginAccumulate() {
    _InjectorExplorer.accumulating = true;
  }
  /**
   * Exits accumulation mode and flushes queued registrations
   * with the same two-phase guarantee as processPending.
   * Serialised through a lock to prevent concurrent lazy loads from corrupting the queue.
   */
  static flushAccumulated(routeGuards = [], routeMiddlewares = [], pathPrefix = "") {
    _InjectorExplorer.loadingLock = _InjectorExplorer.loadingLock.then(() => {
      _InjectorExplorer.accumulating = false;
      const queue = [..._InjectorExplorer.pending];
      _InjectorExplorer.pending.length = 0;
      _InjectorExplorer._phaseOne(queue);
      for (const reg of queue) {
        if (reg.isController) reg.pathPrefix = pathPrefix;
      }
      _InjectorExplorer._phaseTwo(queue, void 0, routeGuards, routeMiddlewares);
    });
  }
  /**
   * Returns a Promise that resolves once all pending flushAccumulated calls
   * have completed. Useful for awaiting lazy-load serialisation.
   */
  static waitForFlush() {
    return _InjectorExplorer.loadingLock;
  }
  /**
   * Resets the explorer state. Intended for tests only.
   */
  static reset() {
    _InjectorExplorer.pending.length = 0;
    _InjectorExplorer.processed = false;
    _InjectorExplorer.accumulating = false;
    _InjectorExplorer.loadingLock = Promise.resolve();
    _InjectorExplorer.controllerRegistrar = null;
  }
  // -------------------------------------------------------------------------
  // Private helpers
  // -------------------------------------------------------------------------
  /** Phase 1: register all bindings without instantiating anything. */
  static _phaseOne(queue) {
    for (const reg of queue) {
      RootInjector.register(reg.key, reg.implementation, reg.lifetime, reg.deps);
    }
  }
  /** Phase 2: validate deps, resolve singletons and register controllers via the registrar callback. */
  static _phaseTwo(queue, overrides, routeGuards = [], routeMiddlewares = []) {
    for (const reg of queue) {
      for (const dep of reg.deps) {
        if (!RootInjector.bindings.has(dep) && !RootInjector.singletons.has(dep)) {
          Logger.warn(`[Noxus DI] "${reg.implementation.name}" declares dep "${dep.name ?? dep}" which has no binding`);
        }
      }
    }
    for (const reg of queue) {
      if (overrides?.has(reg.key)) {
        const override = overrides.get(reg.key);
        RootInjector.singletons.set(reg.key, override);
        Logger.log(`Registered ${reg.implementation.name} as singleton (overridden)`);
        continue;
      }
      if (reg.lifetime === "singleton") {
        RootInjector.resolve(reg.key);
      }
      if (reg.isController) {
        if (!_InjectorExplorer.controllerRegistrar) {
          throw new Error("[Noxus DI] No controller registrar set. Call InjectorExplorer.setControllerRegistrar() before processing.");
        }
        _InjectorExplorer.controllerRegistrar(
          reg.implementation,
          reg.pathPrefix ?? "",
          routeGuards,
          routeMiddlewares
        );
      } else if (reg.lifetime !== "singleton") {
        Logger.log(`Registered ${reg.implementation.name} as ${reg.lifetime}`);
      }
    }
  }
  static _registerImmediate(reg) {
    RootInjector.register(reg.key, reg.implementation, reg.lifetime, reg.deps);
    if (reg.lifetime === "singleton") {
      RootInjector.resolve(reg.key);
    }
    if (reg.isController && _InjectorExplorer.controllerRegistrar) {
      _InjectorExplorer.controllerRegistrar(reg.implementation, "", [], []);
    }
  }
};
__name(_InjectorExplorer, "InjectorExplorer");
_InjectorExplorer.pending = [];
_InjectorExplorer.processed = false;
_InjectorExplorer.accumulating = false;
_InjectorExplorer.loadingLock = Promise.resolve();
_InjectorExplorer.controllerRegistrar = null;
var InjectorExplorer = _InjectorExplorer;

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
    if (this.singletons.has(k)) {
      return this.singletons.get(k);
    }
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
    let resolved;
    return new Proxy({}, {
      get: /* @__PURE__ */ __name((_obj, prop, receiver) => {
        resolved ?? (resolved = this.resolve(ref.forwardRefFn()));
        const value = Reflect.get(resolved, prop, receiver);
        return typeof value === "function" ? value.bind(resolved) : value;
      }, "get"),
      set: /* @__PURE__ */ __name((_obj, prop, value, receiver) => {
        resolved ?? (resolved = this.resolve(ref.forwardRefFn()));
        return Reflect.set(resolved, prop, value, receiver);
      }, "set"),
      getPrototypeOf: /* @__PURE__ */ __name(() => {
        resolved ?? (resolved = this.resolve(ref.forwardRefFn()));
        return Object.getPrototypeOf(resolved);
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

// src/internal/request.ts
var _Request = class _Request {
  constructor(event, senderId, id, method, path2, body, query) {
    this.event = event;
    this.senderId = senderId;
    this.id = id;
    this.method = method;
    this.path = path2;
    this.body = body;
    this.context = RootInjector.createScope();
    this.params = {};
    this.path = path2.replace(/^\/|\/$/g, "");
    this.query = query ?? {};
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

// src/internal/renderer-events.ts
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

// src/internal/renderer-client.ts
var DEFAULT_INIT_EVENT = "init-port";
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
      if (pending.timer !== void 0) {
        clearTimeout(pending.timer);
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
    this.initMessageType = options.initMessageType ?? DEFAULT_INIT_EVENT;
    this.generateRequestId = options.generateRequestId ?? defaultRequestId;
    this.requestTimeout = options.requestTimeout ?? 1e4;
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
    for (const pending of this.pendingRequests.values()) {
      if (pending.timer !== void 0) {
        clearTimeout(pending.timer);
      }
    }
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
      if (this.requestTimeout > 0) {
        pending.timer = setTimeout(() => {
          this.pendingRequests.delete(message.requestId);
          reject(this.createErrorResponse(message.requestId, `Request timed out after ${this.requestTimeout}ms`));
        }, this.requestTimeout);
      }
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  NoxRendererClient,
  RENDERER_EVENT_TYPE,
  RendererEventRegistry,
  Request,
  createRendererEventMessage,
  isRendererEventMessage
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
 * Entry point for renderer web consumers (Angular, React, Vue, Vanilla...).
 * No Electron imports — safe to bundle with any web bundler.
 */
//# sourceMappingURL=renderer.js.map