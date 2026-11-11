import { createFileRoute } from "@tanstack/react-router";
import { X } from "lucide-react";
import { useId, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { DataTableSearch } from "@/components/data-table/DataTableSearch";
import { DataTableToolbar } from "@/components/data-table/DataTableToolbar";
import { Button } from "@/components/ui/button";
import { AuditLogTable } from "@/features/audit-log/components/AuditLogTable";
import { mockAuditEvents } from "@/features/audit-log/mock";
import { auditActions, auditOutcomes } from "@/features/audit-log/types/auditEvent";
import { filterAuditEvents, type AuditFilters } from "@/features/audit-log/utils/auditLog";

export const Route = createFileRoute("/_app/audit-log")({
  staticData: { crumb: "navbarTitles.auditLog" },
  component: AuditLogPage,
});

const defaultFilters: AuditFilters = {
  query: "", action: "", actor: "", resource: "", outcome: "", days: "30", correlationId: "",
};
const actors = [...new Set(mockAuditEvents.map((event) => event.actor))].sort();
const resources = [...new Set(mockAuditEvents.map((event) => event.resource))].sort();

function AuditLogPage() {
  const { t } = useTranslation();
  const id = useId();
  const [filters, setFilters] = useState<AuditFilters>(defaultFilters);
  const events = useMemo(() => filterAuditEvents(mockAuditEvents, filters), [filters]);
  const filterKey = JSON.stringify(filters);
  const hasFilters = filterKey !== JSON.stringify(defaultFilters);

  const selectFilters = [
    { key: "action", label: t("auditLog.columns.action"), options: [
      { value: "", label: t("auditLog.filters.allActions") },
      ...auditActions.map((value) => ({ value, label: t(`auditLog.actions.${value}`) })),
    ] },
    { key: "actor", label: t("auditLog.columns.actor"), options: [
      { value: "", label: t("auditLog.filters.allActors") },
      ...actors.map((value) => ({ value, label: value })),
    ] },
    { key: "resource", label: t("auditLog.columns.resource"), options: [
      { value: "", label: t("auditLog.filters.allResources") },
      ...resources.map((value) => ({ value, label: value })),
    ] },
    { key: "outcome", label: t("auditLog.columns.outcome"), options: [
      { value: "", label: t("auditLog.filters.allOutcomes") },
      ...auditOutcomes.map((value) => ({ value, label: t(`auditLog.outcomes.${value}`) })),
    ] },
    { key: "days", label: t("auditLog.filters.dateRange"), options: [
      { value: "1", label: t("auditLog.today") },
      { value: "7", label: t("auditLog.filters.last7Days") },
      { value: "30", label: t("auditLog.filters.last30Days") },
      { value: "", label: t("auditLog.filters.allTime") },
    ] },
  ] as const;

  const toolbar = <>
    <DataTableToolbar actions={selectFilters.map((filter) => (
        <div key={filter.key}>
            <label className="sr-only" htmlFor={`${id}-${filter.key}`}>{filter.label}</label>
            <select
                id={`${id}-${filter.key}`}
                value={filters[filter.key]}
                onChange={(event) => setFilters((previous) => ({ ...previous, [filter.key]: event.target.value }))}
                className="h-10 max-w-48 rounded-lg border border-input bg-card px-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
                {filter.options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
        </div>
    ))}>
        <DataTableSearch label={t("general.search")} value={filters.query} onChange={(query) => setFilters((previous) => ({ ...previous, query }))} />
    </DataTableToolbar>

    {hasFilters && (
        <div className="flex flex-wrap items-center gap-3 border-b border-border box-x-padding py-2 text-sm">
            {filters.correlationId && (
                <span className="flex items-center gap-2 rounded-sm bg-muted px-2 py-1 font-mono text-xs">
                    {filters.correlationId}
                    <Button size="icon-sm" variant="ghost" aria-label={t("auditLog.filters.clearCorrelation")} onClick={() => setFilters((previous) => ({ ...previous, correlationId: "" }))}><X /></Button>
                </span>
            )}

            <span className="mr-auto text-xs text-muted-foreground" role="status">{t("auditLog.matchingEvents", { count: events.length })}</span>
            <Button onClick={() => setFilters(defaultFilters)}>{t("auditLog.filters.clear")}</Button>
        </div>
    )}
  </> 
  

  return (
    <div className="page-flex-setup">
        <div>
            <h1>{t("navbarTitles.auditLog")}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{t("auditLog.description")}</p>
        </div>
        <AuditLogTable
            events={events} 
            toolbar={toolbar} 
            filterKey={filterKey}
            onCorrelation={(correlationId) => setFilters({ ...defaultFilters, days: "", correlationId })}
        />
    </div>
  );
}