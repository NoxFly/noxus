import { L as Lifetime } from './app-injector-B3MvgV3k.js';
export { A as AppInjector, F as ForwardRefFn, a as ForwardReference, I as IBinding, M as MaybeAsync, R as RootInjector, T as Type, f as forwardRef, i as inject } from './app-injector-B3MvgV3k.js';

/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 */
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

declare const INJECTABLE_METADATA_KEY: unique symbol;
declare function getInjectableMetadata(target: Function): Lifetime | undefined;
declare function hasInjectableMetadata(target: Function): boolean;


/**
 * The Injectable decorator marks a class as injectable.
 * It allows the class to be registered in the dependency injection system.
 * A class decorated with @Injectable can be injected into other classes
 * either from the constructor of the class that needs it of from the `inject` function.
 * @param lifetime - The lifetime of the injectable. Can be 'singleton', 'scope', or 'transient'.
 */
declare function Injectable(lifetime?: Lifetime): ClassDecorator;


declare const INJECT_METADATA_KEY = "custom:inject";
/**
 * Decorator to manually inject a dependency.
 * Useful for handling circular dependencies with `forwardRef` or injecting specific tokens.
 *
 * @param token The token or forward reference to inject.
 */
declare function Inject(token: any): ParameterDecorator;

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

export { BadGatewayException, BadRequestException, ConflictException, ForbiddenException, GatewayTimeoutException, HttpVersionNotSupportedException, INJECTABLE_METADATA_KEY, INJECT_METADATA_KEY, Inject, Injectable, InsufficientStorageException, InternalServerException, Lifetime, type LogLevel, Logger, LoopDetectedException, MethodNotAllowedException, NetworkAuthenticationRequiredException, NetworkConnectTimeoutException, NotAcceptableException, NotExtendedException, NotFoundException, NotImplementedException, PaymentRequiredException, RequestTimeoutException, ResponseException, ServiceUnavailableException, TooManyRequestsException, UnauthorizedException, UpgradeRequiredException, VariantAlsoNegotiatesException, getInjectableMetadata, hasInjectableMetadata };
