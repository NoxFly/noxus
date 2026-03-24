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
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
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

// src/utils/forward-ref.ts
function forwardRef(fn) {
  return new ForwardReference(fn);
}
var _ForwardReference, ForwardReference;
var init_forward_ref = __esm({
  "src/utils/forward-ref.ts"() {
    "use strict";
    _ForwardReference = class _ForwardReference {
      constructor(forwardRefFn) {
        this.forwardRefFn = forwardRefFn;
      }
    };
    __name(_ForwardReference, "ForwardReference");
    ForwardReference = _ForwardReference;
    __name(forwardRef, "forwardRef");
  }
});

// src/DI/token.ts
var _Token, Token;
var init_token = __esm({
  "src/DI/token.ts"() {
    "use strict";
    _Token = class _Token {
      constructor(target) {
        this.target = target;
        this.description = typeof target === "string" ? target : target.name;
      }
      toString() {
        return `Token(${this.description})`;
      }
    };
    __name(_Token, "Token");
    Token = _Token;
  }
});

// src/utils/logger.ts
function getPrettyTimestamp() {
  const now = /* @__PURE__ */ new Date();
  return `${now.getDate().toString().padStart(2, "0")}/${(now.getMonth() + 1).toString().padStart(2, "0")}/${now.getFullYear()} ${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;
}
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
function getCallee() {
  const stack = new Error().stack?.split("\n") ?? [];
  const caller = stack[3]?.trim().match(/at (.+?)(?:\..+)? .+$/)?.[1]?.replace("Object", "").replace(/^_/, "") || "App";
  return caller;
}
function canLog(level) {
  return logLevels.has(level);
}
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
function enqueue(filepath, message) {
  if (!fileStates.has(filepath)) {
    fileStates.set(filepath, { queue: [], isWriting: false });
  }
  const state = fileStates.get(filepath);
  state.queue.push(message);
  processLogQueue(filepath);
}
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
var fs, path, Logger, fileSettings, fileStates, logLevels, logLevelRank, logLevelColors, logLevelChannel;
var init_logger = __esm({
  "src/utils/logger.ts"() {
    "use strict";
    fs = __toESM(require("fs"));
    path = __toESM(require("path"));
    __name(getPrettyTimestamp, "getPrettyTimestamp");
    __name(getLogPrefix, "getLogPrefix");
    __name(formatObject, "formatObject");
    __name(formattedArgs, "formattedArgs");
    __name(getCallee, "getCallee");
    __name(canLog, "canLog");
    __name(processLogQueue, "processLogQueue");
    __name(enqueue, "enqueue");
    __name(output, "output");
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
    fileSettings = /* @__PURE__ */ new Map();
    fileStates = /* @__PURE__ */ new Map();
    logLevels = /* @__PURE__ */ new Set();
    logLevelRank = {
      debug: 0,
      comment: 1,
      log: 2,
      info: 3,
      warn: 4,
      error: 5,
      critical: 6
    };
    logLevelColors = {
      debug: Logger.colors.purple,
      comment: Logger.colors.grey,
      log: Logger.colors.green,
      info: Logger.colors.blue,
      warn: Logger.colors.brown,
      error: Logger.colors.red,
      critical: Logger.colors.lightRed
    };
    logLevelChannel = {
      debug: console.debug,
      comment: console.debug,
      log: console.log,
      info: console.info,
      warn: console.warn,
      error: console.error,
      critical: console.error
    };
    Logger.setLogLevel("debug");
  }
});

// src/DI/injector-explorer.ts
var injector_explorer_exports = {};
__export(injector_explorer_exports, {
  InjectorExplorer: () => InjectorExplorer
});
var _InjectorExplorer, InjectorExplorer;
var init_injector_explorer = __esm({
  "src/DI/injector-explorer.ts"() {
    "use strict";
    init_app_injector();
    init_logger();
    _InjectorExplorer = class _InjectorExplorer {
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
        return _InjectorExplorer.loadingLock;
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
    InjectorExplorer = _InjectorExplorer;
  }
});

// src/DI/app-injector.ts
function keyOf(k) {
  return k;
}
function resetRootInjector() {
  RootInjector.bindings.clear();
  RootInjector.singletons.clear();
  RootInjector.scoped.clear();
  const { InjectorExplorer: InjectorExplorer2 } = (init_injector_explorer(), __toCommonJS(injector_explorer_exports));
  InjectorExplorer2.reset();
}
function inject(t) {
  return RootInjector.resolve(t);
}
var _AppInjector, AppInjector, RootInjector;
var init_app_injector = __esm({
  "src/DI/app-injector.ts"() {
    "use strict";
    init_forward_ref();
    init_token();
    __name(keyOf, "keyOf");
    _AppInjector = class _AppInjector {
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
    AppInjector = _AppInjector;
    RootInjector = new AppInjector("root");
    __name(resetRootInjector, "resetRootInjector");
    __name(inject, "inject");
  }
});

// src/non-electron-process.ts
var non_electron_process_exports = {};
__export(non_electron_process_exports, {
  AppInjector: () => AppInjector,
  BadGatewayException: () => BadGatewayException,
  BadRequestException: () => BadRequestException,
  ConflictException: () => ConflictException,
  ForbiddenException: () => ForbiddenException,
  ForwardReference: () => ForwardReference,
  GatewayTimeoutException: () => GatewayTimeoutException,
  HttpVersionNotSupportedException: () => HttpVersionNotSupportedException,
  Injectable: () => Injectable,
  InsufficientStorageException: () => InsufficientStorageException,
  InternalServerException: () => InternalServerException,
  Logger: () => Logger,
  LoopDetectedException: () => LoopDetectedException,
  MethodNotAllowedException: () => MethodNotAllowedException,
  NetworkAuthenticationRequiredException: () => NetworkAuthenticationRequiredException,
  NetworkConnectTimeoutException: () => NetworkConnectTimeoutException,
  NotAcceptableException: () => NotAcceptableException,
  NotExtendedException: () => NotExtendedException,
  NotFoundException: () => NotFoundException,
  NotImplementedException: () => NotImplementedException,
  PaymentRequiredException: () => PaymentRequiredException,
  RequestTimeoutException: () => RequestTimeoutException,
  ResponseException: () => ResponseException,
  RootInjector: () => RootInjector,
  ServiceUnavailableException: () => ServiceUnavailableException,
  Token: () => Token,
  TooManyRequestsException: () => TooManyRequestsException,
  UnauthorizedException: () => UnauthorizedException,
  UpgradeRequiredException: () => UpgradeRequiredException,
  VariantAlsoNegotiatesException: () => VariantAlsoNegotiatesException,
  forwardRef: () => forwardRef,
  inject: () => inject,
  resetRootInjector: () => resetRootInjector
});
module.exports = __toCommonJS(non_electron_process_exports);
init_app_injector();

// src/internal/exceptions.ts
var _ResponseException = class _ResponseException extends Error {
  constructor(statusOrMessage, message) {
    let statusCode;
    if (typeof statusOrMessage === "number") {
      statusCode = statusOrMessage;
    } else if (typeof statusOrMessage === "string") {
      message = statusOrMessage;
    }
    super(message ?? "");
    this.status = 0;
    if (statusCode !== void 0) {
      this.status = statusCode;
    }
    this.name = this.constructor.name.replace(/([A-Z])/g, " $1");
  }
};
__name(_ResponseException, "ResponseException");
var ResponseException = _ResponseException;
var _BadRequestException = class _BadRequestException extends ResponseException {
  constructor() {
    super(...arguments);
    this.status = 400;
  }
};
__name(_BadRequestException, "BadRequestException");
var BadRequestException = _BadRequestException;
var _UnauthorizedException = class _UnauthorizedException extends ResponseException {
  constructor() {
    super(...arguments);
    this.status = 401;
  }
};
__name(_UnauthorizedException, "UnauthorizedException");
var UnauthorizedException = _UnauthorizedException;
var _PaymentRequiredException = class _PaymentRequiredException extends ResponseException {
  constructor() {
    super(...arguments);
    this.status = 402;
  }
};
__name(_PaymentRequiredException, "PaymentRequiredException");
var PaymentRequiredException = _PaymentRequiredException;
var _ForbiddenException = class _ForbiddenException extends ResponseException {
  constructor() {
    super(...arguments);
    this.status = 403;
  }
};
__name(_ForbiddenException, "ForbiddenException");
var ForbiddenException = _ForbiddenException;
var _NotFoundException = class _NotFoundException extends ResponseException {
  constructor() {
    super(...arguments);
    this.status = 404;
  }
};
__name(_NotFoundException, "NotFoundException");
var NotFoundException = _NotFoundException;
var _MethodNotAllowedException = class _MethodNotAllowedException extends ResponseException {
  constructor() {
    super(...arguments);
    this.status = 405;
  }
};
__name(_MethodNotAllowedException, "MethodNotAllowedException");
var MethodNotAllowedException = _MethodNotAllowedException;
var _NotAcceptableException = class _NotAcceptableException extends ResponseException {
  constructor() {
    super(...arguments);
    this.status = 406;
  }
};
__name(_NotAcceptableException, "NotAcceptableException");
var NotAcceptableException = _NotAcceptableException;
var _RequestTimeoutException = class _RequestTimeoutException extends ResponseException {
  constructor() {
    super(...arguments);
    this.status = 408;
  }
};
__name(_RequestTimeoutException, "RequestTimeoutException");
var RequestTimeoutException = _RequestTimeoutException;
var _ConflictException = class _ConflictException extends ResponseException {
  constructor() {
    super(...arguments);
    this.status = 409;
  }
};
__name(_ConflictException, "ConflictException");
var ConflictException = _ConflictException;
var _UpgradeRequiredException = class _UpgradeRequiredException extends ResponseException {
  constructor() {
    super(...arguments);
    this.status = 426;
  }
};
__name(_UpgradeRequiredException, "UpgradeRequiredException");
var UpgradeRequiredException = _UpgradeRequiredException;
var _TooManyRequestsException = class _TooManyRequestsException extends ResponseException {
  constructor() {
    super(...arguments);
    this.status = 429;
  }
};
__name(_TooManyRequestsException, "TooManyRequestsException");
var TooManyRequestsException = _TooManyRequestsException;
var _InternalServerException = class _InternalServerException extends ResponseException {
  constructor() {
    super(...arguments);
    this.status = 500;
  }
};
__name(_InternalServerException, "InternalServerException");
var InternalServerException = _InternalServerException;
var _NotImplementedException = class _NotImplementedException extends ResponseException {
  constructor() {
    super(...arguments);
    this.status = 501;
  }
};
__name(_NotImplementedException, "NotImplementedException");
var NotImplementedException = _NotImplementedException;
var _BadGatewayException = class _BadGatewayException extends ResponseException {
  constructor() {
    super(...arguments);
    this.status = 502;
  }
};
__name(_BadGatewayException, "BadGatewayException");
var BadGatewayException = _BadGatewayException;
var _ServiceUnavailableException = class _ServiceUnavailableException extends ResponseException {
  constructor() {
    super(...arguments);
    this.status = 503;
  }
};
__name(_ServiceUnavailableException, "ServiceUnavailableException");
var ServiceUnavailableException = _ServiceUnavailableException;
var _GatewayTimeoutException = class _GatewayTimeoutException extends ResponseException {
  constructor() {
    super(...arguments);
    this.status = 504;
  }
};
__name(_GatewayTimeoutException, "GatewayTimeoutException");
var GatewayTimeoutException = _GatewayTimeoutException;
var _HttpVersionNotSupportedException = class _HttpVersionNotSupportedException extends ResponseException {
  constructor() {
    super(...arguments);
    this.status = 505;
  }
};
__name(_HttpVersionNotSupportedException, "HttpVersionNotSupportedException");
var HttpVersionNotSupportedException = _HttpVersionNotSupportedException;
var _VariantAlsoNegotiatesException = class _VariantAlsoNegotiatesException extends ResponseException {
  constructor() {
    super(...arguments);
    this.status = 506;
  }
};
__name(_VariantAlsoNegotiatesException, "VariantAlsoNegotiatesException");
var VariantAlsoNegotiatesException = _VariantAlsoNegotiatesException;
var _InsufficientStorageException = class _InsufficientStorageException extends ResponseException {
  constructor() {
    super(...arguments);
    this.status = 507;
  }
};
__name(_InsufficientStorageException, "InsufficientStorageException");
var InsufficientStorageException = _InsufficientStorageException;
var _LoopDetectedException = class _LoopDetectedException extends ResponseException {
  constructor() {
    super(...arguments);
    this.status = 508;
  }
};
__name(_LoopDetectedException, "LoopDetectedException");
var LoopDetectedException = _LoopDetectedException;
var _NotExtendedException = class _NotExtendedException extends ResponseException {
  constructor() {
    super(...arguments);
    this.status = 510;
  }
};
__name(_NotExtendedException, "NotExtendedException");
var NotExtendedException = _NotExtendedException;
var _NetworkAuthenticationRequiredException = class _NetworkAuthenticationRequiredException extends ResponseException {
  constructor() {
    super(...arguments);
    this.status = 511;
  }
};
__name(_NetworkAuthenticationRequiredException, "NetworkAuthenticationRequiredException");
var NetworkAuthenticationRequiredException = _NetworkAuthenticationRequiredException;
var _NetworkConnectTimeoutException = class _NetworkConnectTimeoutException extends ResponseException {
  constructor() {
    super(...arguments);
    this.status = 599;
  }
};
__name(_NetworkConnectTimeoutException, "NetworkConnectTimeoutException");
var NetworkConnectTimeoutException = _NetworkConnectTimeoutException;

// src/decorators/injectable.decorator.ts
init_injector_explorer();
init_token();
function Injectable(options = {}) {
  const { lifetime = "scope", deps = [] } = options;
  return (target) => {
    if (typeof target !== "function" || !target.prototype) {
      throw new Error(`@Injectable can only be applied to classes, not ${typeof target}`);
    }
    const key = target;
    InjectorExplorer.enqueue({
      key,
      implementation: key,
      lifetime,
      deps,
      isController: false
    });
  };
}
__name(Injectable, "Injectable");

// src/non-electron-process.ts
init_logger();
init_forward_ref();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AppInjector,
  BadGatewayException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
  ForwardReference,
  GatewayTimeoutException,
  HttpVersionNotSupportedException,
  Injectable,
  InsufficientStorageException,
  InternalServerException,
  Logger,
  LoopDetectedException,
  MethodNotAllowedException,
  NetworkAuthenticationRequiredException,
  NetworkConnectTimeoutException,
  NotAcceptableException,
  NotExtendedException,
  NotFoundException,
  NotImplementedException,
  PaymentRequiredException,
  RequestTimeoutException,
  ResponseException,
  RootInjector,
  ServiceUnavailableException,
  Token,
  TooManyRequestsException,
  UnauthorizedException,
  UpgradeRequiredException,
  VariantAlsoNegotiatesException,
  forwardRef,
  inject,
  resetRootInjector
});
/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 */
//# sourceMappingURL=child.js.map