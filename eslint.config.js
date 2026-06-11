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
     * Prettier Integration
     * @see https://github.com/prettier/eslint-config-prettier
     *
     * Disable formatting rules to prevent conflicts with Prettier.
     * This config should be last in the extends array.
     */
    prettier,
);
