import { defineConfig } from "eslint-config-the-only-perfect";
import reactRefresh from "eslint-plugin-react-refresh";

export default defineConfig({
  preset: "very-strict",
  ignores: ["dist"],
  overrides: [
    reactRefresh.configs.vite,
    {
      // The CLI's console output is its product, not debug leftovers.
      files: ["cli/**/*.ts", "lib/index.ts"],
      rules: { "no-console": "off" },
    },
  ],
});
