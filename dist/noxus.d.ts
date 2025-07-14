/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 */
interface Type<T> extends Function {
    new (...args: any[]): T;
}
type MaybeAsync<T> = T | Promise<T>;


type Lifetime = 'singleton' | 'scope' | 'transient';
interface IBinding {
    lifetime: Lifetime;
    implementation: Type<unknown>;
    instance?: InstanceType<Type<unknown>>;
}
declare class AppInjector {
    readonly name: string | null;
    bindings: Map<Type<unknown>, IBinding>;
    singletons: Map<Type<unknown>, unknown>;
    scoped: Map<Type<unknown>, unknown>;
    constructor(name?: string | null);
    /**
     * Utilisé généralement pour créer un scope d'injection de dépendances
     * au niveau "scope" (donc durée de vie d'une requête)
     */
    createScope(): AppInjector;
    /**
     * Appelé lorsqu'on souhaite résoudre une dépendance,
     * c'est-à-dire récupérer l'instance d'une classe donnée.
     */
    resolve<T extends Type<unknown>>(target: T): InstanceType<T>;
    /**
     *
     */
    private instantiate;
}
declare const RootInjector: AppInjector;

interface IApp {
    dispose(): Promise<void>;
    onReady(): Promise<void>;
}


interface IRouteMetadata {
    method: HttpMethod;
    path: string;
    handler: string;
    guards: Type<IGuard>[];
}
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
declare const Get: (path: string) => MethodDecorator;
declare const Post: (path: string) => MethodDecorator;
declare const Put: (path: string) => MethodDecorator;
declare const Patch: (path: string) => MethodDecorator;
declare const Delete: (path: string) => MethodDecorator;
declare const ROUTE_METADATA_KEY: unique symbol;
declare function getRouteMetadata(target: Type<unknown>): IRouteMetadata[];


declare class Request {
    readonly app: IApp;
    readonly event: Electron.MessageEvent;
    readonly id: string;
    readonly method: HttpMethod;
    readonly path: string;
    readonly body: any;
    readonly context: any;
    readonly params: Record<string, string>;
    constructor(app: IApp, event: Electron.MessageEvent, id: string, method: HttpMethod, path: string, body: any);
}
interface IRequest<T = any> {
    requestId: string;
    path: string;
    method: HttpMethod;
    body?: T;
}
interface IResponse<T = any> {
    requestId: string;
    status: number;
    body?: T;
    error?: string;
}


interface IGuard {
    canActivate(request: Request): MaybeAsync<boolean>;
}
/**
 * Peut être utilisé pour protéger les routes d'un contrôleur.
 * Peut être utilisé sur une classe controleur, ou sur une méthode de contrôleur.
 */
declare function Authorize(...guardClasses: Type<IGuard>[]): MethodDecorator & ClassDecorator;
declare function getGuardForController(controllerName: string): Type<IGuard>[];
declare function getGuardForControllerAction(controllerName: string, actionName: string): Type<IGuard>[];


interface IRouteDefinition {
    method: string;
    path: string;
    controller: Type<any>;
    handler: string;
    guards: Type<IGuard>[];
}
type ControllerAction = (request: Request, response: IResponse) => any;
declare class Router {
    private readonly routes;
    registerController(controllerClass: Type<unknown>): Router;
    handle(request: Request): Promise<IResponse>;
    private findRoute;
    private resolveController;
    private verifyRequestBody;
    private extractParams;
}


/**
 *
 */
declare function bootstrapApplication(root: Type<IApp>, rootModule: Type<any>): Promise<IApp>;

declare abstract class ResponseException extends Error {
    abstract readonly status: number;
    constructor(message?: string);
}
declare class BadRequestException extends ResponseException {
    readonly status = 400;
}
declare class UnauthorizedException extends ResponseException {
    readonly status = 401;
}
declare class PaymentRequiredException extends ResponseException {
    readonly status = 402;
}
declare class ForbiddenException extends ResponseException {
    readonly status = 403;
}
declare class NotFoundException extends ResponseException {
    readonly status = 404;
}
declare class MethodNotAllowedException extends ResponseException {
    readonly status = 405;
}
declare class NotAcceptableException extends ResponseException {
    readonly status = 406;
}
declare class RequestTimeoutException extends ResponseException {
    readonly status = 408;
}
declare class ConflictException extends ResponseException {
    readonly status = 409;
}
declare class UpgradeRequiredException extends ResponseException {
    readonly status = 426;
}
declare class TooManyRequestsException extends ResponseException {
    readonly status = 429;
}
declare class InternalServerException extends ResponseException {
    readonly status = 500;
}
declare class NotImplementedException extends ResponseException {
    readonly status = 501;
}
declare class BadGatewayException extends ResponseException {
    readonly status = 502;
}
declare class ServiceUnavailableException extends ResponseException {
    readonly status = 503;
}
declare class GatewayTimeoutException extends ResponseException {
    readonly status = 504;
}
declare class HttpVersionNotSupportedException extends ResponseException {
    readonly status = 505;
}
declare class VariantAlsoNegotiatesException extends ResponseException {
    readonly status = 506;
}
declare class InsufficientStorageException extends ResponseException {
    readonly status = 507;
}
declare class LoopDetectedException extends ResponseException {
    readonly status = 508;
}
declare class NotExtendedException extends ResponseException {
    readonly status = 510;
}
declare class NetworkAuthenticationRequiredException extends ResponseException {
    readonly status = 511;
}
declare class NetworkConnectTimeoutException extends ResponseException {
    readonly status = 599;
}


interface IControllerMetadata {
    path: string;
    guards: Type<IGuard>[];
}
declare function Controller(path: string): ClassDecorator;
declare const CONTROLLER_METADATA_KEY: unique symbol;
declare function getControllerMetadata(target: Type<unknown>): IControllerMetadata | undefined;


declare function Injectable(lifetime?: Lifetime): ClassDecorator;
declare const INJECTABLE_METADATA_KEY: unique symbol;
declare function getInjectableMetadata(target: Type<unknown>): Lifetime | undefined;


declare function Module(metadata: IModuleMetadata): ClassDecorator;
declare const MODULE_METADATA_KEY: unique symbol;
interface IModuleMetadata {
    imports?: Type<unknown>[];
    exports?: Type<unknown>[];
    providers?: Type<unknown>[];
    controllers?: Type<unknown>[];
}
declare function getModuleMetadata(target: Function): IModuleMetadata | undefined;

type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug';
declare namespace Logger {
    function setLogLevel(level: LogLevel): void;
    const colors: {
        black: string;
        grey: string;
        red: string;
        green: string;
        brown: string;
        blue: string;
        purple: string;
        darkGrey: string;
        lightRed: string;
        lightGreen: string;
        yellow: string;
        lightBlue: string;
        magenta: string;
        cyan: string;
        white: string;
        initial: string;
    };
    function log(...args: any[]): void;
    function info(...args: any[]): void;
    function warn(...args: any[]): void;
    function error(...args: any[]): void;
    function debug(...args: any[]): void;
}

export { Authorize, BadGatewayException, BadRequestException, CONTROLLER_METADATA_KEY, ConflictException, Controller, type ControllerAction, Delete, ForbiddenException, GatewayTimeoutException, Get, type HttpMethod, HttpVersionNotSupportedException, type IApp, type IBinding, type IControllerMetadata, type IGuard, type IModuleMetadata, INJECTABLE_METADATA_KEY, type IRequest, type IResponse, type IRouteDefinition, type IRouteMetadata, Injectable, InsufficientStorageException, InternalServerException, type Lifetime, type LogLevel, Logger, LoopDetectedException, MODULE_METADATA_KEY, type MaybeAsync, MethodNotAllowedException, Module, NetworkAuthenticationRequiredException, NetworkConnectTimeoutException, NotAcceptableException, NotExtendedException, NotFoundException, NotImplementedException, Patch, PaymentRequiredException, Post, Put, ROUTE_METADATA_KEY, Request, RequestTimeoutException, ResponseException, RootInjector, Router, ServiceUnavailableException, TooManyRequestsException, type Type, UnauthorizedException, UpgradeRequiredException, VariantAlsoNegotiatesException, bootstrapApplication, getControllerMetadata, getGuardForController, getGuardForControllerAction, getInjectableMetadata, getModuleMetadata, getRouteMetadata };
