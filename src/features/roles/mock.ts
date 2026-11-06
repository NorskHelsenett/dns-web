import { permissions, type Role } from "./types/role";

// TODO: Replace with real queries when the roles API is ready in backend

export const mockRoles: Role[] = [
  {
    id: "administrator",
    name: "Administrator",
    description: "Full access to everything.",
    permissions: [...permissions],
    scope: "all",
    zones: [],
    readOnly: true,
  },
  {
    id: "zone-administrator",
    name: "Zone administrator",
    description: "Full control of zones, including NS records and deletion.",
    permissions: [
      "view_zones",
      "create_zones",
      "delete_zones",
      "edit_ns_records",
      "create_records",
      "edit_records",
      "delete_records",
      "discard_changes",
      "publish_changes",
    ],
    scope: "all",
    zones: [],
    readOnly: false,
  },
  {
    id: "zone-editor",
    name: "Zone editor",
    description: "Change records and publish.",
    permissions: [
      "view_zones",
      "create_records",
      "edit_records",
      "delete_records",
      "discard_changes",
      "publish_changes",
    ],
    scope: "all",
    zones: [],
    readOnly: false,
  },
  {
    id: "external-customer",
    name: "External customer",
    description: "Customers working in their own zones.",
    permissions: ["view_zones", "edit_records", "publish_changes"],
    scope: "selected",
    zones: ["example.no"],
    readOnly: false,
  },
  {
    id: "auditor",
    name: "Auditor",
    description: "Read zones and the audit log.",
    permissions: ["view_zones", "view_audit_log"],
    scope: "all",
    zones: [],
    readOnly: false,
  },
];
