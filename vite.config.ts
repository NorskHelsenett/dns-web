import react from "@vitejs/plugin-react";
import path from "node:path";
import { readFileSync } from "node:fs";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
      routesDirectory: "./src/app/routes",
      generatedRouteTree: "./src/app/routeTree.gen.ts",
    }),
    react(),
    tailwindcss(),
    {
      name: "emit-runtime-config",
      generateBundle() {
        this.emitFile({
          type: "asset",
          fileName: "config.json",
          source: readFileSync(path.resolve(import.meta.dirname, "config.json")),
        });
      },
    },
  ],
  server: {
    proxy: {
      "/v1": "http://localhost:18080",
      "/api": {
        target: "http://localhost:18080",
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  resolve: {
    alias: { "@": path.resolve(import.meta.dirname, "src") },
  },
});
