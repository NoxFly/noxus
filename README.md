# ⚡ Noxus — The NestJS-Inspired Framework Built for Electron

Noxus brings the elegance and power of NestJS-like architecture to Electron applications — but with a purpose-built design for IPC and MessagePort communication instead of HTTP.

While NestJS is an excellent framework for building web servers, it is not suited for Electron environments where communication between the main process and the renderer is critical.

Transferring data between these using a local server and using HTTP request would be a waste of resources for the user's target device.

Noxus fills that gap.

✅ Use of decorators

✅ Use of dependency injection, with lifetimes management (singleton, scope, transient)

✅ Modular architecture with the use of modules, defining a map of controllers and services

✅ Automatic and performant controller and route registration with path and method mapping

✅ A true request/response model built on top of MessagePort to look like HTTP requests

✅ Custom exception handling and unified error responses

✅ Decorator-based guard system for route and controller authorization

✅ Scoped dependency injection per request context

✅ Setup the electron application and communication with your renderer easily and with flexibility

✅ TypeScript-first with full type safety and metadata reflection

✅ Pluggable logging with color-coded output for different log levels

<sub>* If you see any issue and you'd like to enhance this framework, feel free to open an issue, fork and do a pull request.</sub>

## Installation

Install the package in your main process application :

```sh
npm i @noxfly/noxus
```

If you have a separated renderer from the main process, you'd like to install the package as well to get typed requests/responses models, for development purposes :

```sh
npm i -D @noxfly/noxus
```

Because you only need types during development, using the `-D` argument will make this package a `devDependency`, thus won't be present on your build.

## Basic use

When employing "main", we consider this is the electron side of your application.

When employing "renderer", this is the separated renderer side of your application.

However, you can feel free to keep both merged, this won't change anything, but for further examples, this will be done to show you where the code should go.

### Setup Main Process side

```ts
// main/index.ts

import { bootstrapApplication } from '@noxfly/noxus';
import { Application } from './modules/app.service.ts';

async function main() {
    const application = await bootstrapApplication(Application, AppModule);
}

main();
```

> ℹ️ Note that you have to specify which service you'd like to see as your application root's service, so the framework can interact with it and setup things on it.

```ts
// main/modules/app.service.ts

import { IApp, Injectable, Logger } from '@noxfly/noxus';

@Injectable('singleton')
export class Application implements IApp {
    constructor(
        private readonly windowManager: WindowManager, // An Injectable too
    ) {}

    // automatically called by the bootstrapApplication function
    // once it is all setup
    public async onReady(): Promise<void> {
        Logger.info("Application's ready");
        this.windowManager.createMain(); // Your custom logic here to create a window
    }
}
```

```ts
// main/modules/app.module.ts

import { Module } from '@noxfly/noxus';

@Module({
    imports: [UsersModule], // import modules to be found here
    providers: [], // define services that should be found here
    controllers: [], // define controllers that this module has to create a route node
})
export class AppModule {}
```

> ℹ️ Note that we do not register Application service in it because it already has been registered when bootstraping the application.

```ts
// main/modules/users/users.module.ts

import { Module } from '@noxfly/noxus';

@Module({
    providers: [UsersService],
    controllers: [UsersController],
})
export class UsersModule {}
```

```ts
// main/modules/users/users.service.ts

import { Injectable } from '@noxfly/noxus';

@Injectable()
export class UsersService {
    public async findAll(): Promise<User[]> {
        // ...
    }

    public async findOneById(id: string): Promise<User> {
        // ...
    }
}
```

> ℹ️ You can specify the lifetime of an injectable passing a value in the decorator, between `singleton`, `scope` or `transient` (default to `scope`).

```ts
// main/modules/users/users.controller.ts

import { Controller, Get } from '@noxfly/noxus';
import { UsersService } from './users.service.ts';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
    ) {}

    @Get('all')
    public getAll(): Promise<User[]> {
        return await this.usersService.findAll();
    }

    @Get('profile/:id')
    @Authorize(AuthGuard)
    public getProfile(IRequest request, IResponse response): Promise<User | undefined> {
        return await this.usersService.findOneById(request.params.id);
    }
}
```

Further upgrades might include new decorators like `@Param()`, `@Body()` etc... like Nest.js offers.

```ts
// main/guards/auth.guard.ts

import { IGuard, Injectable, MaybeAsync, Request } from '@noxfly/noxus';

@Injectable()
export class AuthGuard implements IGuard {
    constructor(
        private readonly authService: AuthService
    ) {}

    public async canActivate(IRequest request): MaybeAsync<boolean> {
        return this.authService.isAuthenticated();
    }
}
```

Here is the output (not with that exact same example) when running the main process :

![Startup image](./images/screenshot-startup.png)


### Setup Preload

We need some configuration on the preload so the main process can give the renderer a port (MessagePort) to communicate with. Everytime this is requested, a new channel is created, an d the previous is closed.

```ts
// main/preload.ts

import { contextBridge, ipcRenderer } from 'electron/renderer';

// .invoke -> front sends to back
// .on -> back sends to front

type fn = (...args: any[]) => void;

contextBridge.exposeInMainWorld('ipcRenderer', {
    requestPort: () => ipcRenderer.send('gimme-my-port'),
    
    hereIsMyPort: () => ipcRenderer.once('port', (e) => {
        e.ports[0]?.start();
        window.postMessage({ type: 'init-port' }, '*', [e.ports[0]!]);
    }),
});
```

> ⚠️ As the Electron documentation warns well, you should NEVER expose the whole ipcRenderer to the renderer. Expose only restricted API that your renderer could use.

We need to use `window.postMessage()` and not a custom callback function, otherwise the port would have been structuredCloned and would only arrive to the renderer with the `onmessage` function, and nothing else (a bit frustrating to not request, isn't it).


### Setup Renderer

I am personnally using Angular as renderer, so there might be some changes if you use another framework or vanilla js, but it is only about typescript's configuration and types.

Maybe this should become a class directly available from @noxfly/noxus;

```ts
// renderer/anyFileAtStartup.ts

import { IRequest, IResponse } from '@noxfly/noxus';

interface PendingRequestHandlers<T> {
    resolve: (value: IResponse<T>) => void;
    reject: (reason?: IResponse<T>) => void;
    request: IRequest;
}

// might be a singleton service
class ElectronService {
    private readonly bridge: any;
    private readonly ipcRenderer: any; // if you know how to get a type, tell me

    private port: MessagePort | undefined;
    private readonly pendingRequests = new Map<string, PendingRequestsHandlers<any>>();

    constructor() {
        this.bridge = window as any;
        this.ipcRenderer = this.bridge.ipcRenderer;

        // when receiving the port given by the main renderer -> preload -> renderer
        window.addEventListener('message', (event: MessageEvent) => {
            if(event.data?.type === 'init-port' && event.ports.length > 0) {
                this.port = event.ports[0]!;
                this.port.onmessage = onResponse;
            }
        });

        ipcRenderer.requestPort();
    }

    /**
     * Resolve the signal-based response
     */
    private onResponse(event: MessageEvent): void {
        const response: IResponse<unknown> = event.data;

        if(!response || !response.requestId) {
            console.error('Received invalid response:', response);
            return;
        }

        const pending = this.pendingRequests.get(response.requestId);
        
        if(!pending) {
            console.error(`No handler found for request ID: ${response.requestId}`);
            return;
        }
        
        this.pendingRequests.delete(response.requestId);

        let fn: (response: IResponse<unknown>) => void = pending.resolve;

        console.groupCollapsed(`${response.status} ${pending.request.method} /${pending.request.path}`);
        
        if(response.error) {
            console.error('error message:', response.error);
            fn = pending.reject;
        }
        
        console.info('response:', response.body);
        console.info('request:', pending.request);

        console.groupEnd();

        fn(response);
    }

    /**
     * Initiate a request to the main process
     */
    public request<T>(request: Omit<IRequest, 'requestId'>): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            if(!this.port) {
                return reject(new Error("MessagePort is not available"));
            }
        
            const req: IRequest = {
                requestId: /* Create a random ID with the function of your choice */,
                ...request,
            };
        
            this.pendingRequests.set(req.requestId, {
                resolve: (response: IResponse<T>) => (response.status < 400)
                    ? resolve(response.body as T)
                    : reject(response);
                reject: (response?: IResponse<T>) => reject(response),
                request: req,
            });
        
            this.port.postMessage(req);
        });
    }
}
```

Use it like that :

```ts
const response: User[] = await electronService.request<User[]>({
    method: 'GET',
    path: 'users/all',
});
```

![Startup image](./images/screenshot-requests.png)


## Contributing

1. Clone the repo
1. `npm i`
1. Develop
1. Push changes (automatically builds)
1. Create a PR

if you'd like to test your changes locally :
1. `npm run build`
1. from an electron project, `npm i ../<path/to/repo>`

