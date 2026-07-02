import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    include: ["__tests__/**/*.{test,spec}.{ts,tsx}"],
  },
  resolve: {
    alias: {
      "@": r("./src"),
      "@core": r("./src/core"),
      "@application": r("./src/core/application"),
      "@domain": r("./src/core/domain"),
      "@infrastructure": r("./src/infrastructure"),
      "@presentation": r("./src/presentation"),
      "@config": r("./src/config"),
      "@app-types": r("./src/types"),
      "@lib": r("./src/lib"),
    },
  },
});
