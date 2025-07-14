import 'reflect-metadata';
import { Injectable } from 'src/app';
import { MethodNotAllowedException, NotFoundException, ResponseException, UnauthorizedException } from 'src/exceptions';
import { getGuardForController, getGuardForControllerAction, IGuard } from 'src/guards';
import { Logger } from 'src/logger';
import { CONTROLLER_METADATA_KEY, IControllerMetadata, getControllerMetadata, getRouteMetadata, ROUTE_METADATA_KEY, IRouteMetadata, Type } from 'src/metadata';
import { RadixTree } from 'src/radix-tree';
import { Request, IResponse } from 'src/request';

// types & interfaces

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface IRouteDefinition {
    method: string;
    path: string;
    controller: Type<any>;
    handler: string;
    guards: Type<IGuard>[];
}

export type ControllerAction = (request: Request, response: IResponse) => any;

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

function createRouteDecorator(verb: HttpMethod): (path: string) => MethodDecorator {
    return (path: string): MethodDecorator => {
        return (target, propertyKey) => {
            const existingRoutes: IRouteMetadata[] = Reflect.getMetadata(ROUTE_METADATA_KEY, target.constructor) || [];

            const metadata: IRouteMetadata = {
                method: verb,
                path: path.trim().replace(/^\/|\/$/g, ''),
                handler: propertyKey as string,
                guards: getGuardForControllerAction((target.constructor as any).__controllerName, propertyKey as string),
            };

            existingRoutes.push(metadata);

            Reflect.defineMetadata(ROUTE_METADATA_KEY, existingRoutes, target.constructor);
        };
    };
}

export const Get = createRouteDecorator('GET');
export const Post = createRouteDecorator('POST');
export const Put = createRouteDecorator('PUT');
export const Patch = createRouteDecorator('PATCH');
export const Delete = createRouteDecorator('DELETE');

@Injectable('singleton')
export class Router {
    private readonly routes = new RadixTree<IRouteDefinition>();

    public registerController(controllerClass: Type<unknown>): Router {
        const controllerMeta = getControllerMetadata(controllerClass);

        const controllerGuards = getGuardForController(controllerClass.name);
        
        if(!controllerMeta)
            throw new Error(`Missing @Controller decorator on ${controllerClass.name}`);

        const routeMetadata = getRouteMetadata(controllerClass);

        for(const def of routeMetadata) {
            const fullPath = `${controllerMeta.path}/${def.path}`.replace(/\/+/g, '/');

            const routeGuards = getGuardForControllerAction(controllerClass.name, def.handler);

            const guards = new Set([...controllerGuards, ...routeGuards]);

            const routeDef: IRouteDefinition = {
                method: def.method,
                path: fullPath,
                controller: controllerClass,
                handler: def.handler,
                guards: [...guards],
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
            const controllerInstance = await this.resolveController(request, routeDef);

            const action = controllerInstance[routeDef.handler] as ControllerAction;

            this.verifyRequestBody(request, action);

            response.body = await action.call(controllerInstance, request, response);
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

    private async resolveController(request: Request, routeDef: IRouteDefinition): Promise<any> {
        const controllerInstance = request.context.resolve(routeDef.controller);

        Object.assign(request.params, this.extractParams(request.path, routeDef.path));

        if(routeDef.guards.length > 0) {
            for(const guardType of routeDef.guards) {
                const guard = request.context.resolve(guardType);
                const allowed = await guard.canActivate(request);

                if(!allowed)
                    throw new UnauthorizedException(`Unauthorized for ${request.method} ${request.path}`);
            }
        }

        return controllerInstance;
    }

    private verifyRequestBody(request: Request, action: ControllerAction): void {
        const requiredParams = Reflect.getMetadata('design:paramtypes', action) || [];
        // peut être à faire plus tard. problème du TS, c'est qu'en JS pas de typage.
        // donc il faudrait passer par des décorateurs mais pas sûr que ce soit bien.
    }

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
