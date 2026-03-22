/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 */
interface Type<T> extends Function {
    new (...args: any[]): T;
}
/**
 * Represents a generic type that can be either a value or a promise resolving to that value.
 */
type MaybeAsync<T> = T | Promise<T>;


/**
 * A function that returns a type.
 * Used for forward references to types that are not yet defined.
 */
interface ForwardRefFn<T = any> {
    (): Type<T>;
}
/**
 * A wrapper class for forward referenced types.
 */
declare class ForwardReference<T = any> {
    readonly forwardRefFn: ForwardRefFn<T>;
    constructor(forwardRefFn: ForwardRefFn<T>);
}
/**
 * Creates a forward reference to a type.
 * @param fn A function that returns the type.
 * @returns A ForwardReference instance.
 */
declare function forwardRef<T = any>(fn: ForwardRefFn<T>): ForwardReference<T>;


/**
 * A DI token uniquely identifies a dependency.
 * It can wrap a class (Type<T>) or be a named symbol token.
 *
 * Using tokens instead of reflect-metadata means dependencies are
 * declared explicitly — no magic type inference, no emitDecoratorMetadata.
 *
 * @example
 * // Class token (most common)
 * const MY_SERVICE = token(MyService);
 *
 * // Named symbol token (for interfaces or non-class values)
 * const DB_URL = token<string>('DB_URL');
 */
declare class Token<T> {
    readonly target: Type<T> | string;
    readonly description: string;
    constructor(target: Type<T> | string);
    toString(): string;
}
/**
 * The key used to look up a class token in the registry.
 * For class tokens, the key is the class constructor itself.
 * For named tokens, the key is the Token instance.
 */
type TokenKey<T = unknown> = Type<T> | Token<T>;


/**
 * Lifetime of a binding in the DI container.
 * - singleton: created once, shared for the lifetime of the app.
 * - scope:     created once per request scope.
 * - transient: new instance every time it is resolved.
 */
type Lifetime = 'singleton' | 'scope' | 'transient';
/**
 * Internal representation of a registered binding.
 */
interface IBinding<T = unknown> {
    lifetime: Lifetime;
    implementation: Type<T>;
    /** Explicit constructor dependencies, declared by the class itself. */
    deps: ReadonlyArray<TokenKey>;
    instance?: T;
}
/**
 * AppInjector is the core DI container.
 * It no longer uses reflect-metadata — all dependency information
 * comes from explicitly declared `deps` arrays on each binding.
 */
declare class AppInjector {
    readonly name: string | null;
    readonly bindings: Map<Type<unknown> | Token<unknown>, IBinding<unknown>>;
    readonly singletons: Map<Type<unknown> | Token<unknown>, unknown>;
    readonly scoped: Map<Type<unknown> | Token<unknown>, unknown>;
    constructor(name?: string | null);
    /**
     * Creates a child scope for per-request lifetime resolution.
     */
    createScope(): AppInjector;
    /**
     * Registers a binding explicitly.
     */
    register<T>(key: TokenKey<T>, implementation: Type<T>, lifetime: Lifetime, deps?: ReadonlyArray<TokenKey>): void;
    /**
     * Resolves a dependency by token or class reference.
     */
    resolve<T>(target: TokenKey<T> | ForwardReference<T>): T;
    private _resolveForwardRef;
    private _instantiate;
}
/**
 * The global root injector. All singletons live here.
 */
declare const RootInjector: AppInjector;
/**
 * Convenience function: resolve a token from the root injector.
 */
declare function inject<T>(t: TokenKey<T> | ForwardReference<T>): T;

declare class ResponseException extends Error {
    readonly status: number;
    constructor(message?: string);
    constructor(statusCode?: number, message?: string);
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


interface InjectableOptions {
    /**
     * Lifetime of this injectable.
     * @default 'scope'
     */
    lifetime?: Lifetime;
    /**
     * Explicit list of constructor dependencies, in the same order as the constructor parameters.
     * Each entry is either a class constructor or a Token created with token().
     *
     * This replaces reflect-metadata / emitDecoratorMetadata entirely.
     *
     * @example
     * @Injectable({ lifetime: 'singleton', deps: [MyRepo, DB_URL] })
     * class MyService {
     *   constructor(private repo: MyRepo, private dbUrl: string) {}
     * }
     */
    deps?: ReadonlyArray<TokenKey>;
}
/**
 * Marks a class as injectable into the Noxus DI container.
 *
 * Unlike the v2 @Injectable, this decorator:
 * - Does NOT require reflect-metadata or emitDecoratorMetadata.
 * - Requires you to declare deps explicitly when the class has constructor parameters.
 * - Supports standalone usage — no module declaration needed.
 *
 * @example
 * // No dependencies
 * @Injectable()
 * class Logger {}
 *
 * // With dependencies
 * @Injectable({ lifetime: 'singleton', deps: [Logger, MyRepo] })
 * class MyService {
 *   constructor(private logger: Logger, private repo: MyRepo) {}
 * }
 *
 * // With a named token
 * const DB_URL = token<string>('DB_URL');
 *
 * @Injectable({ deps: [DB_URL] })
 * class DbService {
 *   constructor(private url: string) {}
 * }
 */
declare function Injectable(options?: InjectableOptions): ClassDecorator;

/**
 * Logger is a utility class for logging messages to the console.
 */
type LogLevel = 'debug' | 'comment' | 'log' | 'info' | 'warn' | 'error' | 'critical';
declare namespace Logger {
    /**
     * Sets the log level for the logger.
     * This function allows you to change the log level dynamically at runtime.
     * This won't affect the startup logs.
     *
     * If the parameter is a single LogLevel, all log levels with equal or higher severity will be enabled.

    * If the parameter is an array of LogLevels, only the specified levels will be enabled.
     *
     * @param level Sets the log level for the logger.
     */
    function setLogLevel(level: LogLevel | LogLevel[]): void;
    /**
     * Logs a message to the console with log level LOG.
     * This function formats the message with a timestamp, process ID, and the name of the caller function or class.
     * It uses different colors for different log levels to enhance readability.
     * @param args The arguments to log.
     */
    function log(...args: any[]): void;
    /**
     * Logs a message to the console with log level INFO.
     * This function formats the message with a timestamp, process ID, and the name of the caller function or class.
     * It uses different colors for different log levels to enhance readability.
     * @param args The arguments to log.
     */
    function info(...args: any[]): void;
    /**
     * Logs a message to the console with log level WARN.
     * This function formats the message with a timestamp, process ID, and the name of the caller function or class.
     * It uses different colors for different log levels to enhance readability.
     * @param args The arguments to log.
     */
    function warn(...args: any[]): void;
    /**
     * Logs a message to the console with log level ERROR.
     * This function formats the message with a timestamp, process ID, and the name of the caller function or class.
     * It uses different colors for different log levels to enhance readability.
     * @param args The arguments to log.
     */
    function error(...args: any[]): void;
    /**
     * Logs a message to the console with log level ERROR and a grey color scheme.
     */
    function errorStack(...args: any[]): void;
    /**
     * Logs a message to the console with log level DEBUG.
     * This function formats the message with a timestamp, process ID, and the name of the caller function or class.
     * It uses different colors for different log levels to enhance readability.
     * @param args The arguments to log.
     */
    function debug(...args: any[]): void;
    /**
     * Logs a message to the console with log level COMMENT.
     * This function formats the message with a timestamp, process ID, and the name of the caller function or class.
     * It uses different colors for different log levels to enhance readability.
     * @param args The arguments to log.
     */
    function comment(...args: any[]): void;
    /**
     * Logs a message to the console with log level CRITICAL.
     * This function formats the message with a timestamp, process ID, and the name of the caller function or class.
     * It uses different colors for different log levels to enhance readability.
     * @param args The arguments to log.
     */
    function critical(...args: any[]): void;
    /**
     * Enables logging to a file output for the specified log levels.
     * @param filepath The path to the log file.
     * @param levels The log levels to enable file logging for. Defaults to all levels.
     */
    function enableFileLogging(filepath: string, levels?: LogLevel[]): void;
    /**
     * Disables logging to a file output for the specified log levels.
     * @param levels The log levels to disable file logging for. Defaults to all levels.
     */
    function disableFileLogging(levels?: LogLevel[]): void;
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
}

export { AppInjector, BadGatewayException, BadRequestException, ConflictException, ForbiddenException, type ForwardRefFn, ForwardReference, GatewayTimeoutException, HttpVersionNotSupportedException, type IBinding, Injectable, type InjectableOptions, InsufficientStorageException, InternalServerException, type Lifetime, type LogLevel, Logger, LoopDetectedException, type MaybeAsync, MethodNotAllowedException, NetworkAuthenticationRequiredException, NetworkConnectTimeoutException, NotAcceptableException, NotExtendedException, NotFoundException, NotImplementedException, PaymentRequiredException, RequestTimeoutException, ResponseException, RootInjector, ServiceUnavailableException, Token, type TokenKey, TooManyRequestsException, type Type, UnauthorizedException, UpgradeRequiredException, VariantAlsoNegotiatesException, forwardRef, inject };
