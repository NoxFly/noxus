/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 *
 * Entry point for renderer web consumers (Angular, React, Vue, Vanilla...).
 * No Electron imports — safe to bundle with any web bundler.
 */

export * from './internal/renderer-client';
export * from './internal/renderer-events';
export * from './internal/request';
export type { HttpMethod, AtomicHttpMethod } from './decorators/method.decorator';
