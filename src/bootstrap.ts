/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 */

import { app } from "electron/main";
import { NoxApp } from "src/app";
import { getModuleMetadata } from "src/decorators/module.decorator";
import { inject } from "src/DI/app-injector";
import { Type } from "src/utils/types";

/**
 * Bootstraps the Noxus application.
 * This function initializes the application by creating an instance of NoxApp,
 * registering the root module, and starting the application.
 * @param rootModule - The root module of the application, decorated with @Module.
 * @return A promise that resolves to the NoxApp instance.
 * @throws Error if the root module is not decorated with @Module, or if the electron process could not start.
 */
export async function bootstrapApplication(rootModule: Type<any>): Promise<NoxApp> {
    if(!getModuleMetadata(rootModule)) {
        throw new Error(`Root module must be decorated with @Module`);
    }

    await app.whenReady();

    const noxApp = inject(NoxApp);

    await noxApp.init();

    return noxApp;
}

