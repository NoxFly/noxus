/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 */

import { getGuardForController, IGuard } from "src/decorators/guards.decorator";
import { Injectable } from "src/decorators/injectable.decorator";
import { Type } from "src/utils/types";

/**
 * The configuration that waits a controller's decorator.
 */
export interface IControllerMetadata {
    path: string;
    guards: Type<IGuard>[];
}

/**
 * Controller decorator is used to define a controller in the application.
 * It is a kind of node in the routing tree, that can contains routes and middlewares.
 *
 * @param path - The path for the controller.
 */
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

/**
 * Gets the controller metadata for a given target class.
 * This metadata includes the path and guards defined by the @Controller decorator.
 * @param target - The target class to get the controller metadata from.
 * @returns The controller metadata if it exists, otherwise undefined.
 */
export function getControllerMetadata(target: Type<unknown>): IControllerMetadata | undefined {
    return Reflect.getMetadata(CONTROLLER_METADATA_KEY, target);
}

export const CONTROLLER_METADATA_KEY = Symbol('CONTROLLER_METADATA_KEY');
