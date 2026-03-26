/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 */
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};

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
function token(target) {
  return new Token(target);
}
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
    __name(token, "token");
  }
});

// src/utils/logger.ts
import * as fs from "fs";
import * as path from "path";
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
var Logger, fileSettings, fileStates, logLevels, logLevelRank, logLevelColors, logLevelChannel;
var init_logger = __esm({
  "src/utils/logger.ts"() {
    "use strict";
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

// src/main.ts
init_app_injector();
init_token();

// src/decorators/controller.decorator.ts
init_injector_explorer();
var controllerMetaMap = /* @__PURE__ */ new WeakMap();
function Controller(options = {}) {
  return (target) => {
    const meta = {
      deps: options.deps ?? []
    };
    controllerMetaMap.set(target, meta);
    InjectorExplorer.enqueue({
      key: target,
      implementation: target,
      lifetime: "scope",
      deps: options.deps ?? [],
      isController: true
    });
  };
}
__name(Controller, "Controller");
function getControllerMetadata(target) {
  return controllerMetaMap.get(target);
}
__name(getControllerMetadata, "getControllerMetadata");

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

// src/decorators/method.decorator.ts
var ATOMIC_METHODS = /* @__PURE__ */ new Set(["GET", "POST", "PUT", "PATCH", "DELETE"]);
function isAtomicHttpMethod(m) {
  return typeof m === "string" && ATOMIC_METHODS.has(m);
}
__name(isAtomicHttpMethod, "isAtomicHttpMethod");
var routeMetaMap = /* @__PURE__ */ new WeakMap();
function createRouteDecorator(verb) {
  return (path2, options = {}) => {
    return (target, propertyKey) => {
      const ctor = target.constructor;
      const existing = routeMetaMap.get(ctor) ?? [];
      existing.push({
        method: verb,
        path: (path2 ?? "").trim().replace(/^\/|\/$/g, ""),
        handler: propertyKey,
        guards: options.guards ?? [],
        middlewares: options.middlewares ?? []
      });
      routeMetaMap.set(ctor, existing);
    };
  };
}
__name(createRouteDecorator, "createRouteDecorator");
function getRouteMetadata(target) {
  return routeMetaMap.get(target) ?? [];
}
__name(getRouteMetadata, "getRouteMetadata");
var Get = createRouteDecorator("GET");
var Post = createRouteDecorator("POST");
var Put = createRouteDecorator("PUT");
var Patch = createRouteDecorator("PATCH");
var Delete = createRouteDecorator("DELETE");

// src/internal/router.ts
init_injector_explorer();
init_logger();

// src/utils/radix-tree.ts
var _RadixNode = class _RadixNode {
  /**
   * Creates a new RadixNode.
   * @param segment - The segment of the path this node represents.
   */
  constructor(segment) {
    this.children = [];
    this.segment = segment;
    this.isParam = segment.startsWith(":");
    if (this.isParam) {
      this.paramName = segment.slice(1);
    }
  }
  /**
   * Matches a child node against a given segment.
   * This method checks if the segment matches any of the children nodes.
   * @param segment - The segment to match against the children of this node.
   * @returns A child node that matches the segment, or undefined if no match is found.
   */
  matchChild(segment) {
    for (const child of this.children) {
      if (child.isParam || segment.startsWith(child.segment))
        return child;
    }
    return void 0;
  }
  /**
   * Finds a child node that matches the segment exactly.
   * This method checks if there is a child node that matches the segment exactly.
   * @param segment - The segment to find an exact match for among the children of this node.
   * @returns A child node that matches the segment exactly, or undefined if no match is found.
   */
  findExactChild(segment) {
    return this.children.find((c) => c.segment === segment);
  }
  /**
   * Adds a child node to this node's children.
   * This method adds a new child node to the list of children for this node.
   * @param node - The child node to add to this node's children.
   */
  addChild(node) {
    this.children.push(node);
  }
};
__name(_RadixNode, "RadixNode");
var RadixNode = _RadixNode;
var _RadixTree = class _RadixTree {
  constructor() {
    this.root = new RadixNode("");
  }
  /**
   * Inserts a path and its associated value into the Radix Tree.
   * This method normalizes the path and inserts it into the tree, associating it with
   * @param path - The path to insert into the tree.
   * @param value - The value to associate with the path.
   */
  insert(path2, value) {
    const segments = this.normalize(path2);
    this.insertRecursive(this.root, segments, value);
  }
  /**
   * Recursively inserts a path into the Radix Tree.
   * This method traverses the tree and inserts the segments of the path, creating new nodes
   * @param node - The node to start inserting from.
   * @param segments - The segments of the path to insert.
   * @param value - The value to associate with the path.
   */
  insertRecursive(node, segments, value) {
    if (segments.length === 0) {
      node.value = value;
      return;
    }
    const segment = segments[0] ?? "";
    let child = node.children.find(
      (c) => c.isParam === segment.startsWith(":") && (c.isParam || c.segment === segment)
    );
    if (!child) {
      child = new RadixNode(segment);
      node.addChild(child);
    }
    this.insertRecursive(child, segments.slice(1), value);
  }
  /**
   * Searches for a path in the Radix Tree.
   * This method normalizes the path and searches for it in the tree, returning the node
   * @param path - The path to search for in the Radix Tree.
   * @returns An ISearchResult containing the node and parameters if a match is found, otherwise undefined.
   */
  search(path2) {
    const segments = this.normalize(path2);
    return this.searchRecursive(this.root, segments, {});
  }
  collectValues(node, values = []) {
    if (!node) {
      node = this.root;
    }
    if (node.value !== void 0) {
      values.push(node.value);
    }
    for (const child of node.children) {
      this.collectValues(child, values);
    }
    return values;
  }
  /**
   * Recursively searches for a path in the Radix Tree.
   * This method traverses the tree and searches for the segments of the path, collecting parameters
   * @param node - The node to start searching from.
   * @param segments - The segments of the path to search for.
   * @param params - The parameters collected during the search.
   * @returns An ISearchResult containing the node and parameters if a match is found, otherwise undefined.
   */
  searchRecursive(node, segments, params) {
    if (segments.length === 0) {
      if (node.value !== void 0) {
        return {
          node,
          params
        };
      }
      return void 0;
    }
    const [segment, ...rest] = segments;
    const staticChildren = [];
    const paramChildren = [];
    for (const child of node.children) {
      if (child.isParam) {
        paramChildren.push(child);
      } else if (segment === child.segment) {
        staticChildren.push(child);
      }
    }
    for (const child of staticChildren) {
      if (rest.length === 0) {
        if (child.value !== void 0 || child.children.length > 0) {
          return { node: child, params };
        }
      }
      const result = this.searchRecursive(child, rest, params);
      if (result) return result;
    }
    for (const child of paramChildren) {
      const paramName = child.paramName;
      const childParams = {
        ...params,
        [paramName]: segment ?? ""
      };
      if (rest.length === 0) {
        if (child.value !== void 0 || child.children.length > 0) {
          return { node: child, params: childParams };
        }
      }
      const result = this.searchRecursive(child, rest, childParams);
      if (result) return result;
    }
    return void 0;
  }
  /**
   * Normalizes a path into an array of segments.
   * This method removes leading and trailing slashes, splits the path by slashes, and
   * @param path - The path to normalize.
   * @returns An array of normalized path segments.
   */
  normalize(path2) {
    const segments = path2.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);
    return ["", ...segments];
  }
};
__name(_RadixTree, "RadixTree");
var RadixTree = _RadixTree;

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

// src/internal/request.ts
init_app_injector();
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

// src/internal/router.ts
var Router = class {
  constructor() {
    this.routes = new RadixTree();
    this.rootMiddlewares = [];
    this.lazyRoutes = /* @__PURE__ */ new Map();
  }
  // -------------------------------------------------------------------------
  // Registration
  // -------------------------------------------------------------------------
  registerController(controllerClass, pathPrefix, routeGuards = [], routeMiddlewares = []) {
    const meta = getControllerMetadata(controllerClass);
    if (!meta) {
      throw new Error(`[Noxus] Missing @Controller decorator on ${controllerClass.name}`);
    }
    const routeMeta = getRouteMetadata(controllerClass);
    for (const def of routeMeta) {
      const fullPath = `${pathPrefix}/${def.path}`.replace(/\/+/g, "/").replace(/\/$/, "") || "/";
      const guards = [.../* @__PURE__ */ new Set([...routeGuards, ...def.guards])];
      const middlewares = [.../* @__PURE__ */ new Set([...routeMiddlewares, ...def.middlewares])];
      const routeDef = {
        method: def.method,
        path: fullPath,
        controller: controllerClass,
        handler: def.handler,
        guards,
        middlewares
      };
      this.routes.insert(fullPath + "/" + def.method, routeDef);
      const guardInfo = guards.length ? `<${guards.map((g) => g.name).join("|")}>` : "";
      Logger.log(`Mapped {${def.method} /${fullPath}}${guardInfo} route`);
    }
    const ctrlGuardInfo = routeGuards.length ? `<${routeGuards.map((g) => g.name).join("|")}>` : "";
    Logger.log(`Mapped ${controllerClass.name}${ctrlGuardInfo} controller's routes`);
    return this;
  }
  registerLazyRoute(pathPrefix, load, guards = [], middlewares = []) {
    const normalized = pathPrefix.replace(/^\/+|\/+$/g, "");
    this.lazyRoutes.set(normalized, { load, guards, middlewares, loading: null, loaded: false });
    Logger.log(`Registered lazy route prefix {${normalized}}`);
    return this;
  }
  defineRootMiddleware(middleware) {
    this.rootMiddlewares.push(middleware);
    return this;
  }
  getRegisteredRoutes() {
    const allRoutes = this.routes.collectValues();
    return allRoutes.map((r) => ({ method: r.method, path: r.path }));
  }
  getLazyRoutes() {
    return [...this.lazyRoutes.entries()].map(([prefix, entry]) => ({
      prefix,
      loaded: entry.loaded
    }));
  }
  // -------------------------------------------------------------------------
  // Request handling
  // -------------------------------------------------------------------------
  async handle(request) {
    return request.method === "BATCH" ? this.handleBatch(request) : this.handleAtomic(request);
  }
  async handleAtomic(request) {
    Logger.comment(`>     ${request.method} /${request.path}`);
    const t0 = performance.now();
    const response = { requestId: request.id, status: 200, body: null };
    let isCritical = false;
    try {
      const routeDef = await this.findRoute(request);
      await this.resolveController(request, response, routeDef);
      if (response.status >= 400) throw new ResponseException(response.status, response.error);
    } catch (error) {
      this.fillErrorResponse(response, error, (c) => {
        isCritical = c;
      });
    } finally {
      this.logResponse(request, response, performance.now() - t0, isCritical);
      return response;
    }
  }
  async handleBatch(request) {
    Logger.comment(`>     ${request.method} /${request.path}`);
    const t0 = performance.now();
    const response = {
      requestId: request.id,
      status: 200,
      body: { responses: [] }
    };
    let isCritical = false;
    try {
      const payload = this.normalizeBatchPayload(request.body);
      response.body.responses = await Promise.all(
        payload.requests.map((item, i) => {
          const id = item.requestId ?? `${request.id}:${i}`;
          return this.handleAtomic(new Request(request.event, request.senderId, id, item.method, item.path, item.body, item.query));
        })
      );
    } catch (error) {
      this.fillErrorResponse(response, error, (c) => {
        isCritical = c;
      });
    } finally {
      this.logResponse(request, response, performance.now() - t0, isCritical);
      return response;
    }
  }
  // -------------------------------------------------------------------------
  // Route resolution
  // -------------------------------------------------------------------------
  tryFindRoute(request) {
    const matched = this.routes.search(request.path);
    if (!matched?.node || matched.node.children.length === 0) return void 0;
    return matched.node.findExactChild(request.method)?.value;
  }
  async findRoute(request) {
    const direct = this.tryFindRoute(request);
    if (direct) return direct;
    await this.tryLoadLazyRoute(request.path);
    const afterLazy = this.tryFindRoute(request);
    if (afterLazy) return afterLazy;
    throw new NotFoundException(`No route matches ${request.method} ${request.path}`);
  }
  async tryLoadLazyRoute(requestPath) {
    const firstSegment = requestPath.replace(/^\/+/, "").split("/")[0] ?? "";
    for (const [prefix, entry] of this.lazyRoutes) {
      if (entry.loaded) continue;
      const normalized = requestPath.replace(/^\/+/, "");
      if (normalized === prefix || normalized.startsWith(prefix + "/") || firstSegment === prefix) {
        if (!entry.loading) entry.loading = this.loadLazyModule(prefix, entry);
        await entry.loading;
        return;
      }
    }
  }
  async loadLazyModule(prefix, entry) {
    const t0 = performance.now();
    InjectorExplorer.beginAccumulate();
    await entry.load?.();
    entry.loading = null;
    entry.load = null;
    await InjectorExplorer.flushAccumulated(entry.guards, entry.middlewares, prefix);
    entry.loaded = true;
    Logger.info(`Lazy-loaded module for prefix {${prefix}} in ${Math.round(performance.now() - t0)}ms`);
  }
  // -------------------------------------------------------------------------
  // Pipeline
  // -------------------------------------------------------------------------
  async resolveController(request, response, routeDef) {
    const instance = request.context.resolve(routeDef.controller);
    Object.assign(request.params, this.extractParams(request.path, routeDef.path));
    await this.runPipeline(request, response, routeDef, instance);
  }
  async runPipeline(request, response, routeDef, controllerInstance) {
    const middlewares = [.../* @__PURE__ */ new Set([...this.rootMiddlewares, ...routeDef.middlewares])];
    const mwMax = middlewares.length - 1;
    const guardMax = mwMax + routeDef.guards.length;
    let index = -1;
    const dispatch = /* @__PURE__ */ __name(async (i) => {
      if (i <= index) throw new Error("next() called multiple times");
      index = i;
      if (i <= mwMax) {
        await this.runMiddleware(request, response, dispatch.bind(null, i + 1), middlewares[i]);
        if (response.status >= 400) throw new ResponseException(response.status, response.error);
        return;
      }
      if (i <= guardMax) {
        await this.runGuard(request, routeDef.guards[i - middlewares.length]);
        await dispatch(i + 1);
        return;
      }
      const action = controllerInstance[routeDef.handler];
      response.body = await action.call(controllerInstance, request, response);
      if (response.body === void 0) response.body = {};
    }, "dispatch");
    await dispatch(0);
  }
  async runMiddleware(request, response, next, middleware) {
    await middleware(request, response, next);
  }
  async runGuard(request, guard) {
    if (!await guard(request)) {
      throw new UnauthorizedException(`Unauthorized for ${request.method} ${request.path}`);
    }
  }
  // -------------------------------------------------------------------------
  // Utilities
  // -------------------------------------------------------------------------
  extractParams(actual, template) {
    const aParts = actual.split("/");
    const tParts = template.split("/");
    const params = {};
    tParts.forEach((part, i) => {
      if (part.startsWith(":")) params[part.slice(1)] = aParts[i] ?? "";
    });
    return params;
  }
  normalizeBatchPayload(body) {
    if (body === null || typeof body !== "object") {
      throw new BadRequestException("Batch payload must be an object containing a requests array.");
    }
    const { requests } = body;
    if (!Array.isArray(requests)) throw new BadRequestException("Batch payload must define a requests array.");
    return { requests: requests.map((e, i) => this.normalizeBatchItem(e, i)) };
  }
  normalizeBatchItem(entry, index) {
    if (entry === null || typeof entry !== "object") throw new BadRequestException(`Batch request at index ${index} must be an object.`);
    const { requestId, path: path2, method, body, query } = entry;
    if (requestId !== void 0 && typeof requestId !== "string") throw new BadRequestException(`Batch request at index ${index} has an invalid requestId.`);
    if (typeof path2 !== "string" || !path2.length) throw new BadRequestException(`Batch request at index ${index} must define a non-empty path.`);
    if (typeof method !== "string") throw new BadRequestException(`Batch request at index ${index} must define an HTTP method.`);
    const normalized = method.toUpperCase();
    if (!isAtomicHttpMethod(normalized)) throw new BadRequestException(`Batch request at index ${index} uses unsupported method ${method}.`);
    return { requestId, path: path2, method: normalized, body, query };
  }
  fillErrorResponse(response, error, setCritical) {
    response.body = void 0;
    if (error instanceof ResponseException) {
      response.status = error.status;
      response.error = error.message;
      response.stack = error.stack;
    } else if (error instanceof Error) {
      setCritical(true);
      response.status = 500;
      response.error = error.message || "Internal Server Error";
      response.stack = error.stack;
    } else {
      setCritical(true);
      response.status = 500;
      response.error = "Unknown error occurred";
    }
  }
  logResponse(request, response, ms, isCritical) {
    const msg = `< ${response.status} ${request.method} /${request.path} ${Logger.colors.yellow}${Math.round(ms)}ms${Logger.colors.initial}`;
    if (response.status < 400) Logger.log(msg);
    else if (response.status < 500) Logger.warn(msg);
    else isCritical ? Logger.critical(msg) : Logger.error(msg);
    if (response.error) {
      isCritical ? Logger.critical(response.error) : Logger.error(response.error);
      if (response.stack) Logger.errorStack(response.stack);
    }
  }
};
__name(Router, "Router");
Router = __decorateClass([
  Injectable({ lifetime: "singleton" })
], Router);

// src/internal/app.ts
import { app, BrowserWindow as BrowserWindow2, ipcMain, MessageChannelMain } from "electron/main";
init_app_injector();
init_injector_explorer();
init_logger();

// src/window/window-manager.ts
import { BrowserWindow } from "electron/main";
init_logger();
var WindowManager = class {
  constructor() {
    this._windows = /* @__PURE__ */ new Map();
    this.listeners = /* @__PURE__ */ new Map();
  }
  // -------------------------------------------------------------------------
  // Creation
  // -------------------------------------------------------------------------
  /**
   * Creates a BrowserWindow, optionally performs an animated expand to the
   * work area, and registers it in the manager.
   *
   * If expandToWorkArea is true:
   * 1. The window is created at the given initial size (defaults to 600×600, centered).
   * 2. An animated setBounds expands it to the full work area.
   * 3. The returned promise resolves only after the animation, so callers
   *    can safely call win.loadFile() without the viewbox freeze.
   *
   * @param config Window configuration.
   * @param isMain Mark this window as the main window (accessible via getMain()).
   */
  async create(config, isMain = false) {
    const {
      expandToWorkArea = false,
      expandAnimationDuration = 600,
      ...bwOptions
    } = config;
    const win = new BrowserWindow({ show: false, ...bwOptions });
    this._register(win, isMain);
    if (expandToWorkArea) {
      await this._expandToWorkArea(win, expandAnimationDuration);
    }
    win.once("ready-to-show", () => win.show());
    Logger.log(`[WindowManager] Created window #${win.id}${isMain ? " (main)" : ""}`);
    return win;
  }
  /**
   * Creates the initial "splash" window that is shown immediately after
   * app.whenReady(). It is displayed instantly (show: true, no preload
   * loading) and then expanded to the work area with animation.
   *
   * After the animation completes you can call win.loadFile() without
   * experiencing the viewbox freeze.
   *
   * This is the recommended way to get pixels on screen as fast as possible.
   *
   * @example
   * const win = await wm.createSplash({
   *   webPreferences: { preload: path.join(__dirname, 'preload.js') }
   * });
   * win.loadFile('index.html');
   */
  async createSplash(options = {}) {
    const {
      animationDuration = 10,
      expandToWorkArea = true,
      ...bwOptions
    } = options;
    const win = new BrowserWindow({
      width: 600,
      height: 600,
      center: true,
      show: true,
      ...bwOptions
    });
    this._register(win, true);
    Logger.log(`[WindowManager] Splash window #${win.id} created`);
    if (expandToWorkArea) {
      await (() => new Promise((r) => setTimeout(r, 500)))();
      await this._expandToWorkArea(win, animationDuration);
    }
    return win;
  }
  // -------------------------------------------------------------------------
  // Accessors
  // -------------------------------------------------------------------------
  /** Returns all currently open windows. */
  getAll() {
    return [...this._windows.values()];
  }
  /** Returns the window designated as main, or undefined. */
  getMain() {
    return this._mainWindowId !== void 0 ? this._windows.get(this._mainWindowId) : void 0;
  }
  /** Returns a window by its Electron id, or undefined. */
  getById(id) {
    return this._windows.get(id);
  }
  /** Returns the number of open windows. */
  get count() {
    return this._windows.size;
  }
  // -------------------------------------------------------------------------
  // Actions
  // -------------------------------------------------------------------------
  /** Closes and destroys a window by id. */
  close(id) {
    const win = this._windows.get(id);
    if (!win) {
      Logger.warn(`[WindowManager] Window #${id} not found`);
      return;
    }
    win.destroy();
  }
  /** Closes all windows. */
  closeAll() {
    for (const win of this._windows.values()) {
      win.destroy();
    }
  }
  /**
   * Sends a message to a specific window via webContents.send.
   * @param id Target window id.
   * @param channel IPC channel name.
   * @param args Payload.
   */
  send(id, channel, ...args) {
    const win = this._windows.get(id);
    if (!win || win.isDestroyed()) {
      Logger.warn(`[WindowManager] Cannot send to window #${id}: not found or destroyed`);
      return;
    }
    win.webContents.send(channel, ...args);
  }
  /**
   * Broadcasts a message to all open windows.
   */
  broadcast(channel, ...args) {
    for (const win of this._windows.values()) {
      if (!win.isDestroyed()) {
        win.webContents.send(channel, ...args);
      }
    }
  }
  // -------------------------------------------------------------------------
  // Events
  // -------------------------------------------------------------------------
  on(event, handler) {
    const set = this.listeners.get(event) ?? /* @__PURE__ */ new Set();
    set.add(handler);
    this.listeners.set(event, set);
    return () => set.delete(handler);
  }
  _emit(event, win) {
    this.listeners.get(event)?.forEach((h) => h(win));
  }
  // -------------------------------------------------------------------------
  // Private
  // -------------------------------------------------------------------------
  _register(win, isMain) {
    this._windows.set(win.id, win);
    if (isMain && this._mainWindowId === void 0) {
      this._mainWindowId = win.id;
    }
    this._emit("created", win);
    win.on("focus", () => this._emit("focused", win));
    win.on("blur", () => this._emit("blurred", win));
    win.once("closed", () => {
      this._windows.delete(win.id);
      if (this._mainWindowId === win.id) {
        this._mainWindowId = void 0;
      }
      Logger.log(`[WindowManager] Window #${win.id} closed`);
      this._emit("closed", win);
    });
  }
  /**
   * Animates the window to the full work area of the primary display.
   * Resolves only after the animation is complete, so that content loaded
   * afterward gets the correct surface size (no viewbox freeze).
   */
  _expandToWorkArea(win, animationDuration) {
    return new Promise((resolve) => {
      win.maximize();
      let resolved = false;
      const done = /* @__PURE__ */ __name(() => {
        if (resolved) {
          return;
        }
        resolved = true;
        win.removeListener("resize", done);
        resolve();
      }, "done");
      win.once("resize", done);
      setTimeout(done, animationDuration);
    });
  }
};
__name(WindowManager, "WindowManager");
WindowManager = __decorateClass([
  Injectable({ lifetime: "singleton" })
], WindowManager);

// src/internal/socket.ts
init_logger();
var NoxSocket = class {
  constructor() {
    this.channels = /* @__PURE__ */ new Map();
  }
  register(senderId, requestChannel, socketChannel) {
    this.channels.set(senderId, { request: requestChannel, socket: socketChannel });
  }
  get(senderId) {
    return this.channels.get(senderId);
  }
  unregister(senderId) {
    this.channels.delete(senderId);
  }
  getSenderIds() {
    return [...this.channels.keys()];
  }
  emit(eventName, payload, targetSenderIds) {
    const normalizedEvent = eventName.trim();
    if (normalizedEvent.length === 0) {
      throw new Error("Renderer event name must be a non-empty string.");
    }
    const recipients = targetSenderIds ?? this.getSenderIds();
    for (const senderId of recipients) {
      const channel = this.channels.get(senderId);
      if (!channel) {
        Logger.warn(`No message channel found for sender ID: ${senderId} while emitting "${normalizedEvent}".`);
        continue;
      }
      try {
        channel.socket.port1.postMessage(createRendererEventMessage(normalizedEvent, payload));
      } catch (error) {
        Logger.error(`[Noxus] Failed to emit "${normalizedEvent}" to sender ${senderId}.`, error);
      }
    }
  }
  emitToRenderer(senderId, eventName, payload) {
    if (!this.channels.has(senderId)) {
      return false;
    }
    this.emit(eventName, payload, [senderId]);
    return true;
  }
};
__name(NoxSocket, "NoxSocket");
NoxSocket = __decorateClass([
  Injectable({ lifetime: "singleton" })
], NoxSocket);

// src/internal/app.ts
var NoxApp = class {
  constructor(router, socket, windowManager) {
    this.router = router;
    this.socket = socket;
    this.windowManager = windowManager;
    // -------------------------------------------------------------------------
    // IPC
    // -------------------------------------------------------------------------
    this.onRendererMessage = /* @__PURE__ */ __name(async (event) => {
      const { senderId, requestId, path: path2, method, body, query } = event.data;
      const channels = this.socket.get(senderId);
      if (!channels) {
        Logger.error(`No message channel found for sender ID: ${senderId}`);
        return;
      }
      try {
        const request = new Request(event, senderId, requestId, method, path2, body, query);
        const response = await this.router.handle(request);
        channels.request.port1.postMessage(response);
      } catch (err) {
        const response = {
          requestId,
          status: 500,
          body: null,
          error: err instanceof Error ? err.message : "Internal Server Error"
        };
        channels.request.port1.postMessage(response);
      }
    }, "onRendererMessage");
  }
  // -------------------------------------------------------------------------
  // Initialisation
  // -------------------------------------------------------------------------
  async init() {
    ipcMain.on("gimme-my-port", this.giveTheRendererAPort.bind(this));
    app.once("activate", this.onAppActivated.bind(this));
    app.once("window-all-closed", this.onAllWindowsClosed.bind(this));
    console.log("");
    return this;
  }
  // -------------------------------------------------------------------------
  // Public API
  // -------------------------------------------------------------------------
  /**
   * Registers a lazy route. The file behind this prefix is dynamically
   * imported on the first IPC request that targets it.
   *
   * The import function should NOT statically reference heavy modules —
   * the whole point is to defer their loading.
   *
   * @example
   * noxApp.lazy('auth', () => import('./modules/auth/auth.controller.js'));
   * noxApp.lazy('reporting', () => import('./modules/reporting/index.js'));
   */
  lazy(pathPrefix, load, guards = [], middlewares = []) {
    this.router.registerLazyRoute(pathPrefix, load, guards, middlewares);
    return this;
  }
  /**
   * Eagerly loads a set of modules (controllers + services) before start().
   * Use this for modules that provide services needed by your IApp.onReady().
   *
   * All imports run in parallel; DI is flushed with the two-phase guarantee.
   */
  async load(importFns) {
    InjectorExplorer.beginAccumulate();
    await Promise.all(importFns.map((fn) => fn()));
    await InjectorExplorer.flushAccumulated();
    return this;
  }
  /**
   * Registers a global middleware applied to every route.
   */
  use(middleware) {
    this.router.defineRootMiddleware(middleware);
    return this;
  }
  /**
   * Sets the application service (implements IApp) that receives lifecycle events.
   * @param appClass - Class decorated with @Injectable that implements IApp.
   */
  configure(appClass) {
    this.appService = inject(appClass);
    return this;
  }
  /**
   * Calls IApp.onReady(). Should be called after configure() and any lazy()
   * registrations are set up.
   */
  start() {
    this.appService?.onReady();
    return this;
  }
  giveTheRendererAPort(event) {
    const senderId = event.sender.id;
    if (this.socket.get(senderId)) {
      this.shutdownChannel(senderId);
    }
    const requestChannel = new MessageChannelMain();
    const socketChannel = new MessageChannelMain();
    requestChannel.port1.on("message", this.onRendererMessage);
    requestChannel.port1.start();
    socketChannel.port1.start();
    event.sender.once("destroyed", () => this.shutdownChannel(senderId));
    this.socket.register(senderId, requestChannel, socketChannel);
    event.sender.postMessage("port", { senderId }, [requestChannel.port2, socketChannel.port2]);
  }
  // -------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------
  onAppActivated() {
    if (process.platform === "darwin" && BrowserWindow2.getAllWindows().length === 0) {
      this.appService?.onActivated();
    }
  }
  async onAllWindowsClosed() {
    for (const senderId of this.socket.getSenderIds()) {
      this.shutdownChannel(senderId);
    }
    Logger.info("All windows closed, shutting down application...");
    await this.appService?.dispose();
    if (process.platform !== "darwin") app.quit();
  }
  shutdownChannel(channelSenderId) {
    const channels = this.socket.get(channelSenderId);
    if (!channels) {
      return;
    }
    channels.request.port1.off("message", this.onRendererMessage);
    channels.request.port1.close();
    channels.request.port2.close();
    channels.socket.port1.close();
    channels.socket.port2.close();
    this.socket.unregister(channelSenderId);
  }
};
__name(NoxApp, "NoxApp");
NoxApp = __decorateClass([
  Injectable({ lifetime: "singleton", deps: [Router, NoxSocket, WindowManager] })
], NoxApp);

// src/internal/bootstrap.ts
init_app_injector();
init_injector_explorer();
init_logger();
import { app as app2 } from "electron/main";
async function bootstrapApplication(config = {}) {
  await app2.whenReady();
  if (config.logLevel !== void 0) {
    if (config.logLevel === "none") {
      Logger.setLogLevel([]);
    } else if (Array.isArray(config.logLevel)) {
      Logger.setLogLevel(config.logLevel);
    } else {
      Logger.setLogLevel(config.logLevel);
    }
  }
  const overrides = /* @__PURE__ */ new Map();
  for (const { token: token2, useValue } of config.singletons ?? []) {
    overrides.set(token2, useValue);
    RootInjector.singletons.set(token2, useValue);
  }
  InjectorExplorer.setControllerRegistrar((controllerClass, pathPrefix, routeGuards, routeMiddlewares) => {
    const router = inject(Router);
    router.registerController(controllerClass, pathPrefix, routeGuards, routeMiddlewares);
  });
  InjectorExplorer.processPending(overrides);
  const noxApp = inject(NoxApp);
  if (config.routes?.length) {
    for (const route of config.routes) {
      if (route.load) {
        noxApp.lazy(route.path, route.load, route.guards, route.middlewares);
      }
    }
  }
  if (config.eagerLoad?.length) {
    await noxApp.load(config.eagerLoad);
  }
  await noxApp.init();
  return noxApp;
}
__name(bootstrapApplication, "bootstrapApplication");

// src/main.ts
init_logger();
init_forward_ref();

// src/internal/routes.ts
function defineRoutes(routes) {
  const flat = flattenRoutes(routes);
  const paths = flat.map((r) => r.path);
  const duplicates = paths.filter((p, i) => paths.indexOf(p) !== i);
  if (duplicates.length > 0) {
    throw new Error(
      `[Noxus] Duplicate route prefixes detected: ${[...new Set(duplicates)].map((d) => `"${d}"`).join(", ")}`
    );
  }
  const sorted = [...paths].sort();
  for (let i = 0; i < sorted.length - 1; i++) {
    const a = sorted[i];
    const b = sorted[i + 1];
    if (b.startsWith(a + "/")) {
      throw new Error(
        `[Noxus] Overlapping route prefixes detected: "${a}" and "${b}". Use nested children under "${a}" instead of declaring both as top-level routes.`
      );
    }
  }
  return flat;
}
__name(defineRoutes, "defineRoutes");
function flattenRoutes(routes, parentPath = "", parentGuards = [], parentMiddlewares = []) {
  const result = [];
  for (const route of routes) {
    const path2 = [parentPath, route.path.replace(/^\/+|\/+$/g, "")].filter(Boolean).join("/");
    const guards = [.../* @__PURE__ */ new Set([...parentGuards, ...route.guards ?? []])];
    const middlewares = [.../* @__PURE__ */ new Set([...parentMiddlewares, ...route.middlewares ?? []])];
    if (route.load) {
      result.push({ ...route, path: path2, guards, middlewares });
    }
    if (route.children?.length) {
      result.push(...flattenRoutes(route.children, path2, guards, middlewares));
    }
    if (!route.load && !route.children?.length) {
      throw new Error(
        `[Noxus] Route "${path2}" has neither a load function nor children. It must have at least one of them.`
      );
    }
  }
  return result;
}
__name(flattenRoutes, "flattenRoutes");
export {
  AppInjector,
  BadGatewayException,
  BadRequestException,
  ConflictException,
  Controller,
  Delete,
  ForbiddenException,
  ForwardReference,
  GatewayTimeoutException,
  Get,
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
  NoxApp,
  NoxSocket,
  Patch,
  PaymentRequiredException,
  Post,
  Put,
  RENDERER_EVENT_TYPE,
  Request,
  RequestTimeoutException,
  ResponseException,
  RootInjector,
  Router,
  ServiceUnavailableException,
  Token,
  TooManyRequestsException,
  UnauthorizedException,
  UpgradeRequiredException,
  VariantAlsoNegotiatesException,
  WindowManager,
  bootstrapApplication,
  createRendererEventMessage,
  defineRoutes,
  forwardRef,
  getControllerMetadata,
  getRouteMetadata,
  inject,
  isAtomicHttpMethod,
  isRendererEventMessage,
  resetRootInjector,
  token
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
 * Entry point for Electron main-process consumers.
 */
//# sourceMappingURL=main.mjs.map