/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 */

function getPrettyTimestamp(): string {
    const now = new Date();
    return `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`
        + ` ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
}

function getLogPrefix(callee: string, messageType: string, color: string): string {
    const timestamp = getPrettyTimestamp();

    const spaces = ' '.repeat(10 - messageType.length);

    return `${color}[APP] ${process.pid} - ${Logger.colors.initial}`
        + `${timestamp}${spaces}`
        + `${color}${messageType.toUpperCase()}${Logger.colors.initial} `
        + `${Logger.colors.yellow}[${callee}]${Logger.colors.initial}`;
}

function formatObject(prefix: string, arg: object): string {
    const json = JSON.stringify(arg, null, 2);
                
    const prefixedJson = json
        .split('\n')
        .map((line, idx) => idx === 0 ? `${Logger.colors.darkGrey}${line}` : `${prefix} ${Logger.colors.grey}${line}`)
        .join('\n') + Logger.colors.initial;

    return prefixedJson;
}

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

function getCallee(): string {
    const stack = new Error().stack?.split('\n') ?? [];
    const caller = stack[3]?.trim().match(/at (.+?)(?:\..+)? .+$/)?.[1]?.replace('Object', '') || "App";
    return caller;
}

export type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug';

const logLevelRank: Record<LogLevel, number> = {
    debug: 0,
    log: 1,
    info: 2,
    warn: 3,
    error: 4,
};

function canLog(level: LogLevel): boolean {
    return logLevelRank[level] >= logLevelRank[logLevel];
}

let logLevel: LogLevel = 'log';

export namespace Logger {
    
    export function setLogLevel(level: LogLevel): void {
        logLevel = level;
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

    export function log(...args: any[]): void {
        if(!canLog('log'))
            return;

        const callee = getCallee();
        const prefix = getLogPrefix(callee, "log", colors.green);
        console.log(prefix, ...formattedArgs(prefix, args, colors.green));
    }

    export function info(...args: any[]): void {
        if(!canLog('info'))
            return;

        const callee = getCallee();
        const prefix = getLogPrefix(callee, "info", colors.blue);
        console.info(prefix, ...formattedArgs(prefix, args, colors.blue));
    }

    export function warn(...args: any[]): void {
        if(!canLog('warn'))
            return;

        const callee = getCallee();
        const prefix = getLogPrefix(callee, "warn", colors.brown);
        console.warn(prefix, ...formattedArgs(prefix, args, colors.brown));
    }

    export function error(...args: any[]): void {
        if(!canLog('error'))
            return;

        const callee = getCallee();
        const prefix = getLogPrefix(callee, "error", colors.red);
        console.error(prefix, ...formattedArgs(prefix, args, colors.red));
    }

    export function debug(...args: any[]): void {
        if(!canLog('debug'))
            return;

        const callee = getCallee();
        const prefix = getLogPrefix(callee, "debug", colors.purple);
        console.debug(prefix, ...formattedArgs(prefix, args, colors.purple));
    }
}