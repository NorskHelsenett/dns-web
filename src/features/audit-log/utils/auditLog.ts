import type { AuditAction, AuditEvent, AuditOutcome } from "../types/auditEvent";

export type AuditFilters = {
  query: string;
  action: AuditAction | "";
  actor: string;
  resource: string;
  outcome: AuditOutcome | "";
  days: string;
  correlationId: string;
};

export function filterAuditEvents(events: AuditEvent[], filters: AuditFilters, now = new Date()) {
  const query = filters.query.trim().toLowerCase();
  const cutoff = new Date(now);
  cutoff.setHours(0, 0, 0, 0);
  cutoff.setDate(cutoff.getDate() - (Number(filters.days) - 1));

  return events
    .filter(
      (event) =>
        (!filters.action || event.action === filters.action) &&
        (!filters.actor || event.actor === filters.actor) &&
        (!filters.resource || event.resource === filters.resource) &&
        (!filters.outcome || event.outcome === filters.outcome) &&
        (!filters.days || new Date(event.timestamp) >= cutoff) &&
        (!filters.correlationId || event.correlationId === filters.correlationId) &&
        (!query ||
          [event.resource, event.actor, event.correlationId, event.id, event.summary].some(
            (value) => value?.toLowerCase().includes(query),
          )),
    )
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}
