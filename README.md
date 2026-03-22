# @noxfly/noxus

Lightweight IPC framework for Electron, inspired by NestJS and Angular. It simulates HTTP-like requests between the renderer and the main process via `MessageChannel` / `MessagePort`, with routing, DI, guards, middlewares, and lazy-loading.

No dependency on `reflect-metadata` or `emitDecoratorMetadata`.

---

## Installation

```bash
npm install @noxfly/noxus
```

In your `tsconfig.json`:
```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": false
  }
}
```

---

## Concepts

| Concept                  | Role                                                  |
| ------------------------ | ----------------------------------------------------- |
| **Controller**           | Handles a set of IPC routes under a path prefix       |
| **Injectable**           | Service injectable into other services or controllers |
| **Guard**                | Protects a route or controller (authorization)        |
| **Middleware**           | Runs before guards and the handler                    |
| **Token**                | Explicit identifier for non-class dependencies        |
| **WindowManager**        | Singleton service for managing Electron windows       |
| **bootstrapApplication** | Single entry point of the application                 |

---

## Quick start

### 1. Create a service

```ts
// services/user.service.ts
import { Injectable } from '@noxfly/noxus/main';

@Injectable({ lifetime: 'singleton' })
export class UserService {
    private users = [{ id: 1, name: 'Alice' }];

    findAll() {
        return this.users;
    }

    findById(id: number) {
        return this.users.find(u => u.id === id);
    }
}
```

### 2. Create a controller

```ts
// controllers/user.controller.ts
import { Controller, Get, Post, Request } from '@noxfly/noxus/main';
import { UserService } from '../services/user.service';

@Controller({ path: 'users', deps: [UserService] })
export class UserController {
    constructor(private svc: UserService) {}

    @Get('list')
    list(req: Request) {
        return this.svc.findAll();
    }

    @Get(':id')
    getOne(req: Request) {
        const id = parseInt(req.params['id']!);
        return this.svc.findById(id);
    }

    @Post('create')
    create(req: Request) {
        return { created: true, body: req.body };
    }
}
```

### 3. Create the application service

```ts
// app.service.ts
import { IApp, Injectable, WindowManager } from '@noxfly/noxus/main';
import path from 'path';

@Injectable({ lifetime: 'singleton', deps: [WindowManager] })
export class AppService implements IApp {
    constructor(private wm: WindowManager) {}

    async onReady() {
        const win = await this.wm.createSplash({
            webPreferences: {
                preload: path.join(__dirname, 'preload.js'),
            },
        });

        win.loadFile('index.html');
    }

    async onActivated() {
        if (this.wm.count === 0) await this.onReady();
    }

    async dispose() {
        // cleanup on app close
    }
}
```

### 4. Bootstrap the application

```ts
// main.ts
import { bootstrapApplication } from '@noxfly/noxus/main';
import { AppService } from './app.service';

const noxApp = await bootstrapApplication();

noxApp
    .configure(AppService)
    .lazy('users',  () => import('./controllers/user.controller.js'))
    .lazy('orders', () => import('./controllers/order.controller.js'))
    .start();
```

---

## Dependency Injection

### `@Injectable`

```ts
@Injectable({ lifetime: 'singleton', deps: [RepoA, RepoB] })
class MyService {
    constructor(private a: RepoA, private b: RepoB) {}
}
```

| Option     | Type                                    | Default   | Description                        |
| ---------- | --------------------------------------- | --------- | ---------------------------------- |
| `lifetime` | `'singleton' \| 'scope' \| 'transient'` | `'scope'` | Instance lifetime                  |
| `deps`     | `TokenKey[]`                            | `[]`      | Constructor dependencies, in order |

**Lifetimes:**
- `singleton` — one instance for the entire lifetime of the app
- `scope` — one instance per IPC request
- `transient` — a new instance on every resolution

### `token()` — Non-class dependencies

To inject values that are not classes (strings, interfaces, config objects):

```ts
// tokens.ts
import { token } from '@noxfly/noxus/main';

export const DB_URL     = token<string>('DB_URL');
export const APP_CONFIG = token<AppConfig>('APP_CONFIG');
```

```ts
// Declaring the dependency
@Injectable({ deps: [DB_URL, APP_CONFIG] })
class DbService {
    constructor(private url: string, private config: AppConfig) {}
}

// Providing the value in bootstrapApplication
bootstrapApplication({
    singletons: [
        { token: DB_URL,     useValue: process.env.DATABASE_URL! },
        { token: APP_CONFIG, useValue: { debug: true } },
    ],
});
```

### `inject()` — Manual resolution

```ts
import { inject } from '@noxfly/noxus/main';

const userService = inject(UserService);
```

Useful outside a constructor — in callbacks, factories, etc.

### `forwardRef()` — Circular dependencies

```ts
import { forwardRef } from '@noxfly/noxus/main';

@Injectable({ deps: [forwardRef(() => ServiceB)] })
class ServiceA {
    constructor(private b: ServiceB) {}
}
```

---

## Routing

### Available HTTP methods

```ts
import { Get, Post, Put, Patch, Delete } from '@noxfly/noxus/main';

@Controller({ path: 'products', deps: [ProductService] })
class ProductController {
    constructor(private svc: ProductService) {}

    @Get('list')       list(req: Request)    { ... }
    @Post('create')    create(req: Request)  { ... }
    @Put(':id')        replace(req: Request) { ... }
    @Patch(':id')      update(req: Request)  { ... }
    @Delete(':id')     remove(req: Request)  { ... }
}
```

### Route parameters

```ts
@Get('category/:categoryId/product/:productId')
getProduct(req: Request) {
    const { categoryId, productId } = req.params;
}
```

### Request body

```ts
@Post('create')
create(req: Request) {
    const { name, price } = req.body as { name: string; price: number };
}
```

### Response

The value returned by the handler is automatically placed in `response.body`. To control the status code:

```ts
@Post('create')
create(req: Request, res: IResponse) {
    res.status = 201;
    return { id: 42 };
}
```

---

## Lazy loading

This is the core mechanism for keeping startup fast. A lazy controller is never imported until an IPC request targets its prefix.

```ts
noxApp
    .lazy('users',    () => import('./modules/users/users.controller.js'))
    .lazy('orders',   () => import('./modules/orders/orders.controller.js'))
    .lazy('printing', () => import('./modules/printing/printing.controller.js'))
    .start();
```

> **Important:** the `import()` argument must not statically reference heavy modules. If `users.controller.ts` imports `applicationinsights` at the top of the file, the library will be loaded on the first `users/*` request — not at startup.

### Eager loading (`eagerLoad`)

For modules whose services are needed before `onReady()`:

```ts
bootstrapApplication({
    eagerLoad: [
        () => import('./modules/auth/auth.controller.js'),
    ],
});
```

### Manual loading from NoxApp

```ts
await noxApp.load([
    () => import('./modules/reporting/reporting.controller.js'),
]);
```

---

## Guards

A guard is a plain function that decides whether a request can reach its handler.

```ts
// guards/auth.guard.ts
import { Guard } from '@noxfly/noxus/main';

export const authGuard: Guard = async (req) => {
    return req.body?.token === 'secret'; // your auth logic
};
```

**On an entire controller:**
```ts
@Controller({ path: 'admin', deps: [AdminService], guards: [authGuard] })
class AdminController { ... }
```

**On a specific route:**
```ts
@Delete(':id', { guards: [authGuard, adminGuard] })
remove(req: Request) { ... }
```

Controller guards and route guards are **cumulative** — both run, in the given order.

---

## Middlewares

A middleware is a plain function that runs before guards.

```ts
// middlewares/log.middleware.ts
import { Middleware } from '@noxfly/noxus/main';

export const logMiddleware: Middleware = async (req, res, next) => {
    console.log(`→ ${req.method} ${req.path}`);
    await next();
    console.log(`← ${res.status}`);
};
```

**Global (all routes):**
```ts
noxApp.use(logMiddleware);
```

**On a controller:**
```ts
@Controller({ path: 'users', deps: [...], middlewares: [logMiddleware] })
class UserController { ... }
```

**On a route:**
```ts
@Post('upload', { middlewares: [fileSizeMiddleware] })
upload(req: Request) { ... }
```

**Execution order:** global middlewares → controller middlewares → route middlewares → guards → handler.

---

## WindowManager

Injectable singleton service for managing `BrowserWindow` instances.

```ts
@Injectable({ lifetime: 'singleton', deps: [WindowManager] })
class AppService implements IApp {
    constructor(private wm: WindowManager) {}

    async onReady() {
        // Creates a 600×600 window, animates it to full screen,
        // then resolves the promise once the animation is complete.
        // loadFile() is therefore always called at the correct size — no viewbox freeze.
        const win = await this.wm.createSplash({
            webPreferences: { preload: path.join(__dirname, 'preload.js') },
        });
        win.loadFile('index.html');
    }
}
```

### Full API

```ts
// Creation
const win  = await wm.createSplash(options);      // animated main window
const win2 = await wm.create(config, isMain?);    // custom window

// Access
wm.getMain()       // main window
wm.getById(id)     // by Electron id
wm.getAll()        // all open windows
wm.count           // number of open windows

// Actions
wm.close(id)       // close a window
wm.closeAll()      // close all windows

// Messaging
wm.send(id, 'channel', ...args)    // send a message to one window
wm.broadcast('channel', ...args)   // send to all windows
```

### `createSplash` vs `create`

|              | `createSplash`         | `create`                            |
| ------------ | ---------------------- | ----------------------------------- |
| Initial size | 600×600 centered       | Whatever you define                 |
| Animation    | Expands to work area   | Optional (`expandToWorkArea: true`) |
| `show`       | `true` immediately     | `false` until `ready-to-show`       |
| Use case     | Main window at startup | Secondary windows                   |

---

## External singletons

To inject values built outside the DI container (DB connection, third-party SDK):

```ts
// main.ts
import { MikroORM } from '@mikro-orm/core';
import { bootstrapApplication } from '@noxfly/noxus/main';

const orm = await MikroORM.init(ormConfig);

const noxApp = await bootstrapApplication({
    singletons: [
        { token: MikroORM, useValue: orm },
    ],
});
```

These values are then available via injection in any service:

```ts
@Injectable({ lifetime: 'singleton', deps: [MikroORM] })
class UserRepository {
    constructor(private orm: MikroORM) {}
}
```

---

## Renderer side

### Preload

```ts
// preload.ts
import { createPreloadBridge } from '@noxfly/noxus';

createPreloadBridge(); // exposes window.__noxus__ to the renderer
```

### IPC client

```ts
// In the renderer (Angular, React, Vue, Vanilla...)
import { NoxusClient } from '@noxfly/noxus';

const client = new NoxusClient();
await client.connect();

// Requests
const users = await client.get<User[]>('users/list');
const user  = await client.get<User>('users/42');
await client.post('users/create', { name: 'Bob' });
await client.put('users/42', { name: 'Bob Updated' });
await client.delete('users/42');
```

### Push events (main → renderer)

On the main side, via `NoxSocket`:

```ts
@Injectable({ lifetime: 'singleton', deps: [NoxSocket] })
class NotificationService {
    constructor(private socket: NoxSocket) {}

    notifyAll(message: string) {
        this.socket.emit('notification', { message });
    }

    notifyOne(senderId: number, message: string) {
        this.socket.emitToRenderer(senderId, 'notification', { message });
    }
}
```

On the renderer side:

```ts
client.on('notification', (payload) => {
    console.log(payload.message);
});
```

---

## Batch requests

Multiple IPC requests in a single round-trip:

```ts
const results = await client.batch([
    { method: 'GET',  path: 'users/list' },
    { method: 'GET',  path: 'products/list' },
    { method: 'POST', path: 'orders/create', body: { ... } },
]);
```

---

## Exceptions

Noxus provides an HTTP exception hierarchy to throw from handlers:

```ts
import {
    BadRequestException,     // 400
    UnauthorizedException,   // 401
    ForbiddenException,      // 403
    NotFoundException,       // 404
    ConflictException,       // 409
    InternalServerException, // 500
    // ... and all other 4xx/5xx
} from '@noxfly/noxus/main';

@Get(':id')
getOne(req: Request) {
    const user = this.svc.findById(parseInt(req.params['id']!));
    if (!user) throw new NotFoundException(`User not found`);
    return user;
}
```

The exception is automatically caught by the router and translated into a response with the correct HTTP status.

---

## Recommended project structure

```
src/
├── main.ts                        ← bootstrapApplication + lazy routes
├── app.service.ts                 ← implements IApp
├── modules/
│   ├── users/
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   └── user.repository.ts
│   ├── orders/
│   │   ├── order.controller.ts
│   │   └── order.service.ts
│   └── printing/
│       ├── printing.controller.ts
│       └── printing.service.ts
├── guards/
│   └── auth.guard.ts
├── middlewares/
│   └── log.middleware.ts
└── tokens.ts                      ← shared named tokens
```

Each `module/` folder is **self-contained** — the controller imports its own services directly, with no central declaration. `main.ts` only knows the lazy loading paths.
