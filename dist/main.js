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
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
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
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  AppInjector: () => AppInjector,
  Authorize: () => Authorize,
  BadGatewayException: () => BadGatewayException,
  BadRequestException: () => BadRequestException,
  CONTROLLER_METADATA_KEY: () => CONTROLLER_METADATA_KEY,
  ConflictException: () => ConflictException,
  Controller: () => Controller,
  Delete: () => Delete,
  ForbiddenException: () => ForbiddenException,
  GatewayTimeoutException: () => GatewayTimeoutException,
  Get: () => Get,
  HttpVersionNotSupportedException: () => HttpVersionNotSupportedException,
  INJECTABLE_METADATA_KEY: () => INJECTABLE_METADATA_KEY,
  Injectable: () => Injectable,
  InsufficientStorageException: () => InsufficientStorageException,
  InternalServerException: () => InternalServerException,
  Logger: () => Logger,
  LoopDetectedException: () => LoopDetectedException,
  MODULE_METADATA_KEY: () => MODULE_METADATA_KEY,
  MethodNotAllowedException: () => MethodNotAllowedException,
  Module: () => Module,
  NetworkAuthenticationRequiredException: () => NetworkAuthenticationRequiredException,
  NetworkConnectTimeoutException: () => NetworkConnectTimeoutException,
  NotAcceptableException: () => NotAcceptableException,
  NotExtendedException: () => NotExtendedException,
  NotFoundException: () => NotFoundException,
  NotImplementedException: () => NotImplementedException,
  NoxApp: () => NoxApp,
  NoxRendererClient: () => NoxRendererClient,
  NoxSocket: () => NoxSocket,
  Patch: () => Patch,
  PaymentRequiredException: () => PaymentRequiredException,
  Post: () => Post,
  Put: () => Put,
  RENDERER_EVENT_TYPE: () => RENDERER_EVENT_TYPE,
  ROUTE_METADATA_KEY: () => ROUTE_METADATA_KEY,
  RendererEventRegistry: () => RendererEventRegistry,
  Request: () => Request,
  RequestTimeoutException: () => RequestTimeoutException,
  ResponseException: () => ResponseException,
  RootInjector: () => RootInjector,
  Router: () => Router,
  ServiceUnavailableException: () => ServiceUnavailableException,
  TooManyRequestsException: () => TooManyRequestsException,
  UnauthorizedException: () => UnauthorizedException,
  UpgradeRequiredException: () => UpgradeRequiredException,
  UseMiddlewares: () => UseMiddlewares,
  VariantAlsoNegotiatesException: () => VariantAlsoNegotiatesException,
  bootstrapApplication: () => bootstrapApplication,
  createRendererEventMessage: () => createRendererEventMessage,
  exposeNoxusBridge: () => exposeNoxusBridge,
  getControllerMetadata: () => getControllerMetadata,
  getGuardForController: () => getGuardForController,
  getGuardForControllerAction: () => getGuardForControllerAction,
  getInjectableMetadata: () => getInjectableMetadata,
  getMiddlewaresForController: () => getMiddlewaresForController,
  getMiddlewaresForControllerAction: () => getMiddlewaresForControllerAction,
  getModuleMetadata: () => getModuleMetadata,
  getRouteMetadata: () => getRouteMetadata,
  hasInjectableMetadata: () => hasInjectableMetadata,
  inject: () => inject,
  isRendererEventMessage: () => isRendererEventMessage
});
module.exports = __toCommonJS(main_exports);

// src/DI/app-injector.ts
var import_reflect_metadata = require("reflect-metadata");

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
function inject(t) {
  return RootInjector.resolve(t);
}
__name(inject, "inject");
var RootInjector = new AppInjector("root");

// src/router.ts
var import_reflect_metadata3 = require("reflect-metadata");

// src/decorators/guards.decorator.ts
function Authorize(...guardClasses) {
  return (target, propertyKey) => {
    let key;
    if (propertyKey) {
      const ctrlName = target.constructor.name;
      const actionName = propertyKey;
      key = `${ctrlName}.${actionName}`;
    } else {
      const ctrlName = target.name;
      key = `${ctrlName}`;
    }
    if (authorizations.has(key)) {
      throw new Error(`Guard(s) already registered for ${key}`);
    }
    authorizations.set(key, guardClasses);
  };
}
__name(Authorize, "Authorize");
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
function Module(metadata) {
  return (target) => {
    const checkModule = /* @__PURE__ */ __name((arr, arrName) => {
      if (!arr) return;
      for (const clazz of arr) {
        if (!Reflect.getMetadata(MODULE_METADATA_KEY, clazz)) {
          throw new Error(`Class ${clazz.name} in ${arrName} must be decorated with @Module`);
        }
      }
    }, "checkModule");
    const checkInjectable = /* @__PURE__ */ __name((arr) => {
      if (!arr) return;
      for (const clazz of arr) {
        if (!Reflect.getMetadata(INJECTABLE_METADATA_KEY, clazz)) {
          throw new Error(`Class ${clazz.name} in providers must be decorated with @Injectable`);
        }
      }
    }, "checkInjectable");
    const checkController = /* @__PURE__ */ __name((arr) => {
      if (!arr) return;
      for (const clazz of arr) {
        if (!Reflect.getMetadata(CONTROLLER_METADATA_KEY, clazz)) {
          throw new Error(`Class ${clazz.name} in controllers must be decorated with @Controller`);
        }
      }
    }, "checkController");
    checkModule(metadata.imports, "imports");
    checkModule(metadata.exports, "exports");
    checkInjectable(metadata.providers);
    checkController(metadata.controllers);
    Reflect.defineMetadata(MODULE_METADATA_KEY, metadata, target);
    Injectable("singleton")(target);
  };
}
__name(Module, "Module");
function getModuleMetadata(target) {
  return Reflect.getMetadata(MODULE_METADATA_KEY, target);
}
__name(getModuleMetadata, "getModuleMetadata");
var MODULE_METADATA_KEY = Symbol("MODULE_METADATA_KEY");

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
      return formatObject(prefix, arg, color === "");
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
      const message = prefix + " " + data.join(" ");
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

// src/DI/injector-explorer.ts
var _InjectorExplorer = class _InjectorExplorer {
  /**
   * Registers the class as injectable.
   * When a class is instantiated, if it has dependencies and those dependencies
   * are listed using this method, they will be injected into the class constructor.
   */
  static register(target, lifetime) {
    if (RootInjector.bindings.has(target)) return RootInjector;
    RootInjector.bindings.set(target, {
      implementation: target,
      lifetime
    });
    if (lifetime === "singleton") {
      RootInjector.resolve(target);
    }
    if (getModuleMetadata(target)) {
      Logger.log(`${target.name} dependencies initialized`);
      return RootInjector;
    }
    const controllerMeta = getControllerMetadata(target);
    if (controllerMeta) {
      const router = RootInjector.resolve(Router);
      router?.registerController(target);
      return RootInjector;
    }
    const routeMeta = getRouteMetadata(target);
    if (routeMeta) {
      return RootInjector;
    }
    if (getInjectableMetadata(target)) {
      Logger.log(`Registered ${target.name} as ${lifetime}`);
      return RootInjector;
    }
    return RootInjector;
  }
};
__name(_InjectorExplorer, "InjectorExplorer");
var InjectorExplorer = _InjectorExplorer;

// src/decorators/injectable.decorator.ts
function Injectable(lifetime = "scope") {
  return (target) => {
    if (typeof target !== "function" || !target.prototype) {
      throw new Error(`@Injectable can only be used on classes, not on ${typeof target}`);
    }
    defineInjectableMetadata(target, lifetime);
    InjectorExplorer.register(target, lifetime);
  };
}
__name(Injectable, "Injectable");

// src/decorators/controller.decorator.ts
function Controller(path2) {
  return (target) => {
    const data = {
      path: path2,
      guards: getGuardForController(target.name)
    };
    Reflect.defineMetadata(CONTROLLER_METADATA_KEY, data, target);
    Injectable("scope")(target);
  };
}
__name(Controller, "Controller");
function getControllerMetadata(target) {
  return Reflect.getMetadata(CONTROLLER_METADATA_KEY, target);
}
__name(getControllerMetadata, "getControllerMetadata");
var CONTROLLER_METADATA_KEY = Symbol("CONTROLLER_METADATA_KEY");

// src/decorators/middleware.decorator.ts
function UseMiddlewares(mdlw) {
  return (target, propertyKey) => {
    let key;
    if (propertyKey) {
      const ctrlName = target.constructor.name;
      const actionName = propertyKey;
      key = `${ctrlName}.${actionName}`;
    } else {
      const ctrlName = target.name;
      key = `${ctrlName}`;
    }
    if (middlewares.has(key)) {
      throw new Error(`Middlewares(s) already registered for ${key}`);
    }
    middlewares.set(key, mdlw);
  };
}
__name(UseMiddlewares, "UseMiddlewares");
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
var import_reflect_metadata2 = require("reflect-metadata");
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
      const batchResponses = [];
      for (const [index, item] of payload.requests.entries()) {
        const subRequestId = item.requestId ?? `${request.id}:${index}`;
        const atomicRequest = new Request(request.event, request.senderId, subRequestId, item.method, item.path, item.body);
        batchResponses.push(await this.handleAtomic(atomicRequest));
      }
      response.body.responses = batchResponses;
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

// src/app.ts
var import_main = require("electron/main");

// src/socket.ts
function _ts_decorate2(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}
__name(_ts_decorate2, "_ts_decorate");
var _NoxSocket = class _NoxSocket {
  constructor() {
    __publicField(this, "channels", /* @__PURE__ */ new Map());
  }
  register(senderId, requestChannel, socketChannel) {
    this.channels.set(senderId, {
      request: requestChannel,
      socket: socketChannel
    });
  }
  get(senderId) {
    return this.channels.get(senderId);
  }
  unregister(senderId) {
    this.channels.delete(senderId);
  }
  getSenderIds() {
    return [
      ...this.channels.keys()
    ];
  }
  emit(eventName, payload, targetSenderIds) {
    const normalizedEvent = eventName.trim();
    if (normalizedEvent.length === 0) {
      throw new Error("Renderer event name must be a non-empty string.");
    }
    const recipients = targetSenderIds ?? this.getSenderIds();
    let delivered = 0;
    for (const senderId of recipients) {
      const channel = this.channels.get(senderId);
      if (!channel) {
        Logger.warn(`No message channel found for sender ID: ${senderId} while emitting "${normalizedEvent}".`);
        continue;
      }
      try {
        channel.socket.port1.postMessage(createRendererEventMessage(normalizedEvent, payload));
        delivered++;
      } catch (error) {
        Logger.error(`[Noxus] Failed to emit "${normalizedEvent}" to sender ${senderId}.`, error);
      }
    }
    return delivered;
  }
  emitToRenderer(senderId, eventName, payload) {
    return this.emit(eventName, payload, [
      senderId
    ]) > 0;
  }
};
__name(_NoxSocket, "NoxSocket");
var NoxSocket = _NoxSocket;
NoxSocket = _ts_decorate2([
  Injectable("singleton")
], NoxSocket);

// src/app.ts
function _ts_decorate3(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}
__name(_ts_decorate3, "_ts_decorate");
function _ts_metadata(k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
__name(_ts_metadata, "_ts_metadata");
var _NoxApp = class _NoxApp {
  constructor(router, socket) {
    __publicField(this, "router");
    __publicField(this, "socket");
    __publicField(this, "app");
    /**
     *
     */
    __publicField(this, "onRendererMessage", /* @__PURE__ */ __name(async (event) => {
      const { senderId, requestId, path: path2, method, body } = event.data;
      const channels = this.socket.get(senderId);
      if (!channels) {
        Logger.error(`No message channel found for sender ID: ${senderId}`);
        return;
      }
      try {
        const request = new Request(event, senderId, requestId, method, path2, body);
        const response = await this.router.handle(request);
        channels.request.port1.postMessage(response);
      } catch (err) {
        const response = {
          requestId,
          status: 500,
          body: null,
          error: err.message || "Internal Server Error"
        };
        channels.request.port1.postMessage(response);
      }
    }, "onRendererMessage"));
    this.router = router;
    this.socket = socket;
  }
  /**
   * Initializes the NoxApp instance.
   * This method sets up the IPC communication, registers event listeners,
   * and prepares the application for use.
   */
  async init() {
    import_main.ipcMain.on("gimme-my-port", this.giveTheRendererAPort.bind(this));
    import_main.app.once("activate", this.onAppActivated.bind(this));
    import_main.app.once("window-all-closed", this.onAllWindowsClosed.bind(this));
    console.log("");
    return this;
  }
  /**
   * Handles the request from the renderer process.
   * This method creates a Request object from the IPC event data,
   * processes it through the Router, and sends the response back
   * to the renderer process using the MessageChannel.
   */
  giveTheRendererAPort(event) {
    const senderId = event.sender.id;
    if (this.socket.get(senderId)) {
      this.shutdownChannel(senderId);
    }
    const requestChannel = new import_main.MessageChannelMain();
    const socketChannel = new import_main.MessageChannelMain();
    requestChannel.port1.on("message", this.onRendererMessage);
    requestChannel.port1.start();
    socketChannel.port1.start();
    this.socket.register(senderId, requestChannel, socketChannel);
    event.sender.postMessage("port", {
      senderId
    }, [
      requestChannel.port2,
      socketChannel.port2
    ]);
  }
  /**
   * MacOS specific behavior.
   */
  onAppActivated() {
    if (process.platform === "darwin" && import_main.BrowserWindow.getAllWindows().length === 0) {
      this.app?.onActivated();
    }
  }
  /**
   * Shuts down the message channel for a specific sender ID.
   * This method closes the IPC channel for the specified sender ID and
   * removes it from the messagePorts map.
   * @param channelSenderId - The ID of the sender channel to shut down.
   * @param remove - Whether to remove the channel from the messagePorts map.
   */
  shutdownChannel(channelSenderId) {
    const channels = this.socket.get(channelSenderId);
    if (!channels) {
      Logger.warn(`No message channel found for sender ID: ${channelSenderId}`);
      return;
    }
    channels.request.port1.off("message", this.onRendererMessage);
    channels.request.port1.close();
    channels.request.port2.close();
    channels.socket.port1.close();
    channels.socket.port2.close();
    this.socket.unregister(channelSenderId);
  }
  /**
   * Handles the application shutdown process.
   * This method is called when all windows are closed, and it cleans up the message channels
   */
  async onAllWindowsClosed() {
    for (const senderId of this.socket.getSenderIds()) {
      this.shutdownChannel(senderId);
    }
    Logger.info("All windows closed, shutting down application...");
    await this.app?.dispose();
    if (process.platform !== "darwin") {
      import_main.app.quit();
    }
  }
  // ---
  /**
   * Configures the NoxApp instance with the provided application class.
   * This method allows you to set the application class that will handle lifecycle events.
   * @param app - The application class to configure.
   * @returns NoxApp instance for method chaining.
   */
  configure(app3) {
    this.app = inject(app3);
    return this;
  }
  /**
   * Registers a middleware for the root of the application.
   * This method allows you to define a middleware that will be applied to all requests
   * @param middleware - The middleware class to register.
   * @returns NoxApp instance for method chaining.
   */
  use(middleware) {
    this.router.defineRootMiddleware(middleware);
    return this;
  }
  /**
   * Should be called after the bootstrapApplication function is called.
   * @returns NoxApp instance for method chaining.
   */
  start() {
    this.app?.onReady();
    return this;
  }
};
__name(_NoxApp, "NoxApp");
var NoxApp = _NoxApp;
NoxApp = _ts_decorate3([
  Injectable("singleton"),
  _ts_metadata("design:type", Function),
  _ts_metadata("design:paramtypes", [
    typeof Router === "undefined" ? Object : Router,
    typeof NoxSocket === "undefined" ? Object : NoxSocket
  ])
], NoxApp);

// src/bootstrap.ts
var import_main2 = require("electron/main");
async function bootstrapApplication(rootModule) {
  if (!getModuleMetadata(rootModule)) {
    throw new Error(`Root module must be decorated with @Module`);
  }
  await import_main2.app.whenReady();
  const noxApp = inject(NoxApp);
  await noxApp.init();
  return noxApp;
}
__name(bootstrapApplication, "bootstrapApplication");

// src/preload-bridge.ts
var import_renderer = require("electron/renderer");
var DEFAULT_EXPOSE_NAME = "noxus";
var DEFAULT_INIT_EVENT = "init-port";
var DEFAULT_REQUEST_CHANNEL = "gimme-my-port";
var DEFAULT_RESPONSE_CHANNEL = "port";
function exposeNoxusBridge(options = {}) {
  const { exposeAs = DEFAULT_EXPOSE_NAME, initMessageType = DEFAULT_INIT_EVENT, requestChannel = DEFAULT_REQUEST_CHANNEL, responseChannel = DEFAULT_RESPONSE_CHANNEL, targetWindow = window } = options;
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
        targetWindow.postMessage({
          type: initMessageType,
          senderId: message?.senderId
        }, "*", ports);
      });
    }, "requestPort")
  };
  import_renderer.contextBridge.exposeInMainWorld(exposeAs, api);
  return api;
}
__name(exposeNoxusBridge, "exposeNoxusBridge");

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
var DEFAULT_INIT_EVENT2 = "init-port";
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AppInjector,
  Authorize,
  BadGatewayException,
  BadRequestException,
  CONTROLLER_METADATA_KEY,
  ConflictException,
  Controller,
  Delete,
  ForbiddenException,
  GatewayTimeoutException,
  Get,
  HttpVersionNotSupportedException,
  INJECTABLE_METADATA_KEY,
  Injectable,
  InsufficientStorageException,
  InternalServerException,
  Logger,
  LoopDetectedException,
  MODULE_METADATA_KEY,
  MethodNotAllowedException,
  Module,
  NetworkAuthenticationRequiredException,
  NetworkConnectTimeoutException,
  NotAcceptableException,
  NotExtendedException,
  NotFoundException,
  NotImplementedException,
  NoxApp,
  NoxRendererClient,
  NoxSocket,
  Patch,
  PaymentRequiredException,
  Post,
  Put,
  RENDERER_EVENT_TYPE,
  ROUTE_METADATA_KEY,
  RendererEventRegistry,
  Request,
  RequestTimeoutException,
  ResponseException,
  RootInjector,
  Router,
  ServiceUnavailableException,
  TooManyRequestsException,
  UnauthorizedException,
  UpgradeRequiredException,
  UseMiddlewares,
  VariantAlsoNegotiatesException,
  bootstrapApplication,
  createRendererEventMessage,
  exposeNoxusBridge,
  getControllerMetadata,
  getGuardForController,
  getGuardForControllerAction,
  getInjectableMetadata,
  getMiddlewaresForController,
  getMiddlewaresForControllerAction,
  getModuleMetadata,
  getRouteMetadata,
  hasInjectableMetadata,
  inject,
  isRendererEventMessage
});
/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 */
//# sourceMappingURL=main.js.map