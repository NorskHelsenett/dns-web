import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { loadConfig } from "@/config/appConfig";
import "@/styles/global.css";
import { configureApi } from "@/services/apiClient";
import { initI18n } from "@/lib/i18n";
import { routeTree } from "./routeTree.gen";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import type { ParseKeys } from "i18next";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./queryClient";

const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: "intent",
  defaultPreloadDelay: 100,
  defaultPreloadStaleTime: 0,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
  interface StaticDataRouteOption {
    crumb?: ParseKeys;
  }
}

const container = document.getElementById("root");
if (!container) throw new Error("Missing #root element in index.html");
const root = createRoot(container);

async function start() {
  try {
    const config = await loadConfig();
    configureApi({ baseUrl: config.apiBaseUrl });
    await initI18n(config.defaultLocale);
    root.render(
      <StrictMode>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </StrictMode>,
    );
  } catch (error) {
    console.error("start failed", error);
    root.render(
      <main className="p-8" role="alert">
        <h1 className="text-xl font-semibold">Unable to start the DNS panel</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Check that the application configuration and API are available, then reload the page.
        </p>
      </main>,
    );
  }
}

void start();
