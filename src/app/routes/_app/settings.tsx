import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app/settings")({
  staticData: { crumb: "navbarTitles.settings" },
  component: SettingsPage,
});

function SettingsPage() {
  const { t } = useTranslation();
  const [ttl, setTtl] = useState("3600");

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-col gap-2">
        <h1>{t("navbarTitles.settings")}</h1>
        <p className="text-muted-foreground">{t("settings.description")}</p>
      </header>

      <section aria-labelledby="zone-defaults-title" className="w-full max-w-2xl border border-border bg-card">
        <div className="border-b border-border px-3 py-3">
          <h2 id="zone-defaults-title" className="text-sm font-semibold">{t("settings.zoneDefaults.title")}</h2>
          <p className="mt-1 text-xs text-muted-foreground">{t("settings.zoneDefaults.description")}</p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 px-3 py-3">
          <div className="max-w-xs">
            <label htmlFor="default-ttl" className="text-sm font-medium">{t("settings.zoneDefaults.defaultTtl")}</label>
            <p id="default-ttl-description" className="mt-1 text-xs text-muted-foreground">
              {t("settings.zoneDefaults.defaultTtlDescription")}
            </p>
          </div>
          <select
            id="default-ttl"
            aria-describedby="default-ttl-description"
            value={ttl}
            onChange={(event) => setTtl(event.target.value)}
            className="h-9 w-44 rounded-sm border border-input bg-card px-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <option value="300">{t("settings.zoneDefaults.ttlOptions.fiveMinutes")}</option>
            <option value="3600">{t("settings.zoneDefaults.ttlOptions.oneHour")}</option>
            <option value="14400">{t("settings.zoneDefaults.ttlOptions.fourHours")}</option>
            <option value="43200">{t("settings.zoneDefaults.ttlOptions.twelveHours")}</option>
            <option value="86400">{t("settings.zoneDefaults.ttlOptions.oneDay")}</option>
          </select>
        </div>
        {ttl !== "3600" && (
          <div className="flex justify-end border-t border-border px-3 py-3">
            <Button type="button">{t("settings.save")}</Button>
          </div>
        )}
      </section>
    </div>
  );
}
