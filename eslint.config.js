/**
 * ESLint Configuration (Flat Config Format)
 * @see https://eslint.org/docs/latest/use/configure/configuration-files
 *
 * Combines recommended presets for TypeScript, React, accessibility, and formatting.
 * Prettier is integrated to prevent style conflicts.
 */

import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
    /**
     * Global Ignores
     * @see https://eslint.org/docs/latest/use/configure/configuration-files#ignores-files
     *
     * Exclude build outputs and dependencies from linting.
     */
    { ignores: ["dist", "node_modules", "*.tsbuildinfo"] },

    /**
     * TypeScript + React Recommended Rules
     *
     * Applies ESLint recommended rules, TypeScript strict checks, React hooks best practices,
     * and accessibility rules. Prettier formatting conflicts are resolved by prettier integration.
     */
    {
        extends: [
            js.configs.recommended,
            ...tseslint.configs.recommended,
            reactHooks.configs.flat["recommended-latest"],
            jsxA11y.flatConfigs.recommended,
        ],
        files: ["**/*.{ts,tsx}"],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        plugins: {
            "react-refresh": reactRefresh,
        },
        rules: {
            "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
        },
    },

    /**
     * Tweaks panel exceptions
     *
     * The panel header is a mouse-only drag handle and the segmented control is
     * a pointer-driven radiogroup — intentional prototyping UI that predates the
     * refactor. The rendered markup must stay identical, so relax the a11y rules
     * here rather than change the DOM. Likewise the panel reads its drag-offset
     * ref during render (initial position) and TweakRadio keeps a "latest value"
     * ref in sync during render — deliberate patterns the refs rule flags.
     */
    {
        files: ["src/tweaks/tweaks-panel.tsx"],
        rules: {
            "jsx-a11y/no-static-element-interactions": "off",
            "jsx-a11y/no-noninteractive-element-interactions": "off",
            "react-hooks/refs": "off",
        },
    },

    /**
     * Prettier Integration
     * @see https://github.com/prettier/eslint-config-prettier
     *
     * Disable formatting rules to prevent conflicts with Prettier.
     * This config should be last in the extends array.
     */
    prettier,
);
