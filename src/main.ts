/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 *
 * Entry point for Electron main-process consumers.
 */

export * from './DI/app-injector';
export * from './DI/token';
export * from './internal/router';
export * from './internal/app';
export * from './internal/bootstrap';
export * from './internal/exceptions';
export * from './decorators/middleware.decorator';
export * from './decorators/guards.decorator';
export * from './decorators/controller.decorator';
export * from './decorators/injectable.decorator';
export * from './decorators/method.decorator';
export * from './utils/logger';
export * from './utils/types';
export * from './utils/forward-ref';
export * from './internal/request';
export * from './internal/socket';
export * from './window/window-manager';
export * from './internal/routes';
