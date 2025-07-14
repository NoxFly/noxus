/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 */

/* eslint-disable @typescript-eslint/no-unsafe-function-type */

import { CONTROLLER_METADATA_KEY } from "src/decorators/controller.decorator";
import { Injectable, INJECTABLE_METADATA_KEY } from "src/decorators/injectable.decorator";
import { Type } from "src/utils/types";

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

export const MODULE_METADATA_KEY = Symbol('MODULE_METADATA_KEY');

export interface IModuleMetadata {
    imports?: Type<unknown>[];
    exports?: Type<unknown>[];
    providers?: Type<unknown>[];
    controllers?: Type<unknown>[];
}

export function getModuleMetadata(target: Function): IModuleMetadata | undefined {
    return Reflect.getMetadata(MODULE_METADATA_KEY, target);
}