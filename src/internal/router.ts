/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 */

import { getControllerMetadata } from '../decorators/controller.decorator';
import { Guard } from '../decorators/guards.decorator';
import { Injectable } from '../decorators/injectable.decorator';
import { getRouteMetadata, isAtomicHttpMethod } from '../decorators/method.decorator';
import { Middleware, NextFunction } from '../decorators/middleware.decorator';
import { InjectorExplorer } from '../DI/injector-explorer';
import { Logger } from '../utils/logger';
import { RadixTree } from '../utils/radix-tree';
import { Type } from '../utils/types';
import {
    BadRequestException,
    NotFoundException,
    ResponseException,
    UnauthorizedException
} from './exceptions';
import { IBatchRequestItem, IBatchRequestPayload, IBatchResponsePayload, IResponse, Request } from './request';

export interface ILazyRoute {
    load: () => Promise<unknown>;
    guards: Guard[];
    middlewares: Middleware[];
    loading: Promise<void> | null;
    loaded: boolean;
}

interface LazyRouteEntry {
    load: (() => Promise<unknown>) | null;
    guards: Guard[];
    middlewares: Middleware[];
    loading: Promise<void> | null;
    loaded: boolean;
}

export interface IRouteDefinition {
    method: string;
    path: string;
    controller: Type<unknown>;
    handler: string;
    guards: Guard[];
    middlewares: Middleware[];
}

export type ControllerAction = (request: Request, response: IResponse) => unknown;

@Injectable({ lifetime: 'singleton' })
export class Router {
    private readonly routes = new RadixTree<IRouteDefinition>();
    private readonly rootMiddlewares: Middleware[] = [];
    private readonly lazyRoutes = new Map<string, LazyRouteEntry>();

    // -------------------------------------------------------------------------
    // Registration
    // -------------------------------------------------------------------------

    public registerController(
        controllerClass: Type<unknown>,
        pathPrefix: string,
        routeGuards: Guard[] = [],
        routeMiddlewares: Middleware[] = [],
    ): this {
        const meta = getControllerMetadata(controllerClass);

        if (!meta) {
            throw new Error(`[Noxus] Missing @Controller decorator on ${controllerClass.name}`);
        }

        const routeMeta = getRouteMetadata(controllerClass);

        for (const def of routeMeta) {
            const fullPath = `${pathPrefix}/${def.path}`.replace(/\/+/g, '/').replace(/\/$/, '') || '/';

            // Route-level guards/middlewares from defineRoutes() + action-level ones
            const guards      = [...new Set([...routeGuards,      ...def.guards])];
            const middlewares = [...new Set([...routeMiddlewares,  ...def.middlewares])];

            const routeDef: IRouteDefinition = {
                method: def.method,
                path: fullPath,
                controller: controllerClass,
                handler: def.handler,
                guards,
                middlewares,
            };

            this.routes.insert(fullPath + '/' + def.method, routeDef);

            const guardInfo = guards.length ? `<${guards.map(g => g.name).join('|')}>` : '';
            Logger.log(`Mapped {${def.method} /${fullPath}}${guardInfo} route`);
        }

        const ctrlGuardInfo = routeGuards.length
            ? `<${routeGuards.map(g => g.name).join('|')}>`
            : '';
        Logger.log(`Mapped ${controllerClass.name}${ctrlGuardInfo} controller's routes`);

        return this;
    }

    public registerLazyRoute(
        pathPrefix: string,
        load: () => Promise<unknown>,
        guards: Guard[] = [],
        middlewares: Middleware[] = [],
    ): this {
        const normalized = pathPrefix.replace(/^\/+|\/+$/g, '');
        this.lazyRoutes.set(normalized, { load, guards, middlewares, loading: null, loaded: false });
        Logger.log(`Registered lazy route prefix {${normalized}}`);
        return this;
    }

    public defineRootMiddleware(middleware: Middleware): this {
        this.rootMiddlewares.push(middleware);
        return this;
    }

    // -------------------------------------------------------------------------
    // Request handling
    // -------------------------------------------------------------------------

    public async handle(request: Request): Promise<IResponse> {
        return request.method === 'BATCH'
            ? this.handleBatch(request)
            : this.handleAtomic(request);
    }

    private async handleAtomic(request: Request): Promise<IResponse> {
        Logger.comment(`>     ${request.method} /${request.path}`);
        const t0 = performance.now();

        const response: IResponse = { requestId: request.id, status: 200, body: null };
        let isCritical = false;

        try {
            const routeDef = await this.findRoute(request);
            await this.resolveController(request, response, routeDef);

            if (response.status >= 400) throw new ResponseException(response.status, response.error);
        }
        catch (error) {
            this.fillErrorResponse(response, error, (c) => { isCritical = c; });
        }
        finally {
            this.logResponse(request, response, performance.now() - t0, isCritical);
            return response;
        }
    }

    private async handleBatch(request: Request): Promise<IResponse> {
        Logger.comment(`>     ${request.method} /${request.path}`);
        const t0 = performance.now();

        const response: IResponse<IBatchResponsePayload> = {
            requestId: request.id,
            status: 200,
            body: { responses: [] },
        };
        let isCritical = false;

        try {
            const payload = this.normalizeBatchPayload(request.body);
            response.body!.responses = await Promise.all(
                payload.requests.map((item, i) => {
                    const id = item.requestId ?? `${request.id}:${i}`;
                    return this.handleAtomic(new Request(request.event, request.senderId, id, item.method, item.path, item.body));
                }),
            );
        }
        catch (error) {
            this.fillErrorResponse(response, error, (c) => { isCritical = c; });
        }
        finally {
            this.logResponse(request, response, performance.now() - t0, isCritical);
            return response;
        }
    }

    // -------------------------------------------------------------------------
    // Route resolution
    // -------------------------------------------------------------------------

    private tryFindRoute(request: Request): IRouteDefinition | undefined {
        const matched = this.routes.search(request.path);
        if (!matched?.node || matched.node.children.length === 0) return undefined;
        return matched.node.findExactChild(request.method)?.value;
    }

    private async findRoute(request: Request): Promise<IRouteDefinition> {
        const direct = this.tryFindRoute(request);
        if (direct) return direct;

        await this.tryLoadLazyRoute(request.path);

        const afterLazy = this.tryFindRoute(request);
        if (afterLazy) return afterLazy;

        throw new NotFoundException(`No route matches ${request.method} ${request.path}`);
    }

    private async tryLoadLazyRoute(requestPath: string): Promise<void> {
        const firstSegment = requestPath.replace(/^\/+/, '').split('/')[0] ?? '';

        for (const [prefix, entry] of this.lazyRoutes) {
            if (entry.loaded) continue;
            const normalized = requestPath.replace(/^\/+/, '');
            if (normalized === prefix || normalized.startsWith(prefix + '/') || firstSegment === prefix) {
                if (!entry.loading) entry.loading = this.loadLazyModule(prefix, entry);
                await entry.loading;
                return;
            }
        }
    }

    private async loadLazyModule(prefix: string, entry: LazyRouteEntry): Promise<void> {
        const t0 = performance.now();
        InjectorExplorer.beginAccumulate();

        await entry.load?.();

        entry.loading = null;
        entry.load = null;

        InjectorExplorer.flushAccumulated(entry.guards, entry.middlewares, prefix);

        entry.loaded = true;

        Logger.info(`Lazy-loaded module for prefix {${prefix}} in ${Math.round(performance.now() - t0)}ms`);
    }

    // -------------------------------------------------------------------------
    // Pipeline
    // -------------------------------------------------------------------------

    private async resolveController(request: Request, response: IResponse, routeDef: IRouteDefinition): Promise<void> {
        const instance = request.context.resolve(routeDef.controller);
        Object.assign(request.params, this.extractParams(request.path, routeDef.path));
        await this.runPipeline(request, response, routeDef, instance);
    }

    private async runPipeline(
        request: Request,
        response: IResponse,
        routeDef: IRouteDefinition,
        controllerInstance: unknown,
    ): Promise<void> {
        const middlewares = [...new Set([...this.rootMiddlewares, ...routeDef.middlewares])];
        const mwMax = middlewares.length - 1;
        const guardMax = mwMax + routeDef.guards.length;
        let index = -1;

        const dispatch = async (i: number): Promise<void> => {
            if (i <= index) throw new Error('next() called multiple times');
            index = i;

            if (i <= mwMax) {
                await this.runMiddleware(request, response, dispatch.bind(null, i + 1), middlewares[i]!);
                if (response.status >= 400) throw new ResponseException(response.status, response.error);
                return;
            }

            if (i <= guardMax) {
                await this.runGuard(request, routeDef.guards[i - middlewares.length]!);
                await dispatch(i + 1);
                return;
            }

            const action = (controllerInstance as Record<string, ControllerAction>)[routeDef.handler]!;
            response.body = await action.call(controllerInstance, request, response);
            if (response.body === undefined) response.body = {};
        };

        await dispatch(0);
    }

    private async runMiddleware(request: Request, response: IResponse, next: NextFunction, middleware: Middleware): Promise<void> {
        await middleware(request, response, next);
    }

    private async runGuard(request: Request, guard: Guard): Promise<void> {
        if (!await guard(request)) {
            throw new UnauthorizedException(`Unauthorized for ${request.method} ${request.path}`);
        }
    }

    // -------------------------------------------------------------------------
    // Utilities
    // -------------------------------------------------------------------------

    private extractParams(actual: string, template: string): Record<string, string> {
        const aParts = actual.split('/');
        const tParts = template.split('/');
        const params: Record<string, string> = {};
        tParts.forEach((part, i) => {
            if (part.startsWith(':')) params[part.slice(1)] = aParts[i] ?? '';
        });
        return params;
    }

    private normalizeBatchPayload(body: unknown): IBatchRequestPayload {
        if (body === null || typeof body !== 'object') {
            throw new BadRequestException('Batch payload must be an object containing a requests array.');
        }
        const { requests } = body as Partial<IBatchRequestPayload>;
        if (!Array.isArray(requests)) throw new BadRequestException('Batch payload must define a requests array.');
        return { requests: requests.map((e, i) => this.normalizeBatchItem(e, i)) };
    }

    private normalizeBatchItem(entry: unknown, index: number): IBatchRequestItem {
        if (entry === null || typeof entry !== 'object') throw new BadRequestException(`Batch request at index ${index} must be an object.`);
        const { requestId, path, method, body } = entry as Partial<IBatchRequestItem> & { method?: unknown };
        if (requestId !== undefined && typeof requestId !== 'string') throw new BadRequestException(`Batch request at index ${index} has an invalid requestId.`);
        if (typeof path !== 'string' || !path.length) throw new BadRequestException(`Batch request at index ${index} must define a non-empty path.`);
        if (typeof method !== 'string') throw new BadRequestException(`Batch request at index ${index} must define an HTTP method.`);
        const normalized = method.toUpperCase();
        if (!isAtomicHttpMethod(normalized)) throw new BadRequestException(`Batch request at index ${index} uses unsupported method ${method}.`);
        return { requestId, path, method: normalized, body };
    }

    private fillErrorResponse(response: IResponse, error: unknown, setCritical: (v: boolean) => void): void {
        response.body = undefined;
        if (error instanceof ResponseException) {
            response.status = error.status;
            response.error = error.message;
            response.stack = error.stack;
        } else if (error instanceof Error) {
            setCritical(true);
            response.status = 500;
            response.error = error.message || 'Internal Server Error';
            response.stack = error.stack;
        } else {
            setCritical(true);
            response.status = 500;
            response.error = 'Unknown error occurred';
        }
    }

    private logResponse(request: Request, response: IResponse, ms: number, isCritical: boolean): void {
        const msg = `< ${response.status} ${request.method} /${request.path} ${Logger.colors.yellow}${Math.round(ms)}ms${Logger.colors.initial}`;
        if (response.status < 400) Logger.log(msg);
        else if (response.status < 500) Logger.warn(msg);
        else isCritical ? Logger.critical(msg) : Logger.error(msg);

        if (response.error) {
            isCritical ? Logger.critical(response.error) : Logger.error(response.error);
            if (response.stack) Logger.errorStack(response.stack);
        }
    }
}
