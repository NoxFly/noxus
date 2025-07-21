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
        noxus: "src/index.ts"
    },
    keepNames: true,
    name: "noxus",
    format: ["cjs", "esm"],
    dts: true,
    sourcemap: true,
    clean: true,
    outDir: "dist",
    external: ["electron"],
    target: "es2020",
    minify: true,
    splitting: false,
    shims: false,
    treeshake: false,
    banner: {
        js: copyrights,
    }
});
