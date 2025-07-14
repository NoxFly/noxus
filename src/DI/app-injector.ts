import 'reflect-metadata';
import { InternalServerException } from 'src/exceptions';
import { Type } from 'src/utils/types';

export type Lifetime = 'singleton' | 'scope' | 'transient';

export interface IBinding {
    lifetime: Lifetime;
    implementation: Type<unknown>;
    instance?: InstanceType<Type<unknown>>;
}

class AppInjector {
    public bindings = new Map<Type<unknown>, IBinding>();
    public singletons = new Map<Type<unknown>, InstanceType<Type<unknown>>>();
    public scoped = new Map<Type<unknown>, InstanceType<Type<unknown>>>();

    constructor(
        public readonly name: string | null = null,
    ) {}

    /**
     * Utilisé généralement pour créer un scope d'injection de dépendances
     * au niveau "scope" (donc durée de vie d'une requête)
     */
    public createScope(): AppInjector {
        const scope = new AppInjector();
        scope.bindings = this.bindings; // transmet les déclarations d'injectables
        scope.singletons = this.singletons; // on passe les singletons du parent à l'enfant pour éviter de les recréer
        // on ne garde pas les scoped du parent
        return scope;
    }

    /**
     * Appelé lorsqu'on souhaite résoudre une dépendance,
     * c'est-à-dire récupérer l'instance d'une classe donnée.
     */
    public resolve<T extends Type<unknown>>(target: T): InstanceType<T> {
        const binding = this.bindings.get(target);

        if(!binding)
            throw new InternalServerException(`Failed to resolve a dependency injection : No binding for type ${target.name}`);

        switch(binding.lifetime) {
            case 'transient':
                return this.instantiate(binding.implementation) as InstanceType<T>;

            case 'scope': {
                if(this.scoped.has(target)) {
                    return this.scoped.get(target) as InstanceType<T>;
                }

                const instance = this.instantiate(binding.implementation);
                this.scoped.set(target, instance);

                return instance as InstanceType<T>;
            }

            case 'singleton': {
                if(binding.instance === undefined && this.name === 'root') {
                    binding.instance = this.instantiate(binding.implementation);
                    this.singletons.set(target, binding.instance);
                }

                return binding.instance as InstanceType<T>;
            }
        }
    }

    /**
     * 
     */
    private instantiate<T extends Type<unknown>>(target: T): InstanceType<T> {
        const paramTypes = Reflect.getMetadata('design:paramtypes', target) || [];
        const params = paramTypes.map((p: any) => this.resolve(p));
        return new target(...params) as InstanceType<T>;
    }
}

export const RootInjector = new AppInjector('root');
