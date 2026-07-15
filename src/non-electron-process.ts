/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 */

/**
 * Entry point for nodeJS non-electron process consumers.
 * For instance, if main process creates a child process that
 * wants to use Logger and DI.
 * Child processes must not try to communicate with the renderer
 * process.
 * order of exports here matters and can affect module resolution.
 * Please be cautious when modifying.
 */

export * from './DI/app-injector';
export * from './internal/exceptions';
export * from './decorators/injectable.decorator';
export * from './utils/logger';
export * from './utils/types';
export * from './utils/forward-ref';
