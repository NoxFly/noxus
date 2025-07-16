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
import { Router } from "src/router";
import { Logger } from "src/utils/logger";
import { Type } from "src/utils/types";

export interface IApp {
    dispose(): Promise<void>;
    onReady(): Promise<void>;
    onActivated(): Promise<void>;
}

@Injectable('singleton')
export class NoxApp {
    private readonly messagePorts = new Map<number, Electron.MessageChannelMain>();
    private app: IApp | undefined;

    constructor(
        private readonly router: Router,
    ) {}

    /**
     *
     */
    public async init(): Promise<NoxApp> {
        ipcMain.on('gimme-my-port', this.giveTheRendererAPort.bind(this));

        app.once('activate', this.onAppActivated.bind(this));
        app.once('window-all-closed', this.onAllWindowsClosed.bind(this));

        console.log(''); // create a new line in the console to separate setup logs from the future logs

        return this;
    }

    /**
     *
     */
    private giveTheRendererAPort(event: Electron.IpcMainInvokeEvent): void {
        const senderId = event.sender.id;

        if(this.messagePorts.has(senderId)) {
            this.shutdownChannel(senderId);
        }

        const channel = new MessageChannelMain();
        this.messagePorts.set(senderId, channel);

        channel.port1.on('message', this.onRendererMessage.bind(this));
        channel.port1.start();

        event.sender.postMessage('port', { senderId }, [channel.port2]);
    }

    /**
     * Electron specific message handling.
     * Replaces HTTP calls by using Electron's IPC mechanism.
     */
    private async onRendererMessage(event: Electron.MessageEvent): Promise<void> {
        const { senderId, requestId, path, method, body }: IRequest = event.data;

        const channel = this.messagePorts.get(senderId);

        if(!channel) {
            Logger.error(`No message channel found for sender ID: ${senderId}`);
            return;
        }

        try {
            const request = new Request(event, requestId, method, path, body);
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
    }

    /**
     * MacOS specific behavior.
     */
    private onAppActivated(): void {
        if(process.platform === 'darwin' && BrowserWindow.getAllWindows().length === 0) {
            this.app?.onActivated();
        }
    }

    private shutdownChannel(channelSenderId: number, remove: boolean = true): void {
        const channel = this.messagePorts.get(channelSenderId);

        if(!channel) {
            Logger.warn(`No message channel found for sender ID: ${channelSenderId}`);
            return;
        }

        channel.port1.off('message', this.onRendererMessage.bind(this));
        channel.port1.close();
        channel.port2.close();

        this.messagePorts.delete(channelSenderId);
    }

    /**
     *
     */
    private async onAllWindowsClosed(): Promise<void> {
        this.messagePorts.forEach((channel, senderId) => {
            this.shutdownChannel(senderId, false);
        });

        this.messagePorts.clear();

        this.app?.dispose();

        if(process.platform !== 'darwin') {
            app.quit();
        }
    }


    // ---


    public configure(app: Type<IApp>): NoxApp {
        this.app = inject(app);
        return this;
    }

    public use(middleware: Type<IMiddleware>): NoxApp {
        this.router.defineRootMiddleware(middleware);
        return this;
    }

    /**
     * Should be called after the bootstrapApplication function is called.
     */
    public start(): NoxApp {
        this.app?.onReady();
        return this;
    }
}
