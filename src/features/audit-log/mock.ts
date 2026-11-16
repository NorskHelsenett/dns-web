import type { AuditAction, AuditEvent, AuditOutcome } from "./types/auditEvent";

// Relative dates keep the mock useful for the date filters. Replace with API data when available.
const today = new Date();
function timestamp(daysAgo: number, time: string) {
  const date = new Date(today);
  const [hours = 0, minutes = 0, seconds = 0] = time.split(":").map(Number);
  date.setDate(date.getDate() - daysAgo);
  date.setHours(hours, minutes, seconds, 0);
  return date.toISOString();
}

type Seed = [
  daysAgo: number,
  time: string,
  actor: string,
  action: AuditAction,
  resource: string,
  outcome: AuditOutcome,
];
const seeds: Seed[] = [
  [0, "14:12:03", "A. Berg", "publish", "vitistack.io", "success"],
  [0, "13:40:51", "svc-terraform", "publish", "kunde-a.example.no", "failed"],
  [0, "11:47:20", "M. Haugen", "create", "helse-api.example.no", "success"],
  [0, "09:03:12", "K. Solberg", "discard", "pasientportal.example.no", "success"],
  [1, "16:30:44", "T. Nilsen", "updateRole", "Vitistack team", "success"],
  [1, "13:18:09", "K. Solberg", "delete", "test.nhn.no", "denied"],
  [1, "10:05:37", "A. Berg", "publish", "example.no", "success"],
  [2, "15:41:02", "J. Hansen", "publish", "kunde-a.example.no", "success"],
  [2, "12:08:19", "svc-terraform", "create", "monitor.example.no", "success"],
  [3, "09:24:11", "M. Haugen", "publish", "helsenett.example.no", "success"],
  [4, "16:15:00", "T. Nilsen", "updateRole", "DNS operators", "success"],
  [5, "14:02:32", "A. Berg", "delete", "old.example.no", "success"],
  [6, "11:10:04", "K. Solberg", "publish", "pasientportal.example.no", "failed"],
  [8, "10:31:56", "J. Hansen", "create", "kunde-b.example.no", "success"],
  [9, "08:52:41", "svc-terraform", "publish", "vitistack.io", "success"],
  [12, "15:20:10", "M. Haugen", "discard", "example.no", "success"],
  [15, "13:45:22", "A. Berg", "publish", "api.example.no", "success"],
  [19, "12:16:09", "T. Nilsen", "updateRole", "Auditors", "denied"],
  [23, "10:18:32", "K. Solberg", "create", "internal.example.no", "success"],
  [28, "09:05:02", "J. Hansen", "publish", "kunde-a.example.no", "success"],
  [35, "14:22:11", "svc-terraform", "publish", "archive.example.no", "failed"],
  [48, "11:09:44", "A. Berg", "delete", "legacy.example.no", "success"],
];

export const mockAuditEvents: AuditEvent[] = seeds.map(
  ([daysAgo, time, actor, action, resource, outcome], index) => {
    const isPublish = action === "publish";
    const source = actor.startsWith("svc-")
      ? "API · Terraform"
      : actor === "J. Hansen"
        ? "Customer portal"
        : "Web panel · ADFS (ops)";
    return {
      id: `evt_${(0x7c41f8 + index).toString(16)}`,
      timestamp: timestamp(daysAgo, time),
      actor,
      source,
      action,
      resource,
      resourceType: action === "updateRole" ? "role" : "zone",
      view: action === "updateRole" ? undefined : index === 5 ? "Helsenett" : "Internet",
      outcome,
      // Two entries intentionally share an ID to demonstrate cross-event correlation filtering.
      correlationId: `tr-${index === 7 ? "7f3c9a2e1b8d" : `${(0x7f3c9a2e + index).toString(16)}1b8d`}`,
      summary:
        outcome === "failed"
          ? "Publication failed: the DNS server did not acknowledge the update."
          : outcome === "denied"
            ? "The request was denied. The actor does not have the required permission."
            : isPublish
              ? "3 changes published."
              : action === "create"
                ? "Zone created."
                : action === "discard"
                  ? "Unpublished changes discarded."
                  : action === "delete"
                    ? "Zone deleted."
                    : "Role permissions updated.",
      serial: isPublish ? { before: "2026110501", after: "2026110601" } : undefined,
      context: `${source}, from 10.20.4.${17 + index}`,
      changes: isPublish
        ? [
            { kind: "added", name: "api-v2", type: "A", after: "192.0.2.68" },
            { kind: "changed", name: "www", type: "CNAME", before: "TTL 3600", after: "TTL 300" },
            { kind: "removed", name: "legacy", type: "A", before: "192.0.2.77" },
          ]
        : [],
      serviceEvents: isPublish
        ? [
            {
              service: "dns-api",
              message: "Request accepted",
              outcome: "success",
              timestamp: timestamp(daysAgo, time),
            },
            {
              service: "publisher",
              message:
                outcome === "failed"
                  ? "DNS server did not respond"
                  : "Zone file built, serial 2026110601",
              outcome,
              timestamp: timestamp(daysAgo, time),
            },
            ...(outcome === "success"
              ? [
                  {
                    service: "ns-sync",
                    message: "Pushed to Site 1 and Site 2",
                    outcome,
                    timestamp: timestamp(daysAgo, time),
                  },
                ]
              : []),
          ]
        : [],
    };
  },
);
