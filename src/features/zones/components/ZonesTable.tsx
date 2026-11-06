import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { DataTable } from "@/components/data-table/DataTable";
import { DataTableSearch } from "@/components/data-table/DataTableSearch";
import { DataTableTab } from "@/components/data-table/DataTableTab";
import { DataTableToolbar } from "@/components/data-table/DataTableToolbar";
import { zonesColumns } from "./ZonesColumns";
import type { Zone } from "../types/zone";

export function ZonesTable({ zones }: { zones: Zone[] }) {
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
    <DataTableToolbar
      actions={
        <>
          <label className="sr-only" htmlFor="zone-view">{t("zones.view")}</label>
          <select
            id="zone-view"
            value={view}
            onChange={(event) => setView(event.target.value)}
            className="h-10 w-40 rounded-lg border border-input bg-card px-3 text-sm"
          >
            <option value="">{t("zones.allViews")}</option>
            {views.map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
          <DataTableSearch label={t("zones.search")} value={query} onChange={setQuery} />
        </>
      }
    >
      <DataTableTab count={zones.length}>{t("zones.tabs.all")}</DataTableTab>
    </DataTableToolbar>
  );

  return <DataTable columns={zonesColumns} data={visible} getRowId={(z: Zone) => z.uid} toolbar={toolbar} />;
}