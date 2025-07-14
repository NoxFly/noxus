import { defineConfig } from "tsup";

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
    minify: false,
    splitting: false,
    shims: false,
    treeshake: false,
});