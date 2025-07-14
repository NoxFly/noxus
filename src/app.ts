/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 */

export interface IApp {
    dispose(): Promise<void>;
    onReady(): Promise<void>;
}
