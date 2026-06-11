/*
 * Unit & component test lane: jsdom + RTL, colocated *.test.ts(x) files.
 */

import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
    // `tsconfigPaths` resolves the `@/*` aliases from tsconfig.app.json so test
    // files resolve them exactly like the Vite build does (which already runs it).
    plugins: [tsconfigPaths(), react()],
    test: {
        environment: "jsdom",
        // Ambient describe/it/expect/vi — typed via tsconfig.app.json "types".
        globals: true,
        setupFiles: ["./tests/setup.ts"],
        include: ["src/**/*.test.{ts,tsx}", "tests/**/*.test.{ts,tsx}"],
        exclude: ["node_modules/**", "dist/**"],
        passWithNoTests: true,

        coverage: {
            provider: "v8",
            reporter: ["text", "html", "lcov"],
            // Source files only — no tests, setup, type-only files, or entry shell.
            include: ["src/**/*.{ts,tsx}"],
            exclude: ["src/**/*.test.{ts,tsx}", "tests/**", "src/main.tsx", "src/vite-env.d.ts"],
        },
    },
});
