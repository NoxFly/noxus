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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// src/index.ts
var src_exports = {};
__export(src_exports, {
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
  Patch: () => Patch,
  PaymentRequiredException: () => PaymentRequiredException,
  Post: () => Post,
  Put: () => Put,
  ROUTE_METADATA_KEY: () => ROUTE_METADATA_KEY,
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
  getControllerMetadata: () => getControllerMetadata,
  getGuardForController: () => getGuardForController,
  getGuardForControllerAction: () => getGuardForControllerAction,
  getInjectableMetadata: () => getInjectableMetadata,
  getMiddlewaresForController: () => getMiddlewaresForController,
  getMiddlewaresForControllerAction: () => getMiddlewaresForControllerAction,
  getModuleMetadata: () => getModuleMetadata,
  getRouteMetadata: () => getRouteMetadata,
  inject: () => inject
});
module.exports = __toCommonJS(src_exports);

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
var import_reflect_metadata2 = require("reflect-metadata");

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

// src/decorators/method.decorator.ts
function createRouteDecorator(verb) {
  return (path) => {
    return (target, propertyKey) => {
      const existingRoutes = Reflect.getMetadata(ROUTE_METADATA_KEY, target.constructor) || [];
      const metadata = {
        method: verb,
        path: path.trim().replace(/^\/|\/$/g, ""),
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
function getPrettyTimestamp() {
  const now = /* @__PURE__ */ new Date();
  return `${now.getDate().toString().padStart(2, "0")}/${(now.getMonth() + 1).toString().padStart(2, "0")}/${now.getFullYear()} ${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;
}
__name(getPrettyTimestamp, "getPrettyTimestamp");
function getLogPrefix(callee, messageType, color) {
  const timestamp = getPrettyTimestamp();
  const spaces = " ".repeat(10 - messageType.length);
  return `${color}[APP] ${process.pid} - ${Logger.colors.initial}${timestamp}${spaces}${color}${messageType.toUpperCase()}${Logger.colors.initial} ${Logger.colors.yellow}[${callee}]${Logger.colors.initial}`;
}
__name(getLogPrefix, "getLogPrefix");
function formatObject(prefix, arg) {
  const json = JSON.stringify(arg, null, 2);
  const prefixedJson = json.split("\n").map((line, idx) => idx === 0 ? `${Logger.colors.darkGrey}${line}` : `${prefix} ${Logger.colors.grey}${line}`).join("\n") + Logger.colors.initial;
  return prefixedJson;
}
__name(formatObject, "formatObject");
function formattedArgs(prefix, args, color) {
  return args.map((arg) => {
    if (typeof arg === "string") {
      return `${color}${arg}${Logger.colors.initial}`;
    } else if (typeof arg === "object") {
      return formatObject(prefix, arg);
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
  return logLevelRank[level] >= logLevelRank[logLevel];
}
__name(canLog, "canLog");
var logLevel = "debug";
var logLevelRank = {
  debug: 0,
  comment: 1,
  log: 2,
  info: 3,
  warn: 4,
  error: 5
};
(function(Logger2) {
  function setLogLevel(level) {
    logLevel = level;
  }
  __name(setLogLevel, "setLogLevel");
  Logger2.setLogLevel = setLogLevel;
  function log(...args) {
    if (!canLog("log")) return;
    const callee = getCallee();
    const prefix = getLogPrefix(callee, "log", Logger2.colors.green);
    console.log(prefix, ...formattedArgs(prefix, args, Logger2.colors.green));
  }
  __name(log, "log");
  Logger2.log = log;
  function info(...args) {
    if (!canLog("info")) return;
    const callee = getCallee();
    const prefix = getLogPrefix(callee, "info", Logger2.colors.blue);
    console.info(prefix, ...formattedArgs(prefix, args, Logger2.colors.blue));
  }
  __name(info, "info");
  Logger2.info = info;
  function warn(...args) {
    if (!canLog("warn")) return;
    const callee = getCallee();
    const prefix = getLogPrefix(callee, "warn", Logger2.colors.brown);
    console.warn(prefix, ...formattedArgs(prefix, args, Logger2.colors.brown));
  }
  __name(warn, "warn");
  Logger2.warn = warn;
  function error(...args) {
    if (!canLog("error")) return;
    const callee = getCallee();
    const prefix = getLogPrefix(callee, "error", Logger2.colors.red);
    console.error(prefix, ...formattedArgs(prefix, args, Logger2.colors.red));
  }
  __name(error, "error");
  Logger2.error = error;
  function debug(...args) {
    if (!canLog("debug")) return;
    const callee = getCallee();
    const prefix = getLogPrefix(callee, "debug", Logger2.colors.purple);
    console.debug(prefix, ...formattedArgs(prefix, args, Logger2.colors.purple));
  }
  __name(debug, "debug");
  Logger2.debug = debug;
  function comment(...args) {
    if (!canLog("comment")) return;
    const callee = getCallee();
    const prefix = getLogPrefix(callee, "comment", Logger2.colors.grey);
    console.debug(prefix, ...formattedArgs(prefix, args, Logger2.colors.grey));
  }
  __name(comment, "comment");
  Logger2.comment = comment;
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
    Reflect.defineMetadata(INJECTABLE_METADATA_KEY, lifetime, target);
    InjectorExplorer.register(target, lifetime);
  };
}
__name(Injectable, "Injectable");
function getInjectableMetadata(target) {
  return Reflect.getMetadata(INJECTABLE_METADATA_KEY, target);
}
__name(getInjectableMetadata, "getInjectableMetadata");
var INJECTABLE_METADATA_KEY = Symbol("INJECTABLE_METADATA_KEY");

// src/decorators/controller.decorator.ts
function Controller(path) {
  return (target) => {
    const data = {
      path,
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
  insert(path, value) {
    const segments = this.normalize(path);
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
  search(path) {
    const segments = this.normalize(path);
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
  normalize(path) {
    const segments = path.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);
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
    Logger.comment(`>     ${request.method} /${request.path}`);
    const t0 = performance.now();
    const response = {
      requestId: request.id,
      status: 200,
      body: null,
      error: void 0
    };
    try {
      const routeDef = this.findRoute(request);
      await this.resolveController(request, response, routeDef);
      if (response.status > 400) {
        throw new ResponseException(response.status, response.error);
      }
    } catch (error) {
      if (error instanceof ResponseException) {
        response.status = error.status;
        response.error = error.message;
      } else if (error instanceof Error) {
        response.status = 500;
        response.error = error.message || "Internal Server Error";
      } else {
        response.status = 500;
        response.error = "Unknown error occurred";
      }
    } finally {
      const t1 = performance.now();
      const message = `< ${response.status} ${request.method} /${request.path} ${Logger.colors.yellow}${Math.round(t1 - t0)}ms${Logger.colors.initial}`;
      if (response.status < 400) Logger.log(message);
      else if (response.status < 500) Logger.warn(message);
      else Logger.error(message);
      if (response.error !== void 0) {
        Logger.error(response.error);
      }
      return response;
    }
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
        dispatch(i + 1);
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

// src/request.ts
var import_reflect_metadata3 = require("reflect-metadata");
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

// src/app.ts
function _ts_decorate2(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}
__name(_ts_decorate2, "_ts_decorate");
function _ts_metadata(k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
__name(_ts_metadata, "_ts_metadata");
var _NoxApp = class _NoxApp {
  constructor(router) {
    __publicField(this, "router");
    __publicField(this, "messagePorts", /* @__PURE__ */ new Map());
    __publicField(this, "app");
    this.router = router;
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
    if (this.messagePorts.has(senderId)) {
      this.shutdownChannel(senderId);
    }
    const channel = new import_main.MessageChannelMain();
    this.messagePorts.set(senderId, channel);
    channel.port1.on("message", this.onRendererMessage.bind(this));
    channel.port1.start();
    event.sender.postMessage("port", {
      senderId
    }, [
      channel.port2
    ]);
  }
  /**
   * Electron specific message handling.
   * Replaces HTTP calls by using Electron's IPC mechanism.
   */
  async onRendererMessage(event) {
    const { senderId, requestId, path, method, body } = event.data;
    const channel = this.messagePorts.get(senderId);
    if (!channel) {
      Logger.error(`No message channel found for sender ID: ${senderId}`);
      return;
    }
    try {
      const request = new Request(event, requestId, method, path, body);
      const response = await this.router.handle(request);
      channel.port1.postMessage(response);
    } catch (err) {
      const response = {
        requestId,
        status: 500,
        body: null,
        error: err.message || "Internal Server Error"
      };
      channel.port1.postMessage(response);
    }
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
    const channel = this.messagePorts.get(channelSenderId);
    if (!channel) {
      Logger.warn(`No message channel found for sender ID: ${channelSenderId}`);
      return;
    }
    channel.port1.off("message", this.onRendererMessage.bind(this));
    channel.port1.close();
    channel.port2.close();
    this.messagePorts.delete(channelSenderId);
  }
  /**
   * Handles the application shutdown process.
   * This method is called when all windows are closed, and it cleans up the message channels
   */
  async onAllWindowsClosed() {
    this.messagePorts.forEach((channel, senderId) => {
      this.shutdownChannel(senderId);
    });
    this.messagePorts.clear();
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
NoxApp = _ts_decorate2([
  Injectable("singleton"),
  _ts_metadata("design:type", Function),
  _ts_metadata("design:paramtypes", [
    typeof Router === "undefined" ? Object : Router
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
  Patch,
  PaymentRequiredException,
  Post,
  Put,
  ROUTE_METADATA_KEY,
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
  getControllerMetadata,
  getGuardForController,
  getGuardForControllerAction,
  getInjectableMetadata,
  getMiddlewaresForController,
  getMiddlewaresForControllerAction,
  getModuleMetadata,
  getRouteMetadata,
  inject
});
/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 */
//# sourceMappingURL=noxus.js.map