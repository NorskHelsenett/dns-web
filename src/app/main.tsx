import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { loadConfig } from "@/config/appConfig";
import "@/styles/global.css";
import { configureApi } from "@/services/apiClient";
import { initI18n } from "@/lib/i18n";
import i18n from "i18next";

const container = document.getElementById("root");
if (!container) throw new Error("Missing #root element in index.html");
const root = createRoot(container);

async function start() {
  try {
    const config = await loadConfig();
    configureApi({ baseUrl: config.apiBaseUrl })
    await initI18n(config.defaultLocale);
    root.render(
      <StrictMode>
        {/* <h1>{i18n.t("app.title")}</h1> */}
        <h1>{i18n.t("app.title")}</h1>
      </StrictMode>,
    );
  } catch (error) {
    // Translations are not loaded yet, so this one message is bilingual and plain.
    root.render(
      <main className="mx-auto max-w-2xl p-6">
        <h1 className="mb-2 text-xl font-bold">
          Kunne ikke starte applikasjonen / Could not start the application
        </h1>
        <pre className="whitespace-pre-wrap">
          {error instanceof Error ? error.message : String(error)}
        </pre>
      </main>,
    );
  }
}

void start();
