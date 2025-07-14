/* eslint-disable @typescript-eslint/no-unsafe-function-type */

import { Lifetime } from "src/app-injector";
import { IGuard } from "src/guards";
import { HttpMethod } from "src/router";

declare const Type: FunctionConstructor;
export interface Type<T> extends Function {
    // eslint-disable-next-line @typescript-eslint/prefer-function-type
    new (...args: any[]): T;
}

export const MODULE_METADATA_KEY = Symbol('MODULE_METADATA_KEY');
export const INJECTABLE_METADATA_KEY = Symbol('INJECTABLE_METADATA_KEY');
export const CONTROLLER_METADATA_KEY = Symbol('CONTROLLER_METADATA_KEY');
export const ROUTE_METADATA_KEY = Symbol('ROUTE_METADATA_KEY');

export interface IModuleMetadata {
    imports?: Type<unknown>[];
    providers?: Type<unknown>[];
    controllers?: Type<unknown>[];
    exports?: Type<unknown>[];
}

export interface IRouteMetadata {
    method: HttpMethod;
    path: string;
    handler: string;
    guards: Type<IGuard>[];
}

export interface IControllerMetadata {
    path: string;
    guards: Type<IGuard>[];
}


export function getControllerMetadata(target: Type<unknown>): IControllerMetadata | undefined {
    return Reflect.getMetadata(CONTROLLER_METADATA_KEY, target);
}

export function getRouteMetadata(target: Type<unknown>): IRouteMetadata[] {
    return Reflect.getMetadata(ROUTE_METADATA_KEY, target) || [];
}

export function getModuleMetadata(target: Function): IModuleMetadata | undefined {
    return Reflect.getMetadata(MODULE_METADATA_KEY, target);
}

export function getInjectableMetadata(target: Type<unknown>): Lifetime | undefined {
    return Reflect.getMetadata(INJECTABLE_METADATA_KEY, target);
}