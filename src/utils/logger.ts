/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 */

/**
 * Logger is a utility class for logging messages to the console.
 */
export type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug' | 'comment';

/**
 * Returns a formatted timestamp for logging.
 */
function getPrettyTimestamp(): string {
    const now = new Date();
    return `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`
        + ` ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
}

/**
 * Generates a log prefix for the console output.
 * @param callee - The name of the function or class that is logging the message.
 * @param messageType - The type of message being logged (e.g., 'log', 'info', 'warn', 'error', 'debug').
 * @param color - The color to use for the log message.
 * @returns A formatted string that includes the timestamp, process ID, message type, and callee name.
 */
function getLogPrefix(callee: string, messageType: string, color: string): string {
    const timestamp = getPrettyTimestamp();

    const spaces = ' '.repeat(10 - messageType.length);

    return `${color}[APP] ${process.pid} - ${Logger.colors.initial}`
        + `${timestamp}${spaces}`
        + `${color}${messageType.toUpperCase()}${Logger.colors.initial} `
        + `${Logger.colors.yellow}[${callee}]${Logger.colors.initial}`;
}

/**
 * Formats an object into a string representation for logging.
 * It converts the object to JSON and adds indentation for readability.
 * @param prefix - The prefix to use for the formatted object.
 * @param arg - The object to format.
 * @returns A formatted string representation of the object, with each line prefixed by the specified prefix.
 */
function formatObject(prefix: string, arg: object): string {
    const json = JSON.stringify(arg, null, 2);

    const prefixedJson = json
        .split('\n')
        .map((line, idx) => idx === 0 ? `${Logger.colors.darkGrey}${line}` : `${prefix} ${Logger.colors.grey}${line}`)
        .join('\n') + Logger.colors.initial;

    return prefixedJson;
}

/**
 * Formats the arguments for logging.
 * It colors strings and formats objects with indentation.
 * This function is used to prepare the arguments for console output.
 * @param prefix - The prefix to use for the formatted arguments.
 * @param args - The arguments to format.
 * @param color - The color to use for the formatted arguments.
 * @returns An array of formatted arguments, where strings are colored and objects are formatted with indentation.
 */
function formattedArgs(prefix: string, args: any[], color: string): any[] {
    return args.map(arg => {
        if(typeof arg === 'string') {
            return `${color}${arg}${Logger.colors.initial}`;
        }

        else if(typeof arg === 'object') {
            return formatObject(prefix, arg);
        }

        return arg;
    });
}

/**
 * Gets the name of the caller function or class from the stack trace.
 * This function is used to determine the context of the log message.
 * @returns The name of the caller function or class.
 */
function getCallee(): string {
    const stack = new Error().stack?.split('\n') ?? [];
    const caller = stack[3]
        ?.trim()
        .match(/at (.+?)(?:\..+)? .+$/)
        ?.[1]
        ?.replace('Object', '')
        .replace(/^_/, '')
        || "App";
    return caller;
}

/**
 * Checks if the current log level allows logging the specified level.
 * This function compares the current log level with the specified level to determine if logging should occur.
 * @param level - The log level to check.
 * @returns A boolean indicating whether the log level is enabled.
 */
function canLog(level: LogLevel): boolean {
    return logLevelRank[level] >= logLevelRank[logLevel];
}


let logLevel: LogLevel = 'debug';

const logLevelRank: Record<LogLevel, number> = {
    debug: 0,
    comment: 1,
    log: 2,
    info: 3,
    warn: 4,
    error: 5,
};

export namespace Logger {

    /**
     * Sets the log level for the logger.
     * This function allows you to change the log level dynamically at runtime.
     * This won't affect the startup logs.
     * @param level Sets the log level for the logger.
     */
    export function setLogLevel(level: LogLevel): void {
        logLevel = level;
    }

    /**
     * Logs a message to the console with log level LOG.
     * This function formats the message with a timestamp, process ID, and the name of the caller function or class.
     * It uses different colors for different log levels to enhance readability.
     * @param args The arguments to log.
     */
    export function log(...args: any[]): void {
        if(!canLog('log'))
            return;

        const callee = getCallee();
        const prefix = getLogPrefix(callee, "log", colors.green);
        console.log(prefix, ...formattedArgs(prefix, args, colors.green));
    }

    /**
     * Logs a message to the console with log level INFO.
     * This function formats the message with a timestamp, process ID, and the name of the caller function or class.
     * It uses different colors for different log levels to enhance readability.
     * @param args The arguments to log.
     */
    export function info(...args: any[]): void {
        if(!canLog('info'))
            return;

        const callee = getCallee();
        const prefix = getLogPrefix(callee, "info", colors.blue);
        console.info(prefix, ...formattedArgs(prefix, args, colors.blue));
    }

    /**
     * Logs a message to the console with log level WARN.
     * This function formats the message with a timestamp, process ID, and the name of the caller function or class.
     * It uses different colors for different log levels to enhance readability.
     * @param args The arguments to log.
     */
    export function warn(...args: any[]): void {
        if(!canLog('warn'))
            return;

        const callee = getCallee();
        const prefix = getLogPrefix(callee, "warn", colors.brown);
        console.warn(prefix, ...formattedArgs(prefix, args, colors.brown));
    }

    /**
     * Logs a message to the console with log level ERROR.
     * This function formats the message with a timestamp, process ID, and the name of the caller function or class.
     * It uses different colors for different log levels to enhance readability.
     * @param args The arguments to log.
     */
    export function error(...args: any[]): void {
        if(!canLog('error'))
            return;

        const callee = getCallee();
        const prefix = getLogPrefix(callee, "error", colors.red);
        console.error(prefix, ...formattedArgs(prefix, args, colors.red));
    }

    export function errorStack(...args: any[]): void {
        if(!canLog('error'))
            return;

        const callee = getCallee();
        const prefix = getLogPrefix(callee, "error", colors.grey);
        console.error(prefix, ...formattedArgs(prefix, args, colors.grey));
    }

    /**
     * Logs a message to the console with log level DEBUG.
     * This function formats the message with a timestamp, process ID, and the name of the caller function or class.
     * It uses different colors for different log levels to enhance readability.
     * @param args The arguments to log.
     */
    export function debug(...args: any[]): void {
        if(!canLog('debug'))
            return;

        const callee = getCallee();
        const prefix = getLogPrefix(callee, "debug", colors.purple);
        console.debug(prefix, ...formattedArgs(prefix, args, colors.purple));
    }

    /**
     * Logs a message to the console with log level COMMENT.
     * This function formats the message with a timestamp, process ID, and the name of the caller function or class.
     * It uses different colors for different log levels to enhance readability.
     * @param args The arguments to log.
     */
    export function comment(...args: any[]): void {
        if(!canLog('comment'))
            return;

        const callee = getCallee();
        const prefix = getLogPrefix(callee, "comment", colors.grey);
        console.debug(prefix, ...formattedArgs(prefix, args, colors.grey));
    }


    export const colors = {
        black: '\x1b[0;30m',
        grey: '\x1b[0;37m',
        red: '\x1b[0;31m',
        green: '\x1b[0;32m',
        brown: '\x1b[0;33m',
        blue: '\x1b[0;34m',
        purple: '\x1b[0;35m',

        darkGrey: '\x1b[1;30m',
        lightRed: '\x1b[1;31m',
        lightGreen: '\x1b[1;32m',
        yellow: '\x1b[1;33m',
        lightBlue: '\x1b[1;34m',
        magenta: '\x1b[1;35m',
        cyan: '\x1b[1;36m',
        white: '\x1b[1;37m',

        initial: '\x1b[0m'
    };
}
