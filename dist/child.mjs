/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 */
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// src/DI/app-injector.ts
import "reflect-metadata";

// src/decorators/inject.decorator.ts
import "reflect-metadata";
var INJECT_METADATA_KEY = "custom:inject";
function Inject(token) {
  return (target, propertyKey, parameterIndex) => {
    const existingParameters = Reflect.getOwnMetadata(INJECT_METADATA_KEY, target) || [];
    existingParameters[parameterIndex] = token;
    Reflect.defineMetadata(INJECT_METADATA_KEY, existingParameters, target);
  };
}
__name(Inject, "Inject");

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
var _BadRequestException = class _BadRequestException extends ResponseException {
  constructor() {
    super(...arguments);
    __publicField(this, "status", 400);
  }
};
__name(_BadRequestException, "BadRequestException");
var BadRequestException = _BadRequestException;
var _UnauthorizedException = class _UnauthorizedException extends ResponseException {
  constructor() {
    super(...arguments);
    __publicField(this, "status", 401);
  }
};
__name(_UnauthorizedException, "UnauthorizedException");
var UnauthorizedException = _UnauthorizedException;
var _PaymentRequiredException = class _PaymentRequiredException extends ResponseException {
  constructor() {
    super(...arguments);
    __publicField(this, "status", 402);
  }
};
__name(_PaymentRequiredException, "PaymentRequiredException");
var PaymentRequiredException = _PaymentRequiredException;
var _ForbiddenException = class _ForbiddenException extends ResponseException {
  constructor() {
    super(...arguments);
    __publicField(this, "status", 403);
  }
};
__name(_ForbiddenException, "ForbiddenException");
var ForbiddenException = _ForbiddenException;
var _NotFoundException = class _NotFoundException extends ResponseException {
  constructor() {
    super(...arguments);
    __publicField(this, "status", 404);
  }
};
__name(_NotFoundException, "NotFoundException");
var NotFoundException = _NotFoundException;
var _MethodNotAllowedException = class _MethodNotAllowedException extends ResponseException {
  constructor() {
    super(...arguments);
    __publicField(this, "status", 405);
  }
};
__name(_MethodNotAllowedException, "MethodNotAllowedException");
var MethodNotAllowedException = _MethodNotAllowedException;
var _NotAcceptableException = class _NotAcceptableException extends ResponseException {
  constructor() {
    super(...arguments);
    __publicField(this, "status", 406);
  }
};
__name(_NotAcceptableException, "NotAcceptableException");
var NotAcceptableException = _NotAcceptableException;
var _RequestTimeoutException = class _RequestTimeoutException extends ResponseException {
  constructor() {
    super(...arguments);
    __publicField(this, "status", 408);
  }
};
__name(_RequestTimeoutException, "RequestTimeoutException");
var RequestTimeoutException = _RequestTimeoutException;
var _ConflictException = class _ConflictException extends ResponseException {
  constructor() {
    super(...arguments);
    __publicField(this, "status", 409);
  }
};
__name(_ConflictException, "ConflictException");
var ConflictException = _ConflictException;
var _UpgradeRequiredException = class _UpgradeRequiredException extends ResponseException {
  constructor() {
    super(...arguments);
    __publicField(this, "status", 426);
  }
};
__name(_UpgradeRequiredException, "UpgradeRequiredException");
var UpgradeRequiredException = _UpgradeRequiredException;
var _TooManyRequestsException = class _TooManyRequestsException extends ResponseException {
  constructor() {
    super(...arguments);
    __publicField(this, "status", 429);
  }
};
__name(_TooManyRequestsException, "TooManyRequestsException");
var TooManyRequestsException = _TooManyRequestsException;
var _InternalServerException = class _InternalServerException extends ResponseException {
  constructor() {
    super(...arguments);
    __publicField(this, "status", 500);
  }
};
__name(_InternalServerException, "InternalServerException");
var InternalServerException = _InternalServerException;
var _NotImplementedException = class _NotImplementedException extends ResponseException {
  constructor() {
    super(...arguments);
    __publicField(this, "status", 501);
  }
};
__name(_NotImplementedException, "NotImplementedException");
var NotImplementedException = _NotImplementedException;
var _BadGatewayException = class _BadGatewayException extends ResponseException {
  constructor() {
    super(...arguments);
    __publicField(this, "status", 502);
  }
};
__name(_BadGatewayException, "BadGatewayException");
var BadGatewayException = _BadGatewayException;
var _ServiceUnavailableException = class _ServiceUnavailableException extends ResponseException {
  constructor() {
    super(...arguments);
    __publicField(this, "status", 503);
  }
};
__name(_ServiceUnavailableException, "ServiceUnavailableException");
var ServiceUnavailableException = _ServiceUnavailableException;
var _GatewayTimeoutException = class _GatewayTimeoutException extends ResponseException {
  constructor() {
    super(...arguments);
    __publicField(this, "status", 504);
  }
};
__name(_GatewayTimeoutException, "GatewayTimeoutException");
var GatewayTimeoutException = _GatewayTimeoutException;
var _HttpVersionNotSupportedException = class _HttpVersionNotSupportedException extends ResponseException {
  constructor() {
    super(...arguments);
    __publicField(this, "status", 505);
  }
};
__name(_HttpVersionNotSupportedException, "HttpVersionNotSupportedException");
var HttpVersionNotSupportedException = _HttpVersionNotSupportedException;
var _VariantAlsoNegotiatesException = class _VariantAlsoNegotiatesException extends ResponseException {
  constructor() {
    super(...arguments);
    __publicField(this, "status", 506);
  }
};
__name(_VariantAlsoNegotiatesException, "VariantAlsoNegotiatesException");
var VariantAlsoNegotiatesException = _VariantAlsoNegotiatesException;
var _InsufficientStorageException = class _InsufficientStorageException extends ResponseException {
  constructor() {
    super(...arguments);
    __publicField(this, "status", 507);
  }
};
__name(_InsufficientStorageException, "InsufficientStorageException");
var InsufficientStorageException = _InsufficientStorageException;
var _LoopDetectedException = class _LoopDetectedException extends ResponseException {
  constructor() {
    super(...arguments);
    __publicField(this, "status", 508);
  }
};
__name(_LoopDetectedException, "LoopDetectedException");
var LoopDetectedException = _LoopDetectedException;
var _NotExtendedException = class _NotExtendedException extends ResponseException {
  constructor() {
    super(...arguments);
    __publicField(this, "status", 510);
  }
};
__name(_NotExtendedException, "NotExtendedException");
var NotExtendedException = _NotExtendedException;
var _NetworkAuthenticationRequiredException = class _NetworkAuthenticationRequiredException extends ResponseException {
  constructor() {
    super(...arguments);
    __publicField(this, "status", 511);
  }
};
__name(_NetworkAuthenticationRequiredException, "NetworkAuthenticationRequiredException");
var NetworkAuthenticationRequiredException = _NetworkAuthenticationRequiredException;
var _NetworkConnectTimeoutException = class _NetworkConnectTimeoutException extends ResponseException {
  constructor() {
    super(...arguments);
    __publicField(this, "status", 599);
  }
};
__name(_NetworkConnectTimeoutException, "NetworkConnectTimeoutException");
var NetworkConnectTimeoutException = _NetworkConnectTimeoutException;

// src/utils/forward-ref.ts
var _ForwardReference = class _ForwardReference {
  constructor(forwardRefFn) {
    __publicField(this, "forwardRefFn");
    this.forwardRefFn = forwardRefFn;
  }
};
__name(_ForwardReference, "ForwardReference");
var ForwardReference = _ForwardReference;
function forwardRef(fn) {
  return new ForwardReference(fn);
}
__name(forwardRef, "forwardRef");

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
    if (target instanceof ForwardReference) {
      return new Proxy({}, {
        get: /* @__PURE__ */ __name((obj, prop, receiver) => {
          const realType = target.forwardRefFn();
          const instance = this.resolve(realType);
          const value = Reflect.get(instance, prop, receiver);
          return typeof value === "function" ? value.bind(instance) : value;
        }, "get"),
        set: /* @__PURE__ */ __name((obj, prop, value, receiver) => {
          const realType = target.forwardRefFn();
          const instance = this.resolve(realType);
          return Reflect.set(instance, prop, value, receiver);
        }, "set"),
        getPrototypeOf: /* @__PURE__ */ __name(() => {
          const realType = target.forwardRefFn();
          return realType.prototype;
        }, "getPrototypeOf")
      });
    }
    const binding = this.bindings.get(target);
    if (!binding) {
      if (target === void 0) {
        throw new InternalServerException("Failed to resolve a dependency injection : Undefined target type.\nThis might be caused by a circular dependency.");
      }
      const name = target.name || "unknown";
      throw new InternalServerException(`Failed to resolve a dependency injection : No binding for type ${name}.
Did you forget to use @Injectable() decorator ?`);
    }
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
   * Instantiates a class, resolving its dependencies.
   */
  instantiate(target) {
    const paramTypes = Reflect.getMetadata("design:paramtypes", target) || [];
    const injectParams = Reflect.getMetadata(INJECT_METADATA_KEY, target) || [];
    const params = paramTypes.map((paramType, index) => {
      const overrideToken = injectParams[index];
      const actualToken = overrideToken !== void 0 ? overrideToken : paramType;
      return this.resolve(actualToken);
    });
    return new target(...params);
  }
};
__name(_AppInjector, "AppInjector");
var AppInjector = _AppInjector;
function inject(t) {
  return RootInjector.resolve(t);
}
__name(inject, "inject");
var RootInjector = new AppInjector("root");

// src/decorators/guards.decorator.ts
function getGuardForController(controllerName) {
  const key = `${controllerName}`;
  return authorizations.get(key) ?? [];
}
__name(getGuardForController, "getGuardForController");
function getGuardForControllerAction(controllerName, actionName) {
  const key = `${controllerName}.${actionName}`;
  return authorizations.get(key) ?? [];
}
__name(getGuardForControllerAction, "getGuardForControllerAction");
var authorizations = /* @__PURE__ */ new Map();

// src/decorators/controller.decorator.ts
function getControllerMetadata(target) {
  return Reflect.getMetadata(CONTROLLER_METADATA_KEY, target);
}
__name(getControllerMetadata, "getControllerMetadata");
var CONTROLLER_METADATA_KEY = Symbol("CONTROLLER_METADATA_KEY");

// src/decorators/injectable.metadata.ts
var INJECTABLE_METADATA_KEY = Symbol("INJECTABLE_METADATA_KEY");
function defineInjectableMetadata(target, lifetime) {
  Reflect.defineMetadata(INJECTABLE_METADATA_KEY, lifetime, target);
}
__name(defineInjectableMetadata, "defineInjectableMetadata");
function getInjectableMetadata(target) {
  return Reflect.getMetadata(INJECTABLE_METADATA_KEY, target);
}
__name(getInjectableMetadata, "getInjectableMetadata");
function hasInjectableMetadata(target) {
  return Reflect.hasMetadata(INJECTABLE_METADATA_KEY, target);
}
__name(hasInjectableMetadata, "hasInjectableMetadata");

// src/decorators/method.decorator.ts
function createRouteDecorator(verb) {
  return (path2) => {
    return (target, propertyKey) => {
      const existingRoutes = Reflect.getMetadata(ROUTE_METADATA_KEY, target.constructor) || [];
      const metadata = {
        method: verb,
        path: path2.trim().replace(/^\/|\/$/g, ""),
        handler: propertyKey,
        guards: getGuardForControllerAction(target.constructor.__controllerName, propertyKey)
      };
      existingRoutes.push(metadata);
      Reflect.defineMetadata(ROUTE_METADATA_KEY, existingRoutes, target.constructor);
    };
  };
}
__name(createRouteDecorator, "createRouteDecorator");
function getRouteMetadata(target) {
  return Reflect.getMetadata(ROUTE_METADATA_KEY, target) || [];
}
__name(getRouteMetadata, "getRouteMetadata");
var Get = createRouteDecorator("GET");
var Post = createRouteDecorator("POST");
var Put = createRouteDecorator("PUT");
var Patch = createRouteDecorator("PATCH");
var Delete = createRouteDecorator("DELETE");
var ROUTE_METADATA_KEY = Symbol("ROUTE_METADATA_KEY");

// src/decorators/module.decorator.ts
function getModuleMetadata(target) {
  return Reflect.getMetadata(MODULE_METADATA_KEY, target);
}
__name(getModuleMetadata, "getModuleMetadata");
var MODULE_METADATA_KEY = Symbol("MODULE_METADATA_KEY");

// src/router.ts
import "reflect-metadata";

// src/decorators/middleware.decorator.ts
function getMiddlewaresForController(controllerName) {
  const key = `${controllerName}`;
  return middlewares.get(key) ?? [];
}
__name(getMiddlewaresForController, "getMiddlewaresForController");
function getMiddlewaresForControllerAction(controllerName, actionName) {
  const key = `${controllerName}.${actionName}`;
  return middlewares.get(key) ?? [];
}
__name(getMiddlewaresForControllerAction, "getMiddlewaresForControllerAction");
var middlewares = /* @__PURE__ */ new Map();

// src/request.ts
import "reflect-metadata";
var _Request = class _Request {
  constructor(event, senderId, id, method, path2, body) {
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
    this.path = path2;
    this.body = body;
    this.path = path2.replace(/^\/|\/$/g, "");
  }
};
__name(_Request, "Request");
var Request = _Request;

// src/utils/logger.ts
import * as fs from "fs";
import * as path from "path";
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
  fs.mkdir(dir, {
    recursive: true
  }, (err) => {
    if (err) {
      console.error(`[Logger] Failed to create directory ${dir}`, err);
      state.isWriting = false;
      return;
    }
    fs.appendFile(filepath, messagesToWrite, {
      encoding: "utf-8"
    }, (err2) => {
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
    fileStates.set(filepath, {
      queue: [],
      isWriting: false
    });
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
(function(Logger2) {
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
  __name(setLogLevel, "setLogLevel");
  Logger2.setLogLevel = setLogLevel;
  function log(...args) {
    output("log", args);
  }
  __name(log, "log");
  Logger2.log = log;
  function info(...args) {
    output("info", args);
  }
  __name(info, "info");
  Logger2.info = info;
  function warn(...args) {
    output("warn", args);
  }
  __name(warn, "warn");
  Logger2.warn = warn;
  function error(...args) {
    output("error", args);
  }
  __name(error, "error");
  Logger2.error = error;
  function errorStack(...args) {
    output("error", args);
  }
  __name(errorStack, "errorStack");
  Logger2.errorStack = errorStack;
  function debug(...args) {
    output("debug", args);
  }
  __name(debug, "debug");
  Logger2.debug = debug;
  function comment(...args) {
    output("comment", args);
  }
  __name(comment, "comment");
  Logger2.comment = comment;
  function critical(...args) {
    output("critical", args);
  }
  __name(critical, "critical");
  Logger2.critical = critical;
  function enableFileLogging(filepath, levels = [
    "debug",
    "comment",
    "log",
    "info",
    "warn",
    "error",
    "critical"
  ]) {
    for (const level of levels) {
      fileSettings.set(level, {
        filepath
      });
    }
  }
  __name(enableFileLogging, "enableFileLogging");
  Logger2.enableFileLogging = enableFileLogging;
  function disableFileLogging(levels = [
    "debug",
    "comment",
    "log",
    "info",
    "warn",
    "error",
    "critical"
  ]) {
    for (const level of levels) {
      fileSettings.delete(level);
    }
  }
  __name(disableFileLogging, "disableFileLogging");
  Logger2.disableFileLogging = disableFileLogging;
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
var Logger;

// src/utils/radix-tree.ts
var _a;
var RadixNode = (_a = class {
  /**
   * Creates a new RadixNode.
   * @param segment - The segment of the path this node represents.
   */
  constructor(segment) {
    __publicField(this, "segment");
    __publicField(this, "children", []);
    __publicField(this, "value");
    __publicField(this, "isParam");
    __publicField(this, "paramName");
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
      if (child.isParam || segment.startsWith(child.segment)) return child;
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
}, __name(_a, "RadixNode"), _a);
var _RadixTree = class _RadixTree {
  constructor() {
    __publicField(this, "root", new RadixNode(""));
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
    let child = node.children.find((c) => c.isParam === segment.startsWith(":") && (c.isParam || c.segment === segment));
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
    for (const child of node.children) {
      if (child.isParam) {
        const paramName = child.paramName;
        const childParams = {
          ...params,
          [paramName]: segment ?? ""
        };
        if (rest.length === 0) {
          return {
            node: child,
            params: childParams
          };
        }
        const result = this.searchRecursive(child, rest, childParams);
        if (result) return result;
      } else if (segment === child.segment) {
        if (rest.length === 0) {
          return {
            node: child,
            params
          };
        }
        const result = this.searchRecursive(child, rest, params);
        if (result) return result;
      }
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
    return [
      "",
      ...segments
    ];
  }
};
__name(_RadixTree, "RadixTree");
var RadixTree = _RadixTree;

// src/router.ts
function _ts_decorate(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}
__name(_ts_decorate, "_ts_decorate");
var ATOMIC_HTTP_METHODS = /* @__PURE__ */ new Set([
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE"
]);
function isAtomicHttpMethod(method) {
  return typeof method === "string" && ATOMIC_HTTP_METHODS.has(method);
}
__name(isAtomicHttpMethod, "isAtomicHttpMethod");
var _Router = class _Router {
  constructor() {
    __publicField(this, "routes", new RadixTree());
    __publicField(this, "rootMiddlewares", []);
  }
  /**
   * Registers a controller class with the router.
   * This method extracts the route metadata from the controller class and registers it in the routing tree.
   * It also handles the guards and middlewares associated with the controller.
   * @param controllerClass - The controller class to register.
   */
  registerController(controllerClass) {
    const controllerMeta = getControllerMetadata(controllerClass);
    const controllerGuards = getGuardForController(controllerClass.name);
    const controllerMiddlewares = getMiddlewaresForController(controllerClass.name);
    if (!controllerMeta) throw new Error(`Missing @Controller decorator on ${controllerClass.name}`);
    const routeMetadata = getRouteMetadata(controllerClass);
    for (const def of routeMetadata) {
      const fullPath = `${controllerMeta.path}/${def.path}`.replace(/\/+/g, "/");
      const routeGuards = getGuardForControllerAction(controllerClass.name, def.handler);
      const routeMiddlewares = getMiddlewaresForControllerAction(controllerClass.name, def.handler);
      const guards = /* @__PURE__ */ new Set([
        ...controllerGuards,
        ...routeGuards
      ]);
      const middlewares2 = /* @__PURE__ */ new Set([
        ...controllerMiddlewares,
        ...routeMiddlewares
      ]);
      const routeDef = {
        method: def.method,
        path: fullPath,
        controller: controllerClass,
        handler: def.handler,
        guards: [
          ...guards
        ],
        middlewares: [
          ...middlewares2
        ]
      };
      this.routes.insert(fullPath + "/" + def.method, routeDef);
      const hasActionGuards = routeDef.guards.length > 0;
      const actionGuardsInfo = hasActionGuards ? "<" + routeDef.guards.map((g) => g.name).join("|") + ">" : "";
      Logger.log(`Mapped {${routeDef.method} /${fullPath}}${actionGuardsInfo} route`);
    }
    const hasCtrlGuards = controllerMeta.guards.length > 0;
    const controllerGuardsInfo = hasCtrlGuards ? "<" + controllerMeta.guards.map((g) => g.name).join("|") + ">" : "";
    Logger.log(`Mapped ${controllerClass.name}${controllerGuardsInfo} controller's routes`);
    return this;
  }
  /**
   * Defines a middleware for the root of the application.
   * This method allows you to register a middleware that will be applied to all requests
   * to the application, regardless of the controller or action.
   * @param middleware - The middleware class to register.
   */
  defineRootMiddleware(middleware) {
    this.rootMiddlewares.push(middleware);
    return this;
  }
  /**
   * Shuts down the message channel for a specific sender ID.
   * This method closes the IPC channel for the specified sender ID and
   * removes it from the messagePorts map.
   * @param channelSenderId - The ID of the sender channel to shut down.
   */
  async handle(request) {
    if (request.method === "BATCH") {
      return this.handleBatch(request);
    }
    return this.handleAtomic(request);
  }
  async handleAtomic(request) {
    Logger.comment(`>     ${request.method} /${request.path}`);
    const t0 = performance.now();
    const response = {
      requestId: request.id,
      status: 200,
      body: null
    };
    let isCritical = false;
    try {
      const routeDef = this.findRoute(request);
      await this.resolveController(request, response, routeDef);
      if (response.status > 400) {
        throw new ResponseException(response.status, response.error);
      }
    } catch (error) {
      response.body = void 0;
      if (error instanceof ResponseException) {
        response.status = error.status;
        response.error = error.message;
        response.stack = error.stack;
      } else if (error instanceof Error) {
        isCritical = true;
        response.status = 500;
        response.error = error.message || "Internal Server Error";
        response.stack = error.stack || "No stack trace available";
      } else {
        isCritical = true;
        response.status = 500;
        response.error = "Unknown error occurred";
        response.stack = "No stack trace available";
      }
    } finally {
      const t1 = performance.now();
      const message = `< ${response.status} ${request.method} /${request.path} ${Logger.colors.yellow}${Math.round(t1 - t0)}ms${Logger.colors.initial}`;
      if (response.status < 400) {
        Logger.log(message);
      } else if (response.status < 500) {
        Logger.warn(message);
      } else {
        if (isCritical) {
          Logger.critical(message);
        } else {
          Logger.error(message);
        }
      }
      if (response.error !== void 0) {
        if (isCritical) {
          Logger.critical(response.error);
        } else {
          Logger.error(response.error);
        }
        if (response.stack !== void 0) {
          Logger.errorStack(response.stack);
        }
      }
      return response;
    }
  }
  async handleBatch(request) {
    Logger.comment(`>     ${request.method} /${request.path}`);
    const t0 = performance.now();
    const response = {
      requestId: request.id,
      status: 200,
      body: {
        responses: []
      }
    };
    let isCritical = false;
    try {
      const payload = this.normalizeBatchPayload(request.body);
      const batchPromises = payload.requests.map((item, index) => {
        const subRequestId = item.requestId ?? `${request.id}:${index}`;
        const atomicRequest = new Request(request.event, request.senderId, subRequestId, item.method, item.path, item.body);
        return this.handleAtomic(atomicRequest);
      });
      response.body.responses = await Promise.all(batchPromises);
    } catch (error) {
      response.body = void 0;
      if (error instanceof ResponseException) {
        response.status = error.status;
        response.error = error.message;
        response.stack = error.stack;
      } else if (error instanceof Error) {
        isCritical = true;
        response.status = 500;
        response.error = error.message || "Internal Server Error";
        response.stack = error.stack || "No stack trace available";
      } else {
        isCritical = true;
        response.status = 500;
        response.error = "Unknown error occurred";
        response.stack = "No stack trace available";
      }
    } finally {
      const t1 = performance.now();
      const message = `< ${response.status} ${request.method} /${request.path} ${Logger.colors.yellow}${Math.round(t1 - t0)}ms${Logger.colors.initial}`;
      if (response.status < 400) {
        Logger.log(message);
      } else if (response.status < 500) {
        Logger.warn(message);
      } else {
        if (isCritical) {
          Logger.critical(message);
        } else {
          Logger.error(message);
        }
      }
      if (response.error !== void 0) {
        if (isCritical) {
          Logger.critical(response.error);
        } else {
          Logger.error(response.error);
        }
        if (response.stack !== void 0) {
          Logger.errorStack(response.stack);
        }
      }
      return response;
    }
  }
  normalizeBatchPayload(body) {
    if (body === null || typeof body !== "object") {
      throw new BadRequestException("Batch payload must be an object containing a requests array.");
    }
    const possiblePayload = body;
    const { requests } = possiblePayload;
    if (!Array.isArray(requests)) {
      throw new BadRequestException("Batch payload must define a requests array.");
    }
    const normalizedRequests = requests.map((entry, index) => this.normalizeBatchItem(entry, index));
    return {
      requests: normalizedRequests
    };
  }
  normalizeBatchItem(entry, index) {
    if (entry === null || typeof entry !== "object") {
      throw new BadRequestException(`Batch request at index ${index} must be an object.`);
    }
    const { requestId, path: path2, method, body } = entry;
    if (requestId !== void 0 && typeof requestId !== "string") {
      throw new BadRequestException(`Batch request at index ${index} has an invalid requestId.`);
    }
    if (typeof path2 !== "string" || path2.length === 0) {
      throw new BadRequestException(`Batch request at index ${index} must define a non-empty path.`);
    }
    if (typeof method !== "string") {
      throw new BadRequestException(`Batch request at index ${index} must define an HTTP method.`);
    }
    const normalizedMethod = method.toUpperCase();
    if (!isAtomicHttpMethod(normalizedMethod)) {
      throw new BadRequestException(`Batch request at index ${index} uses the unsupported method ${method}.`);
    }
    return {
      requestId,
      path: path2,
      method: normalizedMethod,
      body
    };
  }
  /**
   * Finds the route definition for a given request.
   * This method searches the routing tree for a matching route based on the request's path and method.
   * If no matching route is found, it throws a NotFoundException.
   * @param request - The Request object containing the method and path to search for.
   * @returns The IRouteDefinition for the matched route.
   */
  findRoute(request) {
    const matchedRoutes = this.routes.search(request.path);
    if (matchedRoutes?.node === void 0 || matchedRoutes.node.children.length === 0) {
      throw new NotFoundException(`No route matches ${request.method} ${request.path}`);
    }
    const routeDef = matchedRoutes.node.findExactChild(request.method);
    if (routeDef?.value === void 0) {
      throw new MethodNotAllowedException(`Method Not Allowed for ${request.method} ${request.path}`);
    }
    return routeDef.value;
  }
  /**
   * Resolves the controller for a given route definition.
   * This method creates an instance of the controller class and prepares the request parameters.
   * It also runs the request pipeline, which includes executing middlewares and guards.
   * @param request - The Request object containing the request data.
   * @param response - The IResponse object to populate with the response data.
   * @param routeDef - The IRouteDefinition for the matched route.
   * @return A Promise that resolves when the controller action has been executed.
   * @throws UnauthorizedException if the request is not authorized by the guards.
   */
  async resolveController(request, response, routeDef) {
    const controllerInstance = request.context.resolve(routeDef.controller);
    Object.assign(request.params, this.extractParams(request.path, routeDef.path));
    await this.runRequestPipeline(request, response, routeDef, controllerInstance);
  }
  /**
   * Runs the request pipeline for a given request.
   * This method executes the middlewares and guards associated with the route,
   * and finally calls the controller action.
   * @param request - The Request object containing the request data.
   * @param response - The IResponse object to populate with the response data.
   * @param routeDef - The IRouteDefinition for the matched route.
   * @param controllerInstance - The instance of the controller class.
   * @return A Promise that resolves when the request pipeline has been executed.
   * @throws ResponseException if the response status is not successful.
   */
  async runRequestPipeline(request, response, routeDef, controllerInstance) {
    const middlewares2 = [
      .../* @__PURE__ */ new Set([
        ...this.rootMiddlewares,
        ...routeDef.middlewares
      ])
    ];
    const middlewareMaxIndex = middlewares2.length - 1;
    const guardsMaxIndex = middlewareMaxIndex + routeDef.guards.length;
    let index = -1;
    const dispatch = /* @__PURE__ */ __name(async (i) => {
      if (i <= index) throw new Error("next() called multiple times");
      index = i;
      if (i <= middlewareMaxIndex) {
        const nextFn = dispatch.bind(null, i + 1);
        await this.runMiddleware(request, response, nextFn, middlewares2[i]);
        if (response.status >= 400) {
          throw new ResponseException(response.status, response.error);
        }
        return;
      }
      if (i <= guardsMaxIndex) {
        const guardIndex = i - middlewares2.length;
        const guardType = routeDef.guards[guardIndex];
        await this.runGuard(request, guardType);
        await dispatch(i + 1);
        return;
      }
      const action = controllerInstance[routeDef.handler];
      response.body = await action.call(controllerInstance, request, response);
      if (response.body === void 0) {
        response.body = {};
      }
    }, "dispatch");
    await dispatch(0);
  }
  /**
   * Runs a middleware function in the request pipeline.
   * This method creates an instance of the middleware and invokes its `invoke` method,
   * passing the request, response, and next function.
   * @param request - The Request object containing the request data.
   * @param response - The IResponse object to populate with the response data.
   * @param next - The NextFunction to call to continue the middleware chain.
   * @param middlewareType - The type of the middleware to run.
   * @return A Promise that resolves when the middleware has been executed.
   */
  async runMiddleware(request, response, next, middlewareType) {
    const middleware = request.context.resolve(middlewareType);
    await middleware.invoke(request, response, next);
  }
  /**
   * Runs a guard to check if the request is authorized.
   * This method creates an instance of the guard and calls its `canActivate` method.
   * If the guard returns false, it throws an UnauthorizedException.
   * @param request - The Request object containing the request data.
   * @param guardType - The type of the guard to run.
   * @return A Promise that resolves if the guard allows the request, or throws an UnauthorizedException if not.
   * @throws UnauthorizedException if the guard denies access to the request.
   */
  async runGuard(request, guardType) {
    const guard = request.context.resolve(guardType);
    const allowed = await guard.canActivate(request);
    if (!allowed) throw new UnauthorizedException(`Unauthorized for ${request.method} ${request.path}`);
  }
  /**
   * Extracts parameters from the actual request path based on the template path.
   * This method splits the actual path and the template path into segments,
   * then maps the segments to parameters based on the template.
   * @param actual - The actual request path.
   * @param template - The template path to extract parameters from.
   * @returns An object containing the extracted parameters.
   */
  extractParams(actual, template) {
    const aParts = actual.split("/");
    const tParts = template.split("/");
    const params = {};
    tParts.forEach((part, i) => {
      if (part.startsWith(":")) {
        params[part.slice(1)] = aParts[i] ?? "";
      }
    });
    return params;
  }
};
__name(_Router, "Router");
var Router = _Router;
Router = _ts_decorate([
  Injectable("singleton")
], Router);

// src/DI/injector-explorer.ts
var _InjectorExplorer = class _InjectorExplorer {
  /**
   * Enqueues a class for deferred registration.
   * Called by the @Injectable decorator at import time.
   *
   * If {@link processPending} has already been called (i.e. after bootstrap),
   * the class is registered immediately so that late dynamic imports
   * (e.g. middlewares loaded after bootstrap) work correctly.
   */
  static enqueue(target, lifetime) {
    if (_InjectorExplorer.processed) {
      _InjectorExplorer.registerImmediate(target, lifetime);
      return;
    }
    _InjectorExplorer.pending.push({
      target,
      lifetime
    });
  }
  /**
   * Processes all pending registrations in two phases:
   * 1. Register all bindings (no instantiation) so every dependency is known.
   * 2. Resolve singletons, register controllers and log module readiness.
   *
   * This two-phase approach makes the system resilient to import ordering:
   * all bindings exist before any singleton is instantiated.
   */
  static processPending() {
    const queue = _InjectorExplorer.pending;
    for (const { target, lifetime } of queue) {
      if (!RootInjector.bindings.has(target)) {
        RootInjector.bindings.set(target, {
          implementation: target,
          lifetime
        });
      }
    }
    for (const { target, lifetime } of queue) {
      _InjectorExplorer.processRegistration(target, lifetime);
    }
    queue.length = 0;
    _InjectorExplorer.processed = true;
  }
  /**
   * Registers a single class immediately (post-bootstrap path).
   * Used for classes discovered via late dynamic imports.
   */
  static registerImmediate(target, lifetime) {
    if (RootInjector.bindings.has(target)) {
      return;
    }
    RootInjector.bindings.set(target, {
      implementation: target,
      lifetime
    });
    _InjectorExplorer.processRegistration(target, lifetime);
  }
  /**
   * Performs phase-2 work for a single registration: resolve singletons,
   * register controllers, and log module readiness.
   */
  static processRegistration(target, lifetime) {
    if (lifetime === "singleton") {
      RootInjector.resolve(target);
    }
    if (getModuleMetadata(target)) {
      Logger.log(`${target.name} dependencies initialized`);
      return;
    }
    const controllerMeta = getControllerMetadata(target);
    if (controllerMeta) {
      const router = RootInjector.resolve(Router);
      router?.registerController(target);
      return;
    }
    if (getRouteMetadata(target).length > 0) {
      return;
    }
    if (getInjectableMetadata(target)) {
      Logger.log(`Registered ${target.name} as ${lifetime}`);
    }
  }
};
__name(_InjectorExplorer, "InjectorExplorer");
__publicField(_InjectorExplorer, "pending", []);
__publicField(_InjectorExplorer, "processed", false);
var InjectorExplorer = _InjectorExplorer;

// src/decorators/injectable.decorator.ts
function Injectable(lifetime = "scope") {
  return (target) => {
    if (typeof target !== "function" || !target.prototype) {
      throw new Error(`@Injectable can only be used on classes, not on ${typeof target}`);
    }
    defineInjectableMetadata(target, lifetime);
    InjectorExplorer.enqueue(target, lifetime);
  };
}
__name(Injectable, "Injectable");
export {
  AppInjector,
  BadGatewayException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
  ForwardReference,
  GatewayTimeoutException,
  HttpVersionNotSupportedException,
  INJECTABLE_METADATA_KEY,
  INJECT_METADATA_KEY,
  Inject,
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
  TooManyRequestsException,
  UnauthorizedException,
  UpgradeRequiredException,
  VariantAlsoNegotiatesException,
  forwardRef,
  getInjectableMetadata,
  hasInjectableMetadata,
  inject
};
/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 */
//# sourceMappingURL=child.mjs.map