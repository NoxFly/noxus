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
 * 
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

