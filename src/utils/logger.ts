/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 */

import * as fs from 'fs';
import * as path from 'path';

/**
 * Logger is a utility class for logging messages to the console.
 */
export type LogLevel =
    | 'debug'
    | 'comment'
    | 'log'
    | 'info'
    | 'warn'
    | 'error'
    | 'critical'
;

interface FileLogState {
    queue: string[];
    isWriting: boolean;
}



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
function getLogPrefix(callee: string, messageType: string, color?: string): string {
    const timestamp = getPrettyTimestamp();

    const spaces = " ".repeat(10 - messageType.length);

    let colReset = Logger.colors.initial;
    let colCallee = Logger.colors.yellow;

    if(color === undefined) {
        color = "";
        colReset = "";
        colCallee = "";
    }

    return `${color}[APP] ${process.pid} - ${colReset}`
        + `${timestamp}${spaces}`
        + `${color}${messageType.toUpperCase()}${colReset} `
        + `${colCallee}[${callee}]${colReset}`;
}

/**
 * Formats an object into a string representation for logging.
 * It converts the object to JSON and adds indentation for readability.
 * @param prefix - The prefix to use for the formatted object.
 * @param arg - The object to format.
 * @returns A formatted string representation of the object, with each line prefixed by the specified prefix.
 */
function formatObject(prefix: string, arg: object, enableColor: boolean = true): string {
    const json = JSON.stringify(arg, null, 2);

    let colStart = "";
    let colLine = "";
    let colReset = "";

    if(enableColor) {
        colStart = Logger.colors.darkGrey;
        colLine = Logger.colors.grey;
        colReset = Logger.colors.initial;
    }

    const prefixedJson = json
        .split('\n')
        .map((line, idx) => idx === 0 ? `${colStart}${line}` : `${prefix} ${colLine}${line}`)
        .join('\n') + colReset;

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
function formattedArgs(prefix: string, args: any[], color?: string): any[] {
    let colReset = Logger.colors.initial;

    if(color === undefined) {
        color = "";
        colReset = "";
    }

    return args.map(arg => {
        if(typeof arg === "string") {
            return `${color}${arg}${colReset}`;
        }

        else if(typeof arg === "object") {
            return formatObject(prefix, arg, color === "");
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
        ?.replace("Object", "")
        .replace(/^_/, "")
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
    return logLevels.has(level);
}

/**
 * Writes a log message to a file asynchronously to avoid blocking the event loop.
 * It batches messages if writing is already in progress.
 * @param filepath - The path to the log file.
 */
function processLogQueue(filepath: string): void {
    const state = fileStates.get(filepath);

    if(!state || state.isWriting || state.queue.length === 0) {
        return;
    }

    state.isWriting = true;

    // Optimization: Grab all pending messages to write in one go
    const messagesToWrite = state.queue.join('\n') + '\n';
    state.queue = []; // Clear the queue immediately

    const dir = path.dirname(filepath);

    // Using async IO to allow other operations
    fs.mkdir(dir, { recursive: true }, (err) => {
        if(err) {
            console.error(`[Logger] Failed to create directory ${dir}`, err);
            state.isWriting = false;
            return;
        }

        fs.appendFile(filepath, messagesToWrite, { encoding: "utf-8" }, (err) => {
            state.isWriting = false;

            if(err) {
                console.error(`[Logger] Failed to write log to ${filepath}`, err);
            }

            // If new messages arrived while we were writing, process them now
            if(state.queue.length > 0) {
                processLogQueue(filepath);
            }
        });
    });
}

/**
 * Adds a message to the file queue and triggers processing.
 */
function enqueue(filepath: string, message: string): void {
    if(!fileStates.has(filepath)) {
        fileStates.set(filepath, { queue: [], isWriting: false });
    }

    const state = fileStates.get(filepath)!;
    state.queue.push(message);

    processLogQueue(filepath);
}

/**
 *
 */
function output(level: LogLevel, args: any[]): void {
    if(!canLog(level)) {
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

        if(filepath) {
            const message = prefix + " " + data.join(" ");
            enqueue(filepath, message);
        }
    }
}



export namespace Logger {

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
    export function setLogLevel(level: LogLevel | LogLevel[]): void {
        logLevels.clear();

        if(Array.isArray(level)) {
            for(const lvl of level) {
                logLevels.add(lvl);
            }
        }
        else {
            const targetRank = logLevelRank[level];

            for(const [lvl, rank] of Object.entries(logLevelRank) as [LogLevel, number][]) {
                if(rank >= targetRank) {
                    logLevels.add(lvl);
                }
            }
        }
    }

    /**
     * Logs a message to the console with log level LOG.
     * This function formats the message with a timestamp, process ID, and the name of the caller function or class.
     * It uses different colors for different log levels to enhance readability.
     * @param args The arguments to log.
     */
    export function log(...args: any[]): void {
        output("log", args);
    }

    /**
     * Logs a message to the console with log level INFO.
     * This function formats the message with a timestamp, process ID, and the name of the caller function or class.
     * It uses different colors for different log levels to enhance readability.
     * @param args The arguments to log.
     */
    export function info(...args: any[]): void {
        output("info", args);
    }

    /**
     * Logs a message to the console with log level WARN.
     * This function formats the message with a timestamp, process ID, and the name of the caller function or class.
     * It uses different colors for different log levels to enhance readability.
     * @param args The arguments to log.
     */
    export function warn(...args: any[]): void {
        output("warn", args);
    }

    /**
     * Logs a message to the console with log level ERROR.
     * This function formats the message with a timestamp, process ID, and the name of the caller function or class.
     * It uses different colors for different log levels to enhance readability.
     * @param args The arguments to log.
     */
    export function error(...args: any[]): void {
        output("error", args);
    }

    /**
     * Logs a message to the console with log level ERROR and a grey color scheme.
     */
    export function errorStack(...args: any[]): void {
        output("error", args);
    }

    /**
     * Logs a message to the console with log level DEBUG.
     * This function formats the message with a timestamp, process ID, and the name of the caller function or class.
     * It uses different colors for different log levels to enhance readability.
     * @param args The arguments to log.
     */
    export function debug(...args: any[]): void {
        output("debug", args);
    }

    /**
     * Logs a message to the console with log level COMMENT.
     * This function formats the message with a timestamp, process ID, and the name of the caller function or class.
     * It uses different colors for different log levels to enhance readability.
     * @param args The arguments to log.
     */
    export function comment(...args: any[]): void {
        output("comment", args);
    }

    /**
     * Logs a message to the console with log level CRITICAL.
     * This function formats the message with a timestamp, process ID, and the name of the caller function or class.
     * It uses different colors for different log levels to enhance readability.
     * @param args The arguments to log.
     */
    export function critical(...args: any[]): void {
        output("critical", args);
    }

    /**
     * Enables logging to a file output for the specified log levels.
     * @param filepath The path to the log file.
     * @param levels The log levels to enable file logging for. Defaults to all levels.
     */
    export function enableFileLogging(filepath: string, levels: LogLevel[] = ["debug", "comment", "log", "info", "warn", "error", "critical"]): void {
        for(const level of levels) {
            fileSettings.set(level, { filepath });
        }
    }

    /**
     * Disables logging to a file output for the specified log levels.
     * @param levels The log levels to disable file logging for. Defaults to all levels.
     */
    export function disableFileLogging(levels: LogLevel[] = ["debug", "comment", "log", "info", "warn", "error", "critical"]): void {
        for(const level of levels) {
            fileSettings.delete(level);
        }
    }


    export const colors = {
        black: "\x1b[0;30m",
        grey: "\x1b[0;37m",
        red: "\x1b[0;31m",
        green: "\x1b[0;32m",
        brown: "\x1b[0;33m",
        blue: "\x1b[0;34m",
        purple: "\x1b[0;35m",

        darkGrey: "\x1b[1;30m",
        lightRed: "\x1b[1;31m",
        lightGreen: "\x1b[1;32m",
        yellow: "\x1b[1;33m",
        lightBlue: "\x1b[1;34m",
        magenta: "\x1b[1;35m",
        cyan: "\x1b[1;36m",
        white: "\x1b[1;37m",

        initial: "\x1b[0m"
    };
}


const fileSettings: Map<LogLevel, { filepath: string }> = new Map();
const fileStates: Map<string, FileLogState> = new Map(); // filepath -> state

const logLevels: Set<LogLevel> = new Set();

const logLevelRank: Record<LogLevel, number> = {
    debug: 0,
    comment: 1,
    log: 2,
    info: 3,
    warn: 4,
    error: 5,
    critical: 6,
};

const logLevelColors: Record<LogLevel, string> = {
    debug: Logger.colors.purple,
    comment: Logger.colors.grey,
    log: Logger.colors.green,
    info: Logger.colors.blue,
    warn: Logger.colors.brown,
    error: Logger.colors.red,
    critical: Logger.colors.lightRed,
};

const logLevelChannel: Record<LogLevel, (message?: any, ...optionalParams: any[]) => void> = {
    debug: console.debug,
    comment: console.debug,
    log: console.log,
    info: console.info,
    warn: console.warn,
    error: console.error,
    critical: console.error,
};


Logger.setLogLevel("debug");
