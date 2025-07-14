import { Lifetime, RootInjector } from "src/app-injector";
import { Logger } from "src/logger";
import { Type, getModuleMetadata, getControllerMetadata, getRouteMetadata, getInjectableMetadata } from "src/metadata";
import { Router } from "src/router";

export class InjectorExplorer {
    /**
     * Enregistre la classe comme étant injectable.
     * Lorsqu'une classe sera instanciée, si elle a des dépendances, et que celles-ci
     * figurent dans la liste grâce à cette méthode, elles seront injectées dans le
     * constructeur de la classe.
     */
    public static register(target: Type<unknown>, lifetime: Lifetime): typeof RootInjector {
        Logger.debug(`Registering ${target.name} as ${lifetime}`);
        if(RootInjector.bindings.has(target)) // already registered
            return RootInjector;

        RootInjector.bindings.set(target, {
            implementation: target,
            lifetime
        });

        if(lifetime === 'singleton') {
            RootInjector.resolve(target);
        }

        if(getModuleMetadata(target)) {
            Logger.log(`${target.name} dependencies initialized`);
            return RootInjector;
        }

        const controllerMeta = getControllerMetadata(target);
        
        if(controllerMeta) {
            const router = RootInjector.resolve(Router);
            router?.registerController(target);
            return RootInjector;
        }

        const routeMeta = getRouteMetadata(target);
        
        if(routeMeta) {
            return RootInjector;
        }

        if(getInjectableMetadata(target)) {
            Logger.log(`Registered ${target.name} as ${lifetime}`);
            return RootInjector;
        }

        return RootInjector;
    }
}