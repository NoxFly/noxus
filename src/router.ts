/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 */

import 'reflect-metadata';
import { getControllerMetadata } from 'src/decorators/controller.decorator';
import { getGuardForController, getGuardForControllerAction, IGuard } from 'src/decorators/guards.decorator';
import { Injectable } from 'src/decorators/injectable.decorator';
import { getRouteMetadata } from 'src/decorators/method.decorator';
import { getMiddlewaresForController, getMiddlewaresForControllerAction, IMiddleware, NextFunction } from 'src/decorators/middleware.decorator';
import { MethodNotAllowedException, NotFoundException, ResponseException, UnauthorizedException } from 'src/exceptions';
import { IResponse, Request } from 'src/request';
import { Logger } from 'src/utils/logger';
import { RadixTree } from 'src/utils/radix-tree';
import { Type } from 'src/utils/types';

// types & interfaces

export interface IRouteDefinition {
    method: string;
    path: string;
    controller: Type<any>;
    handler: string;
    guards: Type<IGuard>[];
    middlewares: Type<IMiddleware>[];
}

export type ControllerAction = (request: Request, response: IResponse) => any;


@Injectable('singleton')
export class Router {
    private readonly routes = new RadixTree<IRouteDefinition>();
    private readonly rootMiddlewares: Type<IMiddleware>[] = [];

    /**
     * 
     */
    public registerController(controllerClass: Type<unknown>): Router {
        const controllerMeta = getControllerMetadata(controllerClass);

        const controllerGuards = getGuardForController(controllerClass.name);
        const controllerMiddlewares = getMiddlewaresForController(controllerClass.name);
        
        if(!controllerMeta)
            throw new Error(`Missing @Controller decorator on ${controllerClass.name}`);

        const routeMetadata = getRouteMetadata(controllerClass);

        for(const def of routeMetadata) {
            const fullPath = `${controllerMeta.path}/${def.path}`.replace(/\/+/g, '/');

            const routeGuards = getGuardForControllerAction(controllerClass.name, def.handler);
            const routeMiddlewares = getMiddlewaresForControllerAction(controllerClass.name, def.handler);

            const guards = new Set([...controllerGuards, ...routeGuards]);
            const middlewares = new Set([...controllerMiddlewares, ...routeMiddlewares]);

            const routeDef: IRouteDefinition = {
                method: def.method,
                path: fullPath,
                controller: controllerClass,
                handler: def.handler,
                guards: [...guards],
                middlewares: [...middlewares],
            };
            
            this.routes.insert(fullPath + '/' + def.method, routeDef);

            const hasActionGuards = routeDef.guards.length > 0;

            const actionGuardsInfo = hasActionGuards
                ? '<' + routeDef.guards.map(g => g.name).join('|') + '>'
                : '';

            Logger.log(`Mapped {${routeDef.method} /${fullPath}}${actionGuardsInfo} route`);
        }

        const hasCtrlGuards = controllerMeta.guards.length > 0;
        
        const controllerGuardsInfo = hasCtrlGuards
            ? '<' + controllerMeta.guards.map(g => g.name).join('|') + '>'
            : '';

        Logger.log(`Mapped ${controllerClass.name}${controllerGuardsInfo} controller's routes`);

        return this;
    }

    /**
     * 
     */
    public defineRootMiddleware(middleware: Type<IMiddleware>): Router {
        Logger.debug(`Registering root middleware: ${middleware.name}`);
        this.rootMiddlewares.push(middleware);
        return this;
    }

    /**
     * 
     */
    public async handle(request: Request): Promise<IResponse> {
        Logger.log(`> Received request: {${request.method} /${request.path}}`);

        const t0 = performance.now();
        
        const response: IResponse = {
            requestId: request.id,
            status: 200,
            body: null,
            error: undefined,
        };

        try {
            const routeDef = this.findRoute(request);
            await this.resolveController(request, response, routeDef);

            if(response.status > 400) {
                throw new ResponseException(response.status, response.error);
            }
        }
        catch(error: unknown) {
            if(error instanceof ResponseException) {
                response.status = error.status;
                response.error = error.message;
            }
            else if(error instanceof Error) {
                response.status = 500;
                response.error = error.message || 'Internal Server Error';
            }
            else {
                response.status = 500;
                response.error = 'Unknown error occurred';
            }
        }
        finally {
            const t1 = performance.now();

            const message = `< ${response.status} ${request.method} /${request.path} ${Logger.colors.yellow}${Math.round(t1 - t0)}ms${Logger.colors.initial}`;

            if(response.status < 400)
                Logger.log(message);
            else if(response.status < 500)
                Logger.warn(message);
            else
                Logger.error(message);

            if(response.error !== undefined) {
                Logger.error(response.error);
            }

            return response;
        }
    }

    /**
     * 
     */
    private findRoute(request: Request): IRouteDefinition {
        const matchedRoutes = this.routes.search(request.path);

        if(matchedRoutes?.node === undefined || matchedRoutes.node.children.length === 0) {
            throw new NotFoundException(`No route matches ${request.method} ${request.path}`);
        }

        const routeDef = matchedRoutes.node.findExactChild(request.method);

        if(routeDef?.value === undefined) {
            throw new MethodNotAllowedException(`Method Not Allowed for ${request.method} ${request.path}`);
        }

        return routeDef.value;
    }

    /**
     * 
     */
    private async resolveController(request: Request, response: IResponse, routeDef: IRouteDefinition): Promise<void> {
        const controllerInstance = request.context.resolve(routeDef.controller);

        Object.assign(request.params, this.extractParams(request.path, routeDef.path));

        await this.runRequestPipeline(request, response, routeDef, controllerInstance);
    }

    /**
     * 
     */
    private async runRequestPipeline(request: Request, response: IResponse, routeDef: IRouteDefinition, controllerInstance: any): Promise<void> {
        const middlewares = [...new Set([...this.rootMiddlewares, ...routeDef.middlewares])];

        const middlewareMaxIndex = middlewares.length - 1;
        const guardsMaxIndex = middlewareMaxIndex + routeDef.guards.length;

        let index = -1;

        const dispatch = async (i: number): Promise<void> => {
            if(i <= index)
                throw new Error("next() called multiple times");
            
            index = i;

            // middlewares
            if(i <= middlewareMaxIndex) {
                const nextFn = dispatch.bind(null, i + 1);
                await this.runMiddleware(request, response, nextFn, middlewares[i]!);

                if(response.status >= 400) {
                    throw new ResponseException(response.status, response.error);
                }

                return;
            }
            
            // guards
            if(i <= guardsMaxIndex) {
                const guardIndex = i - middlewares.length;
                const guardType = routeDef.guards[guardIndex]!;
                await this.runGuard(request, guardType);
                dispatch(i + 1);
                return;
            }

            // endpoint action
            const action = controllerInstance[routeDef.handler] as ControllerAction;
            response.body = await action.call(controllerInstance, request, response);
        };

        await dispatch(0);
    }

    /**
     * 
     */
    private async runMiddleware(request: Request, response: IResponse, next: NextFunction, middlewareType: Type<IMiddleware>): Promise<void> {
        const middleware = request.context.resolve(middlewareType);
        await middleware.invoke(request, response, next);
    }

    /**
     * 
     */
    private async runGuard(request: Request, guardType: Type<IGuard>): Promise<void> {
        const guard = request.context.resolve(guardType);
        const allowed = await guard.canActivate(request);

        if(!allowed)
            throw new UnauthorizedException(`Unauthorized for ${request.method} ${request.path}`);
    }

    /**
     * 
     */
    private extractParams(actual: string, template: string): Record<string, string> {
        const aParts = actual.split('/');
        const tParts = template.split('/');
        const params: Record<string, string> = {};
        
        tParts.forEach((part, i) => {
            if(part.startsWith(':')) {
                params[part.slice(1)] = aParts[i] ?? '';
            }
        });
        
        return params;
    }
}
