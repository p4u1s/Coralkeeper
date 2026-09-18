import js from "@eslint/js"
import globals from "globals"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import tseslint from "typescript-eslint"
import { defineConfig, globalIgnores } from "eslint/config"

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    // shadcn/ui exportiert neben Komponenten auch Varianten (z. B. buttonVariants)
    files: ["src/components/ui/**/*.tsx"],
    rules: {
      "react-refresh/only-export-components": "off",
    },
  },
  {
    // NFR-4.3: Supabase nur innerhalb von src/services/* verwenden
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/services/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@supabase/*",
                "**/services/supabase",
                "**/services/supabase.ts",
              ],
              message: "Supabase nur in src/services/* verwenden (NFR-4.3).",
            },
          ],
        },
      ],
    },
  },
])
