var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// src/exceptions.ts
var _ResponseException = class _ResponseException extends Error {
  constructor(message) {
    super(message);
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

// src/app-injector.ts
import "reflect-metadata";
var _a;
var AppInjector = (_a = class {
  constructor(name = null) {
    __publicField(this, "name");
    __publicField(this, "bindings", /* @__PURE__ */ new Map());
    __publicField(this, "singletons", /* @__PURE__ */ new Map());
    __publicField(this, "scoped", /* @__PURE__ */ new Map());
    this.name = name;
  }
  /**
   * Utilisé généralement pour créer un scope d'injection de dépendances
   * au niveau "scope" (donc durée de vie d'une requête)
   */
  createScope() {
    const scope = new _a();
    scope.bindings = this.bindings;
    scope.singletons = this.singletons;
    return scope;
  }
  /**
   * Appelé lorsqu'on souhaite résoudre une dépendance,
   * c'est-à-dire récupérer l'instance d'une classe donnée.
   */
  resolve(target) {
    const binding = this.bindings.get(target);
    if (!binding) throw new InternalServerException(`Failed to resolve a dependency injection : No binding for type ${target.name}`);
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
}, __name(_a, "AppInjector"), _a);
var RootInjector = new AppInjector("root");

// src/router.ts
import "reflect-metadata";

// src/logger.ts
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
  const caller = stack[3]?.trim().match(/at (.+?)(?:\..+)? .+$/)?.[1]?.replace("Object", "") || "App";
  return caller;
}
__name(getCallee, "getCallee");
var logLevelRank = {
  debug: 0,
  log: 1,
  info: 2,
  warn: 3,
  error: 4
};
function canLog(level) {
  return logLevelRank[level] >= logLevelRank[logLevel];
}
__name(canLog, "canLog");
var logLevel = "log";
(function(Logger2) {
  function setLogLevel(level) {
    logLevel = level;
  }
  __name(setLogLevel, "setLogLevel");
  Logger2.setLogLevel = setLogLevel;
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
})(Logger || (Logger = {}));
var Logger;

// src/metadata.ts
var MODULE_METADATA_KEY = Symbol("MODULE_METADATA_KEY");
var INJECTABLE_METADATA_KEY = Symbol("INJECTABLE_METADATA_KEY");
var CONTROLLER_METADATA_KEY = Symbol("CONTROLLER_METADATA_KEY");
var ROUTE_METADATA_KEY = Symbol("ROUTE_METADATA_KEY");
function getControllerMetadata(target) {
  return Reflect.getMetadata(CONTROLLER_METADATA_KEY, target);
}
__name(getControllerMetadata, "getControllerMetadata");
function getRouteMetadata(target) {
  return Reflect.getMetadata(ROUTE_METADATA_KEY, target) || [];
}
__name(getRouteMetadata, "getRouteMetadata");
function getModuleMetadata(target) {
  return Reflect.getMetadata(MODULE_METADATA_KEY, target);
}
__name(getModuleMetadata, "getModuleMetadata");
function getInjectableMetadata(target) {
  return Reflect.getMetadata(INJECTABLE_METADATA_KEY, target);
}
__name(getInjectableMetadata, "getInjectableMetadata");

// src/injector-explorer.ts
var _InjectorExplorer = class _InjectorExplorer {
  /**
   * Enregistre la classe comme étant injectable.
   * Lorsqu'une classe sera instanciée, si elle a des dépendances, et que celles-ci
   * figurent dans la liste grâce à cette méthode, elles seront injectées dans le
   * constructeur de la classe.
   */
  static register(target, lifetime) {
    Logger.debug(`Registering ${target.name} as ${lifetime}`);
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

// src/app.ts
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

// src/guards.ts
var authorizations = /* @__PURE__ */ new Map();
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
    Logger.debug(`Registering guards for ${key}: ${guardClasses.map((c) => c.name).join(", ")}`);
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

// src/radix-tree.ts
var _a2;
var RadixNode = (_a2 = class {
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
  matchChild(segment) {
    for (const child of this.children) {
      if (child.isParam || segment.startsWith(child.segment)) return child;
    }
    return void 0;
  }
  findExactChild(segment) {
    return this.children.find((c) => c.segment === segment);
  }
  addChild(node) {
    this.children.push(node);
  }
}, __name(_a2, "RadixNode"), _a2);
var _RadixTree = class _RadixTree {
  constructor() {
    __publicField(this, "root", new RadixNode(""));
  }
  insert(path, value) {
    const segments = this.normalize(path);
    this.insertRecursive(this.root, segments, value);
  }
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
  search(path) {
    const segments = this.normalize(path);
    return this.searchRecursive(this.root, segments, {});
  }
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
var Get = createRouteDecorator("GET");
var Post = createRouteDecorator("POST");
var Put = createRouteDecorator("PUT");
var Patch = createRouteDecorator("PATCH");
var Delete = createRouteDecorator("DELETE");
var _Router = class _Router {
  constructor() {
    __publicField(this, "routes", new RadixTree());
  }
  registerController(controllerClass) {
    const controllerMeta = getControllerMetadata(controllerClass);
    const controllerGuards = getGuardForController(controllerClass.name);
    if (!controllerMeta) throw new Error(`Missing @Controller decorator on ${controllerClass.name}`);
    const routeMetadata = getRouteMetadata(controllerClass);
    for (const def of routeMetadata) {
      const fullPath = `${controllerMeta.path}/${def.path}`.replace(/\/+/g, "/");
      const routeGuards = getGuardForControllerAction(controllerClass.name, def.handler);
      const guards = /* @__PURE__ */ new Set([
        ...controllerGuards,
        ...routeGuards
      ]);
      const routeDef = {
        method: def.method,
        path: fullPath,
        controller: controllerClass,
        handler: def.handler,
        guards: [
          ...guards
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
  async handle(request) {
    Logger.log(`> Received request: {${request.method} /${request.path}}`);
    const t0 = performance.now();
    const response = {
      requestId: request.id,
      status: 200,
      body: null,
      error: void 0
    };
    try {
      const routeDef = this.findRoute(request);
      const controllerInstance = await this.resolveController(request, routeDef);
      const action = controllerInstance[routeDef.handler];
      this.verifyRequestBody(request, action);
      response.body = await action.call(controllerInstance, request, response);
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
  async resolveController(request, routeDef) {
    const controllerInstance = request.context.resolve(routeDef.controller);
    Object.assign(request.params, this.extractParams(request.path, routeDef.path));
    if (routeDef.guards.length > 0) {
      for (const guardType of routeDef.guards) {
        const guard = request.context.resolve(guardType);
        const allowed = await guard.canActivate(request);
        if (!allowed) throw new UnauthorizedException(`Unauthorized for ${request.method} ${request.path}`);
      }
    }
    return controllerInstance;
  }
  verifyRequestBody(request, action) {
    const requiredParams = Reflect.getMetadata("design:paramtypes", action) || [];
  }
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

// src/bootstrap.ts
import { ipcMain } from "electron";
import { app, BrowserWindow, MessageChannelMain } from "electron/main";

// src/request.ts
import "reflect-metadata";
var _Request = class _Request {
  constructor(app2, event, id, method, path, body) {
    __publicField(this, "app");
    __publicField(this, "event");
    __publicField(this, "id");
    __publicField(this, "method");
    __publicField(this, "path");
    __publicField(this, "body");
    __publicField(this, "context", RootInjector.createScope());
    __publicField(this, "params", {});
    this.app = app2;
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

// src/bootstrap.ts
async function bootstrapApplication(root, rootModule) {
  if (!getModuleMetadata(rootModule)) {
    throw new Error(`Root module must be decorated with @Module`);
  }
  if (!getInjectableMetadata(root)) {
    throw new Error(`Root application must be decorated with @Injectable`);
  }
  await app.whenReady();
  RootInjector.resolve(Router);
  const noxEngine = new Nox(root, rootModule);
  const application = await noxEngine.init();
  return application;
}
__name(bootstrapApplication, "bootstrapApplication");
var _a3;
var Nox = (_a3 = class {
  constructor(root, rootModule) {
    __publicField(this, "root");
    __publicField(this, "rootModule");
    __publicField(this, "messagePort");
    this.root = root;
    this.rootModule = rootModule;
  }
  /**
   * 
   */
  async init() {
    const application = RootInjector.resolve(this.root);
    ipcMain.on("gimme-my-port", this.giveTheClientAPort.bind(this, application));
    app.once("activate", this.onAppActivated.bind(this, application));
    app.once("window-all-closed", this.onAllWindowsClosed.bind(this, application));
    await application.onReady();
    console.log("");
    return application;
  }
  /**
   * 
   */
  giveTheClientAPort(application, event) {
    if (this.messagePort) {
      this.messagePort.port1.close();
      this.messagePort.port2.close();
      this.messagePort = void 0;
    }
    this.messagePort = new MessageChannelMain();
    this.messagePort.port1.on("message", (event2) => this.onClientMessage(application, event2));
    this.messagePort.port1.start();
    event.sender.postMessage("port", null, [
      this.messagePort.port2
    ]);
  }
  /**
   * Electron specific message handling.
   * Replaces HTTP calls by using Electron's IPC mechanism.
   */
  async onClientMessage(application, event) {
    const { requestId, path, method, body } = event.data;
    try {
      const request = new Request(application, event, requestId, method, path, body);
      const router = RootInjector.resolve(Router);
      const response = await router.handle(request);
      this.messagePort?.port1.postMessage(response);
    } catch (err) {
      const response = {
        requestId,
        status: 500,
        body: null,
        error: err.message || "Internal Server Error"
      };
      this.messagePort?.port1.postMessage(response);
    }
  }
  /**
   * 
   */
  onAppActivated(application) {
    if (BrowserWindow.getAllWindows().length === 0) {
      application.onReady();
    }
  }
  /**
   * 
   */
  async onAllWindowsClosed(application) {
    this.messagePort?.port1.close();
    await application.dispose();
    if (process.platform !== "darwin") {
      app.quit();
    }
  }
}, __name(_a3, "Nox"), _a3);
export {
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
  Patch,
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
  VariantAlsoNegotiatesException,
  bootstrapApplication,
  getControllerMetadata,
  getGuardForController,
  getGuardForControllerAction,
  getInjectableMetadata,
  getModuleMetadata,
  getRouteMetadata
};
//# sourceMappingURL=noxus.mjs.map