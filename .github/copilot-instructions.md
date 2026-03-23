# Copilot Instructions
## Core Architecture
- bootstrapApplication in [src/internal/bootstrap.ts](src/internal/bootstrap.ts) waits for Electron app readiness, applies log level config, wires the controller registrar, flushes DI, resolves NoxApp, registers routes and eager-loads, then returns a configured instance.
- [src/internal/app.ts](src/internal/app.ts) wires ipcMain events, spawns paired request/socket MessageChannels per renderer, and delegates handling to Router and NoxSocket.
- Package exports are split between renderer and main targets in [package.json](package.json); import Electron main APIs from @noxfly/noxus/main, renderer helpers from @noxfly/noxus or @noxfly/noxus/renderer, and preload helpers from @noxfly/noxus/preload.
- Dependency injection centers on RootInjector in [src/DI/app-injector.ts](src/DI/app-injector.ts); @Injectable triggers auto-registration through [src/DI/injector-explorer.ts](src/DI/injector-explorer.ts) and supports singleton, scope, and transient lifetimes.
- resetRootInjector() in [src/DI/app-injector.ts](src/DI/app-injector.ts) clears all bindings, singletons, and scoped instances — use it in tests to get a clean DI state between test suites.
- There is no Module decorator — controllers and services are standalone, registered via @Injectable and @Controller decorators with explicit deps arrays.
## Request Lifecycle
- Request objects from [src/internal/request.ts](src/internal/request.ts) wrap Electron MessageEvents and spawn per-request DI scopes on Request.context. They expose params, body, and query (Record<string, string>).
- Router in [src/internal/router.ts](src/internal/router.ts) indexes routes in a radix tree, merges controller-level and method-level decorators, and enforces root middlewares, route middlewares, then guards before invoking controller actions.
- The radix tree in [src/utils/radix-tree.ts](src/utils/radix-tree.ts) prioritizes static segments over parameter segments during search, so `addNote/:id` won't be shadowed by `:id`.
- ResponseException subclasses in [src/internal/exceptions.ts](src/internal/exceptions.ts) propagate status codes; throwing one short-circuits the pipeline so Router returns a structured error payload.
- Batch requests use HTTP method BATCH and normalization logic in Router.handleBatch; payloads must satisfy IBatchRequestPayload to fan out atomic subrequests.
## Communication Channels
- ipcMain listens for gimme-my-port and posts two transferable ports back to the renderer: index 0 carries request/response traffic, index 1 is reserved for socket-style push messages.
- NoxSocket in [src/internal/socket.ts](src/internal/socket.ts) maps sender IDs to {request, socket} channels and emits renderer events exclusively through channels.socket.port1. emit() returns void.
- Renderer helpers in [src/internal/renderer-events.ts](src/internal/renderer-events.ts) expose RendererEventRegistry.tryDispatchFromMessageEvent to route push events; the preload script must start both ports and hand the second to this registry.
- Renderer-facing bootstrap lives in [src/internal/renderer-client.ts](src/internal/renderer-client.ts); NoxRendererClient requests ports, wires request/socket handlers, tracks pending promises with configurable timeout (default 10s), and surfaces RendererEventRegistry for push consumption.
- Preload scripts should call exposeNoxusBridge from [src/internal/preload-bridge.ts](src/internal/preload-bridge.ts) to publish window.noxus.requestPort; the helper sends 'gimme-my-port' and forwards both transferable ports with the configured init message.
- When adjusting preload or renderer glue, ensure window.postMessage('init-port', ...) forwards both ports so the socket channel stays alive alongside the request channel.
## Route Definitions
- defineRoutes in [src/internal/routes.ts](src/internal/routes.ts) is the single source of truth for routing. It validates for duplicate and overlapping prefixes and supports nested children with inherited guards/middlewares.
- Parent routes can omit the load function and serve only as shared prefix containers for children.
- flattenRoutes recursively merges parent guards and middlewares into each child before validation.
## Decorator Conventions
- Controller paths omit leading/trailing slashes; method decorators (Get, Post, etc.) auto-trim segments via [src/decorators/method.decorator.ts](src/decorators/method.decorator.ts).
- Guards registered through Authorize in [src/decorators/guards.decorator.ts](src/decorators/guards.decorator.ts) aggregate at controller and action scope; they must resolve truthy or Router throws UnauthorizedException.
- Injectable lifetimes default to scope; use singleton for app-wide utilities (window managers, sockets) and transient for short-lived resources.
## Dependency Injection Internals
- InjectorExplorer in [src/DI/injector-explorer.ts](src/DI/injector-explorer.ts) accumulates registrations at import time and flushes in two phases (bind then resolve).
- To avoid a circular dependency between InjectorExplorer and Router, controller registration is decoupled via a ControllerRegistrar callback set by bootstrapApplication through setControllerRegistrar(). There is no require() call.
- flushAccumulated is serialized through a Promise-based lock (loadingLock) to prevent concurrent lazy module loads from corrupting the queue. Use waitForFlush() to await completion.
- Phase 2 validates that declared deps have a corresponding binding or singleton, and emits warnings for missing ones at startup.
## Logging and Utilities
- Logger in [src/utils/logger.ts](src/utils/logger.ts) standardizes color-coded log, warn, error, and comment output; it supports configurable log levels via Logger.setLogLevel() and file output via Logger.enableFileLogging().
- bootstrapApplication accepts a logLevel option ('debug' | 'info' | 'none' | LogLevel[]) to control framework verbosity.
- Path resolution relies on RadixTree from [src/utils/radix-tree.ts](src/utils/radix-tree.ts); normalize controller and route paths to avoid duplicate slashes.
- Request.params are filled by Router.extractParams; Request.query carries query parameters passed from the renderer; controllers read both directly from the Request object.
## Build and Tooling
- Run npm run build to invoke tsup with dual ESM/CJS outputs configured in [tsup.config.ts](tsup.config.ts); the postbuild script at [scripts/postbuild.js](scripts/postbuild.js) deduplicates license banners.
- Node 20 or newer is required; no reflect-metadata is needed — all dependency information comes from explicit deps arrays.
- Source uses baseUrl ./ with tsc-alias, so prefer absolute imports like src/module/file when editing framework code to match existing style.
- Dist artifacts live under dist/ and are published outputs; regenerate them via the build script rather than editing directly.
