/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 */

/**
 * Entry point for Electron main-process consumers.
 * order of exports here matters and can affect module resolution.
 * Please be cautious when modifying.
 */

export * from './DI/app-injector';
export * from './router';
export * from './app';
export * from './bootstrap';
export * from './exceptions';
export * from './decorators/middleware.decorator';
export * from './decorators/guards.decorator';
export * from './decorators/controller.decorator';
export * from './decorators/injectable.decorator';
export * from './decorators/inject.decorator';
export * from './decorators/method.decorator';
export * from './decorators/module.decorator';
export * from './preload-bridge';
export * from './utils/logger';
export * from './utils/types';
export * from './utils/forward-ref';
export * from './request';
export * from './renderer-events';
export * from './renderer-client';
export * from './socket';

