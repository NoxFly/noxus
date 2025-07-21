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

/**
 * IRouteDefinition interface defines the structure of a route in the application.
 * It includes the HTTP method, path, controller class, handler method name,
 * guards, and middlewares associated with the route.
 */
export interface IRouteDefinition {
    method: string;
    path: string;
    controller: Type<any>;
    handler: string;
    guards: Type<IGuard>[];
    middlewares: Type<IMiddleware>[];
}

/**
 * This type defines a function that represents an action in a controller.
 * It takes a Request and an IResponse as parameters and returns a value or a Promise.
 */
export type ControllerAction = (request: Request, response: IResponse) => any;


/**
 * Router class is responsible for managing the application's routing.
 * It registers controllers, handles requests, and manages middlewares and guards.
 */
@Injectable('singleton')
export class Router {
    private readonly routes = new RadixTree<IRouteDefinition>();
    private readonly rootMiddlewares: Type<IMiddleware>[] = [];

    /**
     * Registers a controller class with the router.
     * This method extracts the route metadata from the controller class and registers it in the routing tree.
     * It also handles the guards and middlewares associated with the controller.
     * @param controllerClass - The controller class to register.
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
     * Defines a middleware for the root of the application.
     * This method allows you to register a middleware that will be applied to all requests
     * to the application, regardless of the controller or action.
     * @param middleware - The middleware class to register.
     */
    public defineRootMiddleware(middleware: Type<IMiddleware>): Router {
        Logger.debug(`Registering root middleware: ${middleware.name}`);
        this.rootMiddlewares.push(middleware);
        return this;
    }

    /**
     * Shuts down the message channel for a specific sender ID.
     * This method closes the IPC channel for the specified sender ID and
     * removes it from the messagePorts map.
     * @param channelSenderId - The ID of the sender channel to shut down.
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
     * Finds the route definition for a given request.
     * This method searches the routing tree for a matching route based on the request's path and method.
     * If no matching route is found, it throws a NotFoundException.
     * @param request - The Request object containing the method and path to search for.
     * @returns The IRouteDefinition for the matched route.
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
     * Resolves the controller for a given route definition.
     * This method creates an instance of the controller class and prepares the request parameters.
     * It also runs the request pipeline, which includes executing middlewares and guards.
     * @param request - The Request object containing the request data.
     * @param response - The IResponse object to populate with the response data.
     * @param routeDef - The IRouteDefinition for the matched route.
     * @return A Promise that resolves when the controller action has been executed.
     * @throws UnauthorizedException if the request is not authorized by the guards.
     */
    private async resolveController(request: Request, response: IResponse, routeDef: IRouteDefinition): Promise<void> {
        const controllerInstance = request.context.resolve(routeDef.controller);

        Object.assign(request.params, this.extractParams(request.path, routeDef.path));

        await this.runRequestPipeline(request, response, routeDef, controllerInstance);
    }

    /**
     * Runs the request pipeline for a given request.
     * This method executes the middlewares and guards associated with the route,
     * and finally calls the controller action.
     * @param request - The Request object containing the request data.
     * @param response - The IResponse object to populate with the response data.
     * @param routeDef - The IRouteDefinition for the matched route.
     * @param controllerInstance - The instance of the controller class.
     * @return A Promise that resolves when the request pipeline has been executed.
     * @throws ResponseException if the response status is not successful.
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
     * Runs a middleware function in the request pipeline.
     * This method creates an instance of the middleware and invokes its `invoke` method,
     * passing the request, response, and next function.
     * @param request - The Request object containing the request data.
     * @param response - The IResponse object to populate with the response data.
     * @param next - The NextFunction to call to continue the middleware chain.
     * @param middlewareType - The type of the middleware to run.
     * @return A Promise that resolves when the middleware has been executed.
     */
    private async runMiddleware(request: Request, response: IResponse, next: NextFunction, middlewareType: Type<IMiddleware>): Promise<void> {
        const middleware = request.context.resolve(middlewareType);
        await middleware.invoke(request, response, next);
    }

    /**
     * Runs a guard to check if the request is authorized.
     * This method creates an instance of the guard and calls its `canActivate` method.
     * If the guard returns false, it throws an UnauthorizedException.
     * @param request - The Request object containing the request data.
     * @param guardType - The type of the guard to run.
     * @return A Promise that resolves if the guard allows the request, or throws an UnauthorizedException if not.
     * @throws UnauthorizedException if the guard denies access to the request.
     */
    private async runGuard(request: Request, guardType: Type<IGuard>): Promise<void> {
        const guard = request.context.resolve(guardType);
        const allowed = await guard.canActivate(request);

        if(!allowed)
            throw new UnauthorizedException(`Unauthorized for ${request.method} ${request.path}`);
    }

    /**
     * Extracts parameters from the actual request path based on the template path.
     * This method splits the actual path and the template path into segments,
     * then maps the segments to parameters based on the template.
     * @param actual - The actual request path.
     * @param template - The template path to extract parameters from.
     * @returns An object containing the extracted parameters.
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
