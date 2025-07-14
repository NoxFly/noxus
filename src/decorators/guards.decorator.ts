import { Request } from 'src/request';
import { Logger } from 'src/utils/logger';
import { MaybeAsync, Type } from 'src/utils/types';

export interface IGuard {
    canActivate(request: Request): MaybeAsync<boolean>;
}

const authorizations = new Map<string, Type<IGuard>[]>();

/**
 * Peut être utilisé pour protéger les routes d'un contrôleur.
 * Peut être utilisé sur une classe controleur, ou sur une méthode de contrôleur.
 */
export function Authorize(...guardClasses: Type<IGuard>[]): MethodDecorator & ClassDecorator {
    return (target: any, propertyKey?: string | symbol) => {
        let key: string;

        // Method decorator
        if(propertyKey) {
            const ctrlName = target.constructor.name;
            const actionName = propertyKey as string;
            key = `${ctrlName}.${actionName}`;
        }
        // Class decorator
        else {
            const ctrlName = (target as Type<unknown>).name;
            key = `${ctrlName}`;
        }

        if(authorizations.has(key)) {
            throw new Error(`Guard(s) already registered for ${key}`);
        }

        Logger.debug(`Registering guards for ${key}: ${guardClasses.map(c => c.name).join(', ')}`);

        authorizations.set(key, guardClasses);
    };
}


export function getGuardForController(controllerName: string): Type<IGuard>[] {
    const key = `${controllerName}`;
    return authorizations.get(key) ?? [];
}

export function getGuardForControllerAction(controllerName: string, actionName: string): Type<IGuard>[] {
    const key = `${controllerName}.${actionName}`;
    return authorizations.get(key) ?? [];
}
