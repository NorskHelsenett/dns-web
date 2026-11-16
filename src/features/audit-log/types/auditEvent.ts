export const auditActions = ["publish", "create", "discard", "updateRole", "delete"] as const;
export type AuditAction = (typeof auditActions)[number];
export const auditOutcomes = ["success", "failed", "denied"] as const;
export type AuditOutcome = (typeof auditOutcomes)[number];

export type AuditChange = {
  kind: "added" | "changed" | "removed";
  name: string;
  type: string;
  before?: string;
  after?: string;
};

export type AuditServiceEvent = {
  service: string;
  message: string;
  outcome: AuditOutcome;
  timestamp: string;
};

export type AuditEvent = {
  id: string;
  timestamp: string;
  actor: string;
  source: string;
  action: AuditAction;
  resource: string;
  resourceType: "zone" | "role";
  view?: string;
  outcome: AuditOutcome;
  correlationId: string;
  summary: string;
  serial?: { before: string; after: string };
  context: string;
  changes: AuditChange[];
  serviceEvents: AuditServiceEvent[];
};
