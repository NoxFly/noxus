import { defineConfig, Options } from "tsup";

const copyrights = `
/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 */
`.trim();

const options: Options = {
    keepNames: true,
    minifyIdentifiers: false,
    name: "noxus",
    format: ["cjs", "esm"],
    dts: true,
    sourcemap: true,
    clean: false,
    outDir: "dist",
    external: ["electron"],
    target: "es2020",
    minify: false,
    splitting: false,
    shims: false,
    treeshake: false,
    banner: { js: copyrights },
};

export default defineConfig([
    {
        entry: { main: 'src/main.ts' },
        external: ['electron', 'electron/main'],
        clean: true,  // ← true uniquement ici
        ...options,
    },
    {
        entry: { renderer: 'src/renderer.ts' },
        external: ['electron', 'electron/renderer'],
        ...options,
    },
    {
        entry: { preload: 'src/preload.ts' },
        external: ['electron', 'electron/renderer'],
        ...options,
    },
    {
        entry: { child: 'src/non-electron-process.ts' },
        ...options,
    },
]);
