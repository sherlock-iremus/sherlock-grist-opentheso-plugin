import { defineConfig } from "vite";

export default defineConfig({
    root: "src",
    base: '/dist/',
    build: {
        outDir: "../dist",
    },
});