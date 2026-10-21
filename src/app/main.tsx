import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { loadConfig } from "@/config/appConfig";
import "@/styles/global.css";
import { configureApi } from "@/services/apiClient";
import { initI18n } from "@/lib/i18n";
import { routeTree } from "./routeTree.gen";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import type { ParseKeys } from "i18next";
import type { Zone } from "@/features/zones/types/zone";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient()
const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
  interface StaticDataRouteOption {
    crumb?: ParseKeys;
  }
}

// TODO: Remove once fetch of zone with API

declare module "@tanstack/react-router" {
  interface HistoryState {
    zone?: Zone;
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
  }
}

void start();
