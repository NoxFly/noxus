/* eslint-disable @typescript-eslint/no-unsafe-function-type */

import { Lifetime } from "src/app-injector";
import { InjectorExplorer } from "src/injector-explorer";
import { CONTROLLER_METADATA_KEY, INJECTABLE_METADATA_KEY, MODULE_METADATA_KEY, IModuleMetadata, Type } from "src/metadata";

export interface IApp {
    dispose(): Promise<void>;
    onReady(): Promise<void>;
}

export function Injectable(lifetime: Lifetime = 'scope'): ClassDecorator {
    return (target) => {
        if(typeof target !== 'function' || !target.prototype) {
            throw new Error(`@Injectable can only be used on classes, not on ${typeof target}`);
        }

        Reflect.defineMetadata(INJECTABLE_METADATA_KEY, lifetime, target);
        InjectorExplorer.register(target as unknown as Type<any>, lifetime);
    };
}

// ---


export function Module(metadata: IModuleMetadata): ClassDecorator {
    return (target: Function) => {
        // Validate imports and exports: must be decorated with @Module
        const checkModule = (arr?: Type<unknown>[], arrName?: string): void => {
            if(!arr)
                return;
            
            for(const clazz of arr) {
                if(!Reflect.getMetadata(MODULE_METADATA_KEY, clazz)) {
                    throw new Error(`Class ${clazz.name} in ${arrName} must be decorated with @Module`);
                }
            }
        };

        // Validate providers: must be decorated with @Injectable
        const checkInjectable = (arr?: Type<unknown>[]): void => {
            if(!arr)
                return;

            for(const clazz of arr) {
                if(!Reflect.getMetadata(INJECTABLE_METADATA_KEY, clazz)) {
                    throw new Error(`Class ${clazz.name} in providers must be decorated with @Injectable`);
                }
            }
        };

        // Validate controllers: must be decorated with @Controller
        const checkController = (arr?: Type<unknown>[]): void => {
            if(!arr) return;
            for(const clazz of arr) {
                if(!Reflect.getMetadata(CONTROLLER_METADATA_KEY, clazz)) {
                    throw new Error(`Class ${clazz.name} in controllers must be decorated with @Controller`);
                }
            }
        };

        checkModule(metadata.imports, 'imports');
        checkModule(metadata.exports, 'exports');
        checkInjectable(metadata.providers);
        checkController(metadata.controllers);

        Reflect.defineMetadata(MODULE_METADATA_KEY, metadata, target);

        Injectable('singleton')(target);
    };
}

