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


## Validating TypeScript changes

MANDATORY: Always check for compilation errors before running any tests or validation scripts, or declaring work complete, then fix all compilation errors before moving forward.

## Coding Guidelines

### Indentation

Use spaces, 4 for any file type, except yml that are 2 spaces.

### Naming Conventions

    Use PascalCase for type names
    Use PascaleCase for class names and interfaces
    Prefix interface names by an 'I'
    Use PascalCase for enum values
    Use camelCase for function and method names
    Use camelCase for property names and local variables
    Use whole words in names when possible

### Types

    Do not export types or functions unless you need to share it across multiple components
    Do not introduce new types or values to the global namespace unless they are truly global concepts

### Comments

    Use JSDoc style comments for functions, interfaces, enums, and classes
    Always include a description of what the function/class/interface/enum does, its parameters, its return value and an example (if applicable)
    Use inline comments to explain why a particular implementation was chosen, especially if it's not obvious. Avoid stating what the code is doing, and instead focus on the reasoning behind it.

### Strings

    Always use "double quotes" for strings.
    Use template literals for string interpolation and multi-line strings instead of concatenation.

### Style

    Use arrow functions => over anonymous function expressions.
    Only surround arrow function parameters when necessary.
    Only surround arrow function bodies with curly braces when they are not a direct return of an expression.
    Always surround loop and conditional bodies with curly braces.
    Open curly braces always go on the same line as whatever necessitates them
    Use StrouStrup style for control statements (the else is on a new line after the closing brace of the if).
    Whenever possible, use in top-level scopes export function x(…) {…} instead of export const x = (…) => {…}. One advantage of using the function keyword is that the stack-trace shows a good name when debugging.

### Code Quality

    All files must include the NoxFly copyright header
    Prefer async and await over Promise and then calls
    Always await a promise to make the function appearable in the stack trace, unless you have a good reason not to (e.g., you want it to run in the background and don't care about errors).
    Look for existing test patterns before creating new structures
    Prefer regex capture groups with names over numbered capture groups.
    If you create any temporary new files, scripts, or helper files for iteration, clean up these files by removing them at the end of the task
    Never duplicate imports. Always reuse existing imports if they are present.
    When removing an import, do not leave behind blank lines where the import was. Ensure the surrounding code remains compact.
    Do not use any or unknown as the type for variables, parameters, or return values unless absolutely necessary. If they need type annotations, they should have proper types or interfaces defined.
    Do not duplicate code. Always look for existing utility functions, helpers, or patterns in the codebase before implementing new functionality. Reuse and extend existing code whenever possible.
    Avoid using bind(), call() and apply() solely to control this or partially apply arguments; prefer arrow functions or closures to capture the necessary context, and use these methods only when required by an API or interoperability.
    Always think for the most performant code for future scalability, even if it requires more upfront work. Consider time and space complexity when designing algorithms and data structures, and prefer efficient patterns that will scale well as the codebase grows.
    Always specify the `public`, `private`, or `protected` access modifier for class members, even if the default is public. This improves readability and makes the intended encapsulation clear to other developers.
    Always use explicit return types for functions and methods, even when TypeScript can infer them. This improves readability and helps catch unintended return values or changes in the function's behavior over time.
    Avoid using non-null assertions (!). Instead, handle potential null or undefined values explicitly through type guards, default values, or proper error handling to ensure safer and more robust code.
    Always prefer composition over inheritance. Favor creating small, reusable functions and classes that can be combined to achieve complex behavior, rather than relying on deep inheritance hierarchies which can lead to tight coupling and reduced flexibility.
    Always use strict equality (=== and !==) instead of loose equality (== and !=) to avoid unexpected type coercion and ensure more predictable comparisons.
    Always ensure readme and copilot-instructions files are updated to reflect any architectural, structural, or convention changes made to the codebase. These documents serve as the primary reference for other developers and must accurately represent the current state of the project.
