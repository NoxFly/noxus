import { ipcMain } from "electron";
import { app, BrowserWindow, MessageChannelMain } from "electron/main";
import { IApp } from "src/app";
import { getInjectableMetadata } from "src/decorators/injectable.decorator";
import { getModuleMetadata } from "src/decorators/module.decorator";
import { RootInjector } from "src/DI/app-injector";
import { IRequest, IResponse, Request } from "src/request";
import { Router } from "src/router";
import { Type } from "src/utils/types";

/**
 * 
 */
export async function bootstrapApplication(root: Type<IApp>, rootModule: Type<any>): Promise<IApp> {
    if(!getModuleMetadata(rootModule)) {
        throw new Error(`Root module must be decorated with @Module`);
    }

    if(!getInjectableMetadata(root)) {
        throw new Error(`Root application must be decorated with @Injectable`);
    }

    await app.whenReady();

    RootInjector.resolve(Router);

    const noxEngine = new Nox(root, rootModule);

    const application = await noxEngine.init();

    return application;
}


class Nox {
    private messagePort: Electron.MessageChannelMain | undefined;

    constructor(
        public readonly root: Type<IApp>,
        public readonly rootModule: Type<any>
    ) {}

    /**
     * 
     */
    public async init(): Promise<IApp> {
        const application = RootInjector.resolve(this.root);

        ipcMain.on('gimme-my-port', this.giveTheClientAPort.bind(this, application));

        app.once('activate', this.onAppActivated.bind(this, application));
        app.once('window-all-closed', this.onAllWindowsClosed.bind(this, application));

        await application.onReady();

        console.log(''); // create a new line in the console to separate setup logs from the future logs

        return application;
    }

    /**
     * 
     */
    private giveTheClientAPort(application: IApp, event: Electron.IpcMainInvokeEvent): void {
        if(this.messagePort) {
            this.messagePort.port1.close();
            this.messagePort.port2.close();
            this.messagePort = undefined;
        }

        this.messagePort = new MessageChannelMain();

        this.messagePort.port1.on('message', event => this.onClientMessage(application, event));
        this.messagePort.port1.start();

        event.sender.postMessage('port', null, [this.messagePort.port2]);
    }

    /**
     * Electron specific message handling.
     * Replaces HTTP calls by using Electron's IPC mechanism.
     */
    private async onClientMessage(application: IApp, event: Electron.MessageEvent): Promise<void> {
        const { requestId, path, method, body }: IRequest = event.data;

        try {
            
            const request = new Request(application, event, requestId, method, path, body);
            const router = RootInjector.resolve(Router);

            const response = await router.handle(request);

            this.messagePort?.port1.postMessage(response);
        }
        catch(err: any) {
            const response: IResponse = {
                requestId,
                status: 500,
                body: null,
                error: err.message || 'Internal Server Error',
            };

            this.messagePort?.port1.postMessage(response);
        }
    }

    /**
     * 
     */
    private onAppActivated(application: IApp): void {
        if(BrowserWindow.getAllWindows().length === 0) {
            application.onReady();
        }
    }

    /**
     * 
     */
    private async onAllWindowsClosed(application: IApp): Promise<void> {
        this.messagePort?.port1.close();
        await application.dispose();

        if(process.platform !== 'darwin') {
            app.quit();
        }
    }
}

