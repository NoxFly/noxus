/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 */

import { app, BrowserWindow, ipcMain, MessageChannelMain } from "electron/main";
import { Injectable } from "src/decorators/injectable.decorator";
import { IMiddleware } from "src/decorators/middleware.decorator";
import { inject } from "src/DI/app-injector";
import { IRequest, IResponse, Request } from "src/request";
import { NoxSocket } from "src/socket";
import { Router } from "src/router";
import { Logger } from "src/utils/logger";
import { Type } from "src/utils/types";

/**
 * The application service should implement this interface, as
 * the NoxApp class instance will use it to notify the given service
 * about application lifecycle events.
 */
export interface IApp {
    dispose(): Promise<void>;
    onReady(): Promise<void>;
    onActivated(): Promise<void>;
}

/**
 * NoxApp is the main application class that manages the application lifecycle,
 * handles IPC communication, and integrates with the Router.
 */
@Injectable('singleton')
export class NoxApp {
    private app: IApp | undefined;

    /**
     *
     */
    private readonly onRendererMessage = async (event: Electron.MessageEvent): Promise<void> => {
        const { senderId, requestId, path, method, body }: IRequest = event.data;

        const channel = this.socket.get(senderId);

        if(!channel) {
            Logger.error(`No message channel found for sender ID: ${senderId}`);
            return;
        }

        try {
            const request = new Request(event, senderId, requestId, method, path, body);
            const response = await this.router.handle(request);
            channel.port1.postMessage(response);
        }
        catch(err: any) {
            const response: IResponse = {
                requestId,
                status: 500,
                body: null,
                error: err.message || 'Internal Server Error',
            };

            channel.port1.postMessage(response);
        }
    };

    constructor(
        private readonly router: Router,
        private readonly socket: NoxSocket,
    ) {}

    /**
     * Initializes the NoxApp instance.
     * This method sets up the IPC communication, registers event listeners,
     * and prepares the application for use.
     */
    public async init(): Promise<NoxApp> {
        ipcMain.on('gimme-my-port', this.giveTheRendererAPort.bind(this));

        app.once('activate', this.onAppActivated.bind(this));
        app.once('window-all-closed', this.onAllWindowsClosed.bind(this));

        console.log(''); // create a new line in the console to separate setup logs from the future logs

        return this;
    }

    /**
     * Handles the request from the renderer process.
     * This method creates a Request object from the IPC event data,
     * processes it through the Router, and sends the response back
     * to the renderer process using the MessageChannel.
     */
    private giveTheRendererAPort(event: Electron.IpcMainInvokeEvent): void {
        const senderId = event.sender.id;

        if(this.socket.get(senderId)) {
            this.shutdownChannel(senderId);
        }

        const channel = new MessageChannelMain();

        channel.port1.on('message', this.onRendererMessage);
        channel.port1.start();

        this.socket.register(senderId, channel);

        event.sender.postMessage('port', { senderId }, [channel.port2]);
    }

    /**
     * MacOS specific behavior.
     */
    private onAppActivated(): void {
        if(process.platform === 'darwin' && BrowserWindow.getAllWindows().length === 0) {
            this.app?.onActivated();
        }
    }

    /**
     * Shuts down the message channel for a specific sender ID.
     * This method closes the IPC channel for the specified sender ID and
     * removes it from the messagePorts map.
     * @param channelSenderId - The ID of the sender channel to shut down.
     * @param remove - Whether to remove the channel from the messagePorts map.
     */
    private shutdownChannel(channelSenderId: number): void {
        const channel = this.socket.get(channelSenderId);

        if(!channel) {
            Logger.warn(`No message channel found for sender ID: ${channelSenderId}`);
            return;
        }

        channel.port1.off('message', this.onRendererMessage);
        channel.port1.close();
        channel.port2.close();

        this.socket.unregister(channelSenderId);
    }

    /**
     * Handles the application shutdown process.
     * This method is called when all windows are closed, and it cleans up the message channels
     */
    private async onAllWindowsClosed(): Promise<void> {
        for(const senderId of this.socket.getSenderIds()) {
            this.shutdownChannel(senderId);
        }

        Logger.info('All windows closed, shutting down application...');
        await this.app?.dispose();

        if(process.platform !== 'darwin') {
            app.quit();
        }
    }


    // ---

    /**
     * Configures the NoxApp instance with the provided application class.
     * This method allows you to set the application class that will handle lifecycle events.
     * @param app - The application class to configure.
     * @returns NoxApp instance for method chaining.
     */
    public configure(app: Type<IApp>): NoxApp {
        this.app = inject(app);
        return this;
    }

    /**
     * Registers a middleware for the root of the application.
     * This method allows you to define a middleware that will be applied to all requests
     * @param middleware - The middleware class to register.
     * @returns NoxApp instance for method chaining.
     */
    public use(middleware: Type<IMiddleware>): NoxApp {
        this.router.defineRootMiddleware(middleware);
        return this;
    }

    /**
     * Should be called after the bootstrapApplication function is called.
     * @returns NoxApp instance for method chaining.
     */
    public start(): NoxApp {
        this.app?.onReady();
        return this;
    }
}
