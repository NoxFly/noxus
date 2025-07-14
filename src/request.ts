import { IApp } from 'src/app';
import { RootInjector } from 'src/app-injector';
import { HttpMethod } from 'src/router';
import 'reflect-metadata';


//

export class Request {
    public readonly context: any = RootInjector.createScope();

    public readonly params: Record<string, string> = {};

    constructor(
        public readonly app: IApp,
        public readonly event: Electron.MessageEvent,
        public readonly id: string,
        public readonly method: HttpMethod,
        public readonly path: string,
        public readonly body: any,
    ) {
        this.path = path.replace(/^\/|\/$/g, '');
    }
}

export interface IRequest<T = any> {
    requestId: string;
    path: string;
    method: HttpMethod;
    body?: T;
}

export interface IResponse<T = any> {
    requestId: string;
    status: number;
    body?: T;
    error?: string;
}
