/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 */

import { app, BrowserWindow } from "electron/main";
import { NoxApp } from "src/app";
import { getModuleMetadata } from "src/decorators/module.decorator";
import { inject } from "src/DI/app-injector";
import { InjectorExplorer } from "src/DI/injector-explorer";
import { Type } from "src/utils/types";

/**
 * Options for bootstrapping the Noxus application.
 */
export interface BootstrapOptions {
    /**
     * If provided, Noxus creates a BrowserWindow immediately after Electron is ready,
     * before any DI processing occurs. This window is passed to the configured
     * IApp service via onReady(). It allows the user to see a window as fast as possible,
     * even before the application is fully initialized.
     */
    window?: Electron.BrowserWindowConstructorOptions;
}

/**
 * Bootstraps the Noxus application.
 * This function initializes the application by creating an instance of NoxApp,
 * registering the root module, and starting the application.
 *
 * When {@link BootstrapOptions.window} is provided, a BrowserWindow is created
 * immediately after Electron readiness — before DI resolution — so the user
 * sees a window as quickly as possible.
 *
 * @param rootModule - The root module of the application, decorated with @Module.
 * @param options - Optional bootstrap configuration.
 * @return A promise that resolves to the NoxApp instance.
 * @throws Error if the root module is not decorated with @Module, or if the electron process could not start.
 */
export async function bootstrapApplication(rootModule: Type<any>, options?: BootstrapOptions): Promise<NoxApp> {
    if(!getModuleMetadata(rootModule)) {
        throw new Error(`Root module must be decorated with @Module`);
    }

    await app.whenReady();

    // Create window immediately after Electron is ready, before DI processing.
    // This gets pixels on screen as fast as possible.
    let mainWindow: BrowserWindow | undefined;

    if(options?.window) {
        mainWindow = new BrowserWindow(options.window);
    }

    // Process all deferred injectable registrations (two-phase: bindings then resolution)
    InjectorExplorer.processPending();

    const noxApp = inject(NoxApp);

    if(mainWindow) {
        noxApp.setMainWindow(mainWindow);
    }

    await noxApp.init();

    return noxApp;
}

