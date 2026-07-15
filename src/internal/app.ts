/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 */

import { app, BrowserWindow, ipcMain, MessageChannelMain } from 'electron/main';
import { Guard } from "../decorators/guards.decorator";
import { Injectable } from '../decorators/injectable.decorator';
import { Middleware } from '../decorators/middleware.decorator';
import { inject } from '../DI/app-injector';
import { InjectorExplorer } from '../DI/injector-explorer';
import { Logger } from '../utils/logger';
import { Type } from '../utils/types';
import { WindowManager } from '../window/window-manager';
import { IResponse, Request } from './request';
import { Router } from './router';
import { NoxSocket } from './socket';

/**
 * Your application service should implement IApp.
 * Noxus calls these lifecycle methods at the appropriate time.
 *
 * Unlike v2, IApp no longer receives a BrowserWindow in onReady.
 * Use the injected WindowManager instead — it is more flexible and
 * does not couple the lifecycle to a single pre-created window.
 *
 * @example
 * @Injectable({ lifetime: 'singleton', deps: [WindowManager, MyService] })
 * class AppService implements IApp {
 *   constructor(private wm: WindowManager, private svc: MyService) {}
 *
 *   async onReady() {
 *     const win = await this.wm.createSplash({ webPreferences: { preload: ... } });
 *     win.loadFile('index.html');
 *   }
 *
 *   async onActivated() { ... }
 *   async dispose() { ... }
 * }
 */
export interface IApp {
    dispose(): Promise<void>;
    onReady(): Promise<void>;
    onActivated(): Promise<void>;
}

@Injectable({ lifetime: 'singleton', deps: [Router, NoxSocket, WindowManager] })
export class NoxApp {
    private appService: IApp | undefined;

    constructor(
        private readonly router: Router,
        private readonly socket: NoxSocket,
        public readonly windowManager: WindowManager,
    ) {}

    // -------------------------------------------------------------------------
    // Initialisation
    // -------------------------------------------------------------------------

    public async init(): Promise<this> {
        ipcMain.on('gimme-my-port', this.giveTheRendererAPort.bind(this));
        app.once('activate', this.onAppActivated.bind(this));
        app.once('window-all-closed', this.onAllWindowsClosed.bind(this));
        console.log('');
        return this;
    }

    // -------------------------------------------------------------------------
    // Public API
    // -------------------------------------------------------------------------

    /**
     * Registers a lazy route. The file behind this prefix is dynamically
     * imported on the first IPC request that targets it.
     *
     * The import function should NOT statically reference heavy modules —
     * the whole point is to defer their loading.
     *
     * @example
     * noxApp.lazy('auth', () => import('./modules/auth/auth.controller.js'));
     * noxApp.lazy('reporting', () => import('./modules/reporting/index.js'));
     */
    public lazy(
        pathPrefix: string,
        load: () => Promise<unknown>,
        guards: Guard[] = [],
        middlewares: Middleware[] = [],
    ): this {
        this.router.registerLazyRoute(pathPrefix, load, guards, middlewares);
        return this;
    }

    /**
     * Eagerly loads a set of modules (controllers + services) before start().
     * Use this for modules that provide services needed by your IApp.onReady().
     *
     * All imports run in parallel; DI is flushed with the two-phase guarantee.
     */
    public async load(importFns: Array<() => Promise<unknown>>): Promise<this> {
        InjectorExplorer.beginAccumulate();
        await Promise.all(importFns.map((fn) => fn()));
        await InjectorExplorer.flushAccumulated();
        return this;
    }

    /**
     * Registers a global middleware applied to every route.
     */
    public use(middleware: Middleware): this {
        this.router.defineRootMiddleware(middleware);
        return this;
    }

    /**
     * Sets the application service (implements IApp) that receives lifecycle events.
     * @param appClass - Class decorated with @Injectable that implements IApp.
     */
    public configure(appClass: Type<IApp>): this {
        this.appService = inject(appClass);
        return this;
    }

    /**
     * Calls IApp.onReady(). Should be called after configure() and any lazy()
     * registrations are set up.
     */
    public start(): this {
        this.appService?.onReady();
        return this;
    }

    // -------------------------------------------------------------------------
    // IPC
    // -------------------------------------------------------------------------

    private readonly onRendererMessage = async (event: Electron.MessageEvent): Promise<void> => {
        const { senderId, requestId, path, method, body, query }: import('./request').IRequest = event.data;
        const channels = this.socket.get(senderId);

        if (!channels) {
            Logger.error(`No message channel found for sender ID: ${senderId}`);
            return;
        }

        try {
            const request = new Request(event, senderId, requestId, method, path, body, query);
            const response = await this.router.handle(request);
            channels.request.port1.postMessage(response);
        }
        catch (err: unknown) {
            const response: IResponse = {
                requestId,
                status: 500,
                body: null,
                error: err instanceof Error ? err.message : 'Internal Server Error',
            };
            channels.request.port1.postMessage(response);
        }
    };

    private giveTheRendererAPort(event: Electron.IpcMainInvokeEvent): void {
        const senderId = event.sender.id;

        if (this.socket.get(senderId)) {
            this.shutdownChannel(senderId);
        }

        const requestChannel = new MessageChannelMain();
        const socketChannel = new MessageChannelMain();

        requestChannel.port1.on('message', this.onRendererMessage);
        requestChannel.port1.start();
        socketChannel.port1.start();

        event.sender.once('destroyed', () => this.shutdownChannel(senderId));

        this.socket.register(senderId, requestChannel, socketChannel);
        event.sender.postMessage('port', { senderId }, [requestChannel.port2, socketChannel.port2]);
    }

    // -------------------------------------------------------------------------
    // Lifecycle
    // -------------------------------------------------------------------------

    private onAppActivated(): void {
        if (process.platform === 'darwin' && BrowserWindow.getAllWindows().length === 0) {
            this.appService?.onActivated();
        }
    }

    private async onAllWindowsClosed(): Promise<void> {
        for (const senderId of this.socket.getSenderIds()) {
            this.shutdownChannel(senderId);
        }

        Logger.info('All windows closed, shutting down application...');
        await this.appService?.dispose();

        if (process.platform !== 'darwin') app.quit();
    }

    private shutdownChannel(channelSenderId: number): void {
        const channels = this.socket.get(channelSenderId);

        if (!channels) {
            return;
        }

        channels.request.port1.off('message', this.onRendererMessage);
        channels.request.port1.close();
        channels.request.port2.close();
        channels.socket.port1.close();
        channels.socket.port2.close();

        this.socket.unregister(channelSenderId);
    }
}
