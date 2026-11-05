import z from "zod";

/** Every permission a role can hold, in the order they are shown in the permission lists. */
export const permissions = [
  "view_zones",
  "create_zones",
  "delete_zones",
  "edit_ns_records",
  "create_rpz_zones",
  "create_records",
  "edit_records",
  "delete_records",
  "discard_changes",
  "publish_changes",
  "view_audit_log",
  "manage_roles",
  "manage_access_groups",
  "manage_api_access",
  "manage_settings",
] as const;

export const permissionSchema = z.enum(permissions);
export type Permission = z.infer<typeof permissionSchema>;

export const roleSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  permissions: z.array(permissionSchema),
  /** "all" applies to every zone, including zones created later. */
  scope: z.enum(["all", "selected"]),
  /** Zone names. Only used when scope is "selected". */
  zones: z.array(z.string()),
  /** Built-in roles that cannot be edited or deleted. */
  readOnly: z.boolean().default(false),
});

export type Role = z.infer<typeof roleSchema>;
