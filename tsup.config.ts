import { defineConfig } from "tsup";

const copyrights = `
/**
 * @copyright 2025 NoxFly
 * @license MIT
 * @author NoxFly
 */
`.trim()

export default defineConfig({
    entry: {
        renderer: "src/index.ts",
        main: "src/main.ts",
    },
    keepNames: true,
    minifyIdentifiers: false,
    name: "noxus",
    format: ["cjs", "esm"],
    dts: true,
    sourcemap: true,
    clean: true,
    outDir: "dist",
    external: ["electron"],
    target: "es2020",
    minify: false,
    splitting: false,
    shims: false,
    treeshake: false,
    banner: {
        js: copyrights,
    }
});
