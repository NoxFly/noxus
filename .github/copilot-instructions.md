# Copilot Instructions
## Core Architecture
- bootstrapApplication in [src/bootstrap.ts](src/bootstrap.ts) waits for Electron app readiness, resolves NoxApp via DI, and returns a configured instance.
- [src/app.ts](src/app.ts) wires ipcMain events, spawns paired request/socket MessageChannels per renderer, and delegates handling to Router and NoxSocket.
- Package exports are split between renderer and main targets in [package.json](package.json); import Electron main APIs from @noxfly/noxus/main and renderer helpers from @noxfly/noxus or @noxfly/noxus/renderer.
- Dependency injection centers on RootInjector in [src/DI/app-injector.ts](src/DI/app-injector.ts); @Injectable triggers auto-registration through [src/DI/injector-explorer.ts](src/DI/injector-explorer.ts) and supports singleton, scope, and transient lifetimes.
- Modules decorated via [src/decorators/module.decorator.ts](src/decorators/module.decorator.ts) compose providers, controllers, and nested modules; bootstrapApplication rejects roots lacking Module metadata.
## Request Lifecycle
- Request objects from [src/request.ts](src/request.ts) wrap Electron MessageEvents and spawn per-request DI scopes on Request.context.
- Router in [src/router.ts](src/router.ts) indexes routes in a radix tree, merges controller-level and method-level decorators, and enforces root middlewares, route middlewares, then guards before invoking controller actions.
- ResponseException subclasses in [src/exceptions.ts](src/exceptions.ts) propagate status codes; throwing one short-circuits the pipeline so Router returns a structured error payload.
- Batch requests use HTTP method BATCH and normalization logic in Router.handleBatch; payloads must satisfy IBatchRequestPayload to fan out atomic subrequests.
## Communication Channels
- ipcMain listens for gimme-my-port and posts two transferable ports back to the renderer: index 0 carries request/response traffic, index 1 is reserved for socket-style push messages.
- NoxSocket in [src/socket.ts](src/socket.ts) maps sender IDs to {request, socket} channels and emits renderer events exclusively through channels.socket.port1.
- Renderer helpers in [src/renderer-events.ts](src/renderer-events.ts) expose RendererEventRegistry.tryDispatchFromMessageEvent to route push events; the preload script must start both ports and hand the second to this registry.
- Renderer-facing bootstrap lives in [src/renderer-client.ts](src/renderer-client.ts); NoxRendererClient requests ports, wires request/socket handlers, tracks pending promises, and surfaces RendererEventRegistry for push consumption.
- Preload scripts should call exposeNoxusBridge from [src/preload-bridge.ts](src/preload-bridge.ts) to publish window.noxus.requestPort; the helper sends 'gimme-my-port' and forwards both transferable ports with the configured init message.
- When adjusting preload or renderer glue, ensure window.postMessage('init-port', ...) forwards both ports so the socket channel stays alive alongside the request channel.
## Decorator Conventions
- Controller paths omit leading/trailing slashes; method decorators (Get, Post, etc.) auto-trim segments via [src/decorators/method.decorator.ts](src/decorators/method.decorator.ts).
- Guards registered through Authorize in [src/decorators/guards.decorator.ts](src/decorators/guards.decorator.ts) aggregate at controller and action scope; they must resolve truthy or Router throws UnauthorizedException.
- Injectable lifetimes default to scope; use singleton for app-wide utilities (window managers, sockets) and transient for short-lived resources.
## Logging and Utilities
- Logger in [src/utils/logger.ts](src/utils/logger.ts) standardizes color-coded log, warn, error, and comment output; use it when extending framework behavior.
- Path resolution relies on RadixTree from [src/utils/radix-tree.ts](src/utils/radix-tree.ts); normalize controller and route paths to avoid duplicate slashes.
- Request.params are filled by Router.extractParams; controllers read route params directly from Request without decorator helpers yet.
## Build and Tooling
- Run npm run build to invoke tsup with dual ESM/CJS outputs configured in [tsup.config.ts](tsup.config.ts); the postbuild script at [scripts/postbuild.js](scripts/postbuild.js) deduplicates license banners.
- Node 20 or newer is required; reflect-metadata is a peer dependency so host apps must install and import it before using decorators.
- Source uses baseUrl ./ with tsc-alias, so prefer absolute imports like src/module/file when editing framework code to match existing style.
- Dist artifacts live under dist/ and are published outputs; regenerate them via the build script rather than editing directly.
