import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import type { AuditChange, AuditEvent } from "../types/auditEvent";

const changeStyles: Record<AuditChange["kind"], string> = {
  added: "bg-success-bg text-success-fg",
  changed: "bg-warning-bg text-warning-fg",
  removed: "bg-danger-bg text-danger-fg",
};

export function AuditEventDetails({ event, onCorrelation }: { event: AuditEvent; onCorrelation: (id: string) => void }) {
  const { t } = useTranslation();
  const fields = [
    { label: t("auditLog.details.summary"), value: event.summary },
    {
      label: t("auditLog.details.correlationId"),
      value: <div className="flex flex-wrap items-center gap-3">
        <span className="break-all font-mono text-xs">{event.correlationId}</span>
        <Button size="sm" variant="outline" onClick={() => onCorrelation(event.correlationId)}>{t("auditLog.details.showRelated")}</Button>
      </div>,
    },
    { label: t("auditLog.details.eventId"), value: <span className="font-mono text-xs">{event.id}</span> },
  ];

  return (
    <div className="sm:pl-12">
      <dl className="grid grid-cols-1 sm:grid-cols-[8rem_1fr] items-baseline gap-y-3 mb-6">
        {fields.map(({ label, value }) => <div key={label} className="contents">
          <dt className="text-muted-foreground">{label}</dt>
          <dd className="min-w-0">{value}</dd>
        </div>)}
      </dl>

      {event.changes.length > 0 && (
        <section className="flex flex-col gap-2">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-xs" aria-label={t("auditLog.details.changes")}>
                    <thead className="sr-only">
                        <tr>
                            <th scope="col">{t("auditLog.details.change")}</th><th scope="col">{t("general.name")}</th>
                            <th scope="col">{t("records.type")}</th><th scope="col">{t("records.value")}</th>
                        </tr>
                    </thead>
                    
                    <tbody>
                        {event.changes.map((change, index) => (
                            <tr key={index} className="border-b border-border last:border-0">
                                <td className="py-2 pr-4">
                                    <span className={`rounded-sm px-2 py-0.5 font-semibold ${changeStyles[change.kind]}`}>{t(`auditLog.changes.${change.kind}`)}</span>
                                </td>
                                <td className="py-2 pr-4 font-mono">{change.name}</td>
                                <td className="py-2 pr-4 font-mono text-muted-foreground">{change.type}</td>
                                <td className="py-2 font-mono">{change.before}{change.before && change.after ? " → " : ""}{change.after}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
      )}
    </div>
  );
}