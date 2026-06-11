import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    plugins: [react(), tsconfigPaths()],
    build: {
        // Matches tsconfig.app.json's target (modern evergreens, Safari 16+);
        // drop to "es2020" if pre-2023 browser support is required.
        target: "es2022",
        // Emits .map files without referencing them from the bundle — uploadable
        // to an error tracker without exposing source publicly.
        sourcemap: "hidden",
    },
});
