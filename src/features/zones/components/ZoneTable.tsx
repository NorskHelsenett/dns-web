import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { DataTable } from "@/components/data-table/DataTable";
import { Input } from "@/components/ui/input";
import { zoneColumns } from "./ZoneColumns";
import type { Zone } from "../types/zone";
import { tabNumberStyles, tabStyles } from "../styles/tableStyles";

export function ZoneTable({ zones }: { zones: Zone[] }) {
  const { t } = useTranslation();
  const [view, setView] = useState("");
  const [query, setQuery] = useState("");

  const views = useMemo(() => [...new Set(zones.map((z) => z.view))].sort(), [zones]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return zones.filter(
      (z) => (!view || z.view === view) && (!q || z.name.toLowerCase().includes(q)),
    );
  }, [zones, view, query]);

  const toolbar = (
    <div className="flex flex-wrap items-center gap-x-7 gap-y-2 border-b border-border box-x-padding py-1.5">
      <span className={tabStyles}>
        <span>{t("zones.tabs.all")}</span>
        <span className={tabNumberStyles}>{zones.length}</span>
      </span>

      <div className="ml-auto flex flex-wrap gap-2">
        <label className="sr-only" htmlFor="zone-view">{t("zones.view")}</label>
        <select
          id="zone-view"
          value={view}
          onChange={(e) => setView(e.target.value)}
          className="h-10 w-40 rounded-lg border border-input bg-card px-3 text-sm"
        >
          <option value="">{t("zones.allViews")}</option>
          {views.map((v) => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>

        <div className="relative w-60">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            type="search"
            aria-label={t("zones.search")}
            placeholder={t("zones.search")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-10 pl-9"
          />
        </div>
      </div>
    </div>
  );

  return <DataTable columns={zoneColumns} data={visible} getRowId={(z: Zone) => z.uid} toolbar={toolbar} />;
}