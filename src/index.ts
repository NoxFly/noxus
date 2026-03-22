/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 *
 * Entry point for renderer process and preload consumers.
 */

export * from './request';
export * from './preload-bridge';
export * from './renderer-events';
export * from './renderer-client';
export type { HttpMethod, AtomicHttpMethod } from './decorators/method.decorator';
