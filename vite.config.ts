import react from "@vitejs/plugin-react";
import path from "node:path";
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
  ],
  server: {
    proxy: {
      "/v1": "http://localhost:18080",
    },
  },
  resolve: {
    alias: { "@": path.resolve(import.meta.dirname, "src") },
  },
});
