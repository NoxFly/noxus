import { getGuardForController, IGuard } from "src/decorators/guards.decorator";
import { Injectable } from "src/decorators/injectable.decorator";
import { Type } from "src/utils/types";

export interface IControllerMetadata {
    path: string;
    guards: Type<IGuard>[];
}

export function Controller(path: string): ClassDecorator {
    return (target) => {
        const data: IControllerMetadata = {
            path,
            guards: getGuardForController(target.name)
        };

        Reflect.defineMetadata(CONTROLLER_METADATA_KEY, data, target);
        Injectable('scope')(target);
    };
}

export const CONTROLLER_METADATA_KEY = Symbol('CONTROLLER_METADATA_KEY');

export function getControllerMetadata(target: Type<unknown>): IControllerMetadata | undefined {
    return Reflect.getMetadata(CONTROLLER_METADATA_KEY, target);
}