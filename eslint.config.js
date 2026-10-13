import js from "@eslint/js";
import pluginQuery from "@tanstack/eslint-plugin-query";
import pluginRouter from "@tanstack/eslint-plugin-router";
import { defineConfig, globalIgnores } from "eslint/config";
import prettier from "eslint-config-prettier";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tsdoc from "eslint-plugin-tsdoc";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores(["dist", "node_modules", "src/app/routeTree.gen.ts"]),

  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      jsxA11y.flatConfigs.recommended,
      pluginQuery.configs["flat/recommended"],
      pluginRouter.configs["flat/recommended"],
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: { tsdoc },
    rules: {
      "tsdoc/syntax": "warn",
    },
  },
  {
    files: ["vite.config.ts"],
    languageOptions: { globals: globals.node },
  },
  {
    // Route files export a `Route` object next to their components by design,
    // and TanStack Router redirects are thrown as objects.
    files: ["src/app/routes/**/*.{ts,tsx}"],
    rules: {
      "react-refresh/only-export-components": "off",
      "@typescript-eslint/only-throw-error": "off",
    },
  },
  // Reach other features only through their public index.
  {
    files: ["src/features/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/features/*/*"],
              message:
                "Import other features only through their public index (@/features/<name>). Use relative imports inside your own feature.",
            },
          ],
        },
      ],
    },
  },

  // Permission logic lives in one place. Components ask can(), never isAdmin.
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/lib/permissions/**"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "MemberExpression[property.name='isAdmin']",
          message: "Do not check isAdmin directly. Use can() from @/lib/permissions.",
        },
      ],
    },
  },

  // Must be last: turns off rules that conflict with Prettier.
  prettier,
]);
