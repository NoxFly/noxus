/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 */

import 'reflect-metadata';
import { HttpMethod } from 'src/decorators/method.decorator';
import { AppInjector, RootInjector } from 'src/DI/app-injector';

/**
 * The Request class represents an HTTP request in the Noxus framework.
 * It encapsulates the request data, including the event, ID, method, path, and body.
 * It also provides a context for dependency injection through the AppInjector.
 */
export class Request {
    public readonly context: AppInjector = RootInjector.createScope();

    public readonly params: Record<string, string> = {};

    constructor(
        public readonly event: Electron.MessageEvent,
        public readonly id: string,
        public readonly method: HttpMethod,
        public readonly path: string,
        public readonly body: any,
    ) {
        this.path = path.replace(/^\/|\/$/g, '');
    }
}

/**
 * The IRequest interface defines the structure of a request object.
 * It includes properties for the sender ID, request ID, path, method, and an optional body.
 * This interface is used to standardize the request data across the application.
 */
export interface IRequest<T = any> {
    senderId: number;
    requestId: string;
    path: string;
    method: HttpMethod;
    body?: T;
}

/**
 * Creates a Request object from the IPC event data.
 * This function extracts the necessary information from the IPC event and constructs a Request instance.
 */
export interface IResponse<T = any> {
    requestId: string;
    status: number;
    body?: T;
    error?: string;
}
