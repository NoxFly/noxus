/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 *
 * Entry point for Electron preload scripts.
 * Imports electron/renderer — must NOT be bundled into renderer web code.
 */

export * from './internal/preload-bridge';
