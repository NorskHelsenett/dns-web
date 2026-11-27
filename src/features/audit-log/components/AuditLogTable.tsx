import { useMemo, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { DataTable } from "@/components/data-table/DataTable";
import type { AuditEvent } from "../types/auditEvent";
import { AuditEventDetails } from "./AuditEventDetails";
import { createAuditLogColumns } from "./AuditLogColumns";

const auditGrouping = ["timestamp"];

type AuditLogTableProps = {
  events: AuditEvent[];
  toolbar: ReactNode;
  filterKey: string;
  onCorrelation: (id: string) => void;
};

export function AuditLogTable({ events, toolbar, filterKey, onCorrelation }: AuditLogTableProps) {
  const { t, i18n } = useTranslation();
  const timeFormat = useMemo(() => new Intl.DateTimeFormat(i18n.language, {
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  }), [i18n.language]);

  const columns = useMemo(() => createAuditLogColumns(t, timeFormat), [t, timeFormat]);

  const dayFormat = new Intl.DateTimeFormat(i18n.language, { day: "numeric", month: "short", year: "numeric" });
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  return (
    <DataTable
        paginationResetKey={filterKey}
        columns={columns} 
        data={events} 
        getRowId={(event) => event.id}
        pageSize={10} 
        label={t("navbarTitles.auditLog")} 
        toolbar={toolbar}
        grouping={auditGrouping}
        renderGroupHeader={(row) => {
            const date = new Date(String(row.groupingValue));
            const prefix = date.toDateString() === today.toDateString() ? t("auditLog.today") : date.toDateString() === yesterday.toDateString() ? t("auditLog.yesterday") : "";
            return `${prefix ? `${prefix}, ` : ""}${dayFormat.format(date)}`;
        }}
        renderRowDetails={(event) => <AuditEventDetails event={event} onCorrelation={onCorrelation} />}
    />
    );
}