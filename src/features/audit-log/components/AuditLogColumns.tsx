import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { AppFeatures } from "@/components/data-table/features";
import type { AuditEvent, AuditOutcome } from "../types/auditEvent";
import { cn } from "cn";

const helper = createColumnHelper<AppFeatures, AuditEvent>();
const outcomeStyles: Record<AuditOutcome, string> = {
  success: "bg-success-bg text-success-fg",
  failed: "bg-danger-bg text-danger-fg",
  denied: "bg-warning-bg text-warning-fg",
};

export function createAuditLogColumns(
  t: TFunction,
  timeFormat: Intl.DateTimeFormat,
): ColumnDef<AppFeatures, AuditEvent>[] {
  return helper.columns([
    helper.display({
      id: "expand",
      header: () => <span className="sr-only">{t("auditLog.details.title")}</span>,
      cell: ({ row }) => {
        const open = row.getIsExpanded();
        return (
            <button
                className="inline-flex size-8 items-center justify-center"
                aria-expanded={open}
                disabled={!row.getCanExpand()}
                aria-controls={open ? `details-${row.original.id}` : undefined}
                aria-label={t(open ? "auditLog.collapse" : "auditLog.expand", { id: row.original.id })}
                onClick={row.getToggleExpandedHandler()}
            >
                {open ? <ChevronDown /> : <ChevronRight />}
            </button>
        );
      },
    }),
    helper.accessor("timestamp", {
      header: () => <span className="sr-only">{t("auditLog.columns.time")}</span>,
      enableSorting: false,
      getGroupingValue: (event) => new Date(event.timestamp).toDateString(),
      cell: (cell) => <time dateTime={cell.getValue()}>{timeFormat.format(new Date(cell.getValue()))}</time>
    }),
    helper.accessor("actor", {
      header: t("auditLog.columns.actor"), 
      cell: ({ row }) => <p>{row.original.actor}</p>}),
    helper.accessor("action", {
      header: t("auditLog.columns.action"), 
      cell: (cell) => <p>{t(`auditLog.actions.${cell.getValue()}`)}</p>,
    }),
    helper.accessor("resource", {
      header: t("auditLog.columns.resource"),
      cell: ({ row }) => (
        <>
            <div className="font-mono">{row.original.resource}</div>
            <div className="text-xs text-muted-foreground">
                {t(`auditLog.resourceTypes.${row.original.resourceType}`)}{row.original.view ? `, ${row.original.view}` : ""}
            </div>
        </>
      )
    }),
    helper.accessor("outcome", {
      header: t("auditLog.columns.outcome"),
      cell: (cell) => (
        <span className={cn("rounded-sm px-2 py-1 text-xs font-semibold", outcomeStyles[cell.getValue()])}>
          {t(`auditLog.outcomes.${cell.getValue()}`)}
        </span>
      ),
    }),
  ]);
}