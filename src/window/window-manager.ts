/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 */

import { BrowserWindow } from 'electron/main';
import { Injectable } from '../decorators/injectable.decorator';
import { Logger } from '../utils/logger';

export interface WindowConfig extends Electron.BrowserWindowConstructorOptions {
    /**
     * If true, the window expands to fill the work area after creation
     * using an animated setBounds. The content is loaded only after
     * the animation completes, preventing the viewbox freeze issue.
     * @default false
     */
    expandToWorkArea?: boolean;

    /**
     * Duration in ms to wait for the setBounds animation to complete
     * before loading content. Only used when expandToWorkArea is true.
     * @default 600
     */
    expandAnimationDuration?: number;
}

export interface WindowRecord {
    window: BrowserWindow;
    id: number;
}

/**
 * @description
 * The events emitted by WindowManager when windows are created, closed, focused, or blurred.
 */
export type WindowEvent = 'created' | 'closed' | 'focused' | 'blurred';

/**
 * WindowManager is a singleton service that centralizes BrowserWindow lifecycle.
 *
 * Features:
 * - Creates and tracks all application windows.
 * - Handles the animated expand-to-work-area pattern correctly,
 *   loading content only after the animation ends to avoid the viewbox freeze.
 * - Provides convenience methods to get windows by id, get the main window, etc.
 * - Automatically removes windows from the registry on close.
 *
 * @example
 * // In your IApp.onReady():
 * const wm = inject(WindowManager);
 *
 * const win = await wm.create({
 *   width: 600, height: 600, center: true,
 *   expandToWorkArea: true,
 *   webPreferences: { preload: path.join(__dirname, 'preload.js') },
 * });
 *
 * win.loadFile('index.html');
 */
@Injectable({ lifetime: 'singleton' })
export class WindowManager {
    private readonly _windows = new Map<number, BrowserWindow>();
    private readonly listeners = new Map<WindowEvent, Set<(win: BrowserWindow) => void>>();

    private _mainWindowId: number | undefined;

    // -------------------------------------------------------------------------
    // Creation
    // -------------------------------------------------------------------------

    /**
     * Creates a BrowserWindow, optionally performs an animated expand to the
     * work area, and registers it in the manager.
     *
     * If expandToWorkArea is true:
     * 1. The window is created at the given initial size (defaults to 600×600, centered).
     * 2. An animated setBounds expands it to the full work area.
     * 3. The returned promise resolves only after the animation, so callers
     *    can safely call win.loadFile() without the viewbox freeze.
     *
     * @param config Window configuration.
     * @param isMain Mark this window as the main window (accessible via getMain()).
     */
    public async create(config: WindowConfig, isMain = false): Promise<BrowserWindow> {
        const {
            expandToWorkArea = false,
            expandAnimationDuration = 600,
            ...bwOptions
        } = config;

        // show: false by default during creation — we control visibility
        const win = new BrowserWindow({ show: false, ...bwOptions });

        this._register(win, isMain);

        if (expandToWorkArea) {
            await this._expandToWorkArea(win, expandAnimationDuration);
        }

        win.once('ready-to-show', () => win.show());

        Logger.log(`[WindowManager] Created window #${win.id}${isMain ? ' (main)' : ''}`);

        return win;
    }

    /**
     * Creates the initial "splash" window that is shown immediately after
     * app.whenReady(). It is displayed instantly (show: true, no preload
     * loading) and then expanded to the work area with animation.
     *
     * After the animation completes you can call win.loadFile() without
     * experiencing the viewbox freeze.
     *
     * This is the recommended way to get pixels on screen as fast as possible.
     *
     * @example
     * const win = await wm.createSplash({
     *   webPreferences: { preload: path.join(__dirname, 'preload.js') }
     * });
     * win.loadFile('index.html');
     */
    public async createSplash(
        options: Electron.BrowserWindowConstructorOptions & {
            animationDuration?: number;
            expandToWorkArea?: boolean;
        } = {},
    ): Promise<BrowserWindow> {
        const {
            animationDuration = 10,
            expandToWorkArea = true,
            ...bwOptions
        } = options;

        const win = new BrowserWindow({
            width: 600,
            height: 600,
            center: true,
            show: true,
            ...bwOptions,
        });

        this._register(win, true);

        Logger.log(`[WindowManager] Splash window #${win.id} created`);

        if(expandToWorkArea) {
            await (() => new Promise((r) => setTimeout(r, 500)))();
            await this._expandToWorkArea(win, animationDuration);
        }

        return win;
    }

    // -------------------------------------------------------------------------
    // Accessors
    // -------------------------------------------------------------------------

    /** Returns all currently open windows. */
    public getAll(): BrowserWindow[] {
        return [...this._windows.values()];
    }

    /** Returns the window designated as main, or undefined. */
    public getMain(): BrowserWindow | undefined {
        return this._mainWindowId !== undefined
            ? this._windows.get(this._mainWindowId)
            : undefined;
    }

    /** Returns a window by its Electron id, or undefined. */
    public getById(id: number): BrowserWindow | undefined {
        return this._windows.get(id);
    }

    /** Returns the number of open windows. */
    public get count(): number {
        return this._windows.size;
    }

    // -------------------------------------------------------------------------
    // Actions
    // -------------------------------------------------------------------------

    /** Closes and destroys a window by id. */
    public close(id: number): void {
        const win = this._windows.get(id);

        if (!win) {
            Logger.warn(`[WindowManager] Window #${id} not found`);
            return;
        }

        win.destroy();
    }

    /** Closes all windows. */
    public closeAll(): void {
        for (const win of this._windows.values()) {
            win.destroy();
        }
    }

    /**
     * Sends a message to a specific window via webContents.send.
     * @param id Target window id.
     * @param channel IPC channel name.
     * @param args Payload.
     */
    public send(id: number, channel: string, ...args: unknown[]): void {
        const win = this._windows.get(id);
        if (!win || win.isDestroyed()) {
            Logger.warn(`[WindowManager] Cannot send to window #${id}: not found or destroyed`);
            return;
        }
        win.webContents.send(channel, ...args);
    }

    /**
     * Broadcasts a message to all open windows.
     */
    public broadcast(channel: string, ...args: unknown[]): void {
        for (const win of this._windows.values()) {
            if (!win.isDestroyed()) {
                win.webContents.send(channel, ...args);
            }
        }
    }

    // -------------------------------------------------------------------------
    // Events
    // -------------------------------------------------------------------------

    public on(event: WindowEvent, handler: (win: BrowserWindow) => void): () => void {
        const set = this.listeners.get(event) ?? new Set();
        set.add(handler);
        this.listeners.set(event, set);
        return () => set.delete(handler); // retourne unsubscribe
    }

    private _emit(event: WindowEvent, win: BrowserWindow): void {
        this.listeners.get(event)?.forEach(h => h(win));
    }

    // -------------------------------------------------------------------------
    // Private
    // -------------------------------------------------------------------------

    private _register(win: BrowserWindow, isMain: boolean): void {
        this._windows.set(win.id, win);

        if (isMain && this._mainWindowId === undefined) {
            this._mainWindowId = win.id;
        }

        this._emit('created', win);

        win.on('focus', () => this._emit('focused', win));
        win.on('blur', () => this._emit('blurred', win));

        win.once('closed', () => {
            this._windows.delete(win.id);

            if (this._mainWindowId === win.id) {
                this._mainWindowId = undefined;
            }

            Logger.log(`[WindowManager] Window #${win.id} closed`);

            this._emit('closed', win);
        });
    }

    /**
     * Animates the window to the full work area of the primary display.
     * Resolves only after the animation is complete, so that content loaded
     * afterward gets the correct surface size (no viewbox freeze).
     */
    private _expandToWorkArea(win: BrowserWindow, animationDuration: number): Promise<void> {
        return new Promise((resolve) => {
            win.maximize();

            // Wait for the animation to finish before resolving.
            // We listen to the 'resize' event which fires once the OS
            // animation completes, with a safety timeout as fallback.
            let resolved = false;

            const done = (): void => {
                if (resolved) {
                    return;
                }
                resolved = true;
                win.removeListener('resize', done);
                resolve();
            };

            win.once('resize', done);
            setTimeout(done, animationDuration);
        });
    }
}
