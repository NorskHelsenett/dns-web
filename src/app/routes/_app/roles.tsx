import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { RoleEditor } from "@/features/roles/components/RoleEditor";
import { RolesList } from "@/features/roles/components/RolesList";
import { mockRoles } from "@/features/roles/mock";
import type { Role } from "@/features/roles/types/role";

export const Route = createFileRoute("/_app/roles")({
  staticData: { crumb: "navbarTitles.rolesAndPermissions" },
  component: RolesPage,
});

function RolesPage() {
  const { t } = useTranslation();
  // TODO: Replace local state with queries and mutations when the roles API is ready in backend
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [draft, setDraft] = useState<Role | undefined>();
  const [roleToDelete, setRoleToDelete] = useState<Role | undefined>();

  const isDraft = draft !== undefined && draft.id === selectedId;
  const selected = isDraft ? draft : roles.find((role) => role.id === selectedId);

  const updateRole = (id: string, patch: Partial<Role>) => {
    if (draft?.id === id) setDraft((prev) => (prev ? { ...prev, ...patch } : prev));
    else setRoles((prev) => prev.map((role) => (role.id === id ? { ...role, ...patch } : role)));
  };

  const startNewRole = () => {
    const role: Role = {
      id: crypto.randomUUID(),
      name: "",
      description: "",
      permissions: [],
      scope: "selected",
      zones: [],
      readOnly: false,
    };
    setDraft(role);
    setSelectedId(role.id);
  };

  const createRole = () => {
    if (!draft) return;
    setRoles((prev) => [...prev, { ...draft, name: draft.name.trim() }]);
    setDraft(undefined);
  };

  const cancelDraft = () => {
    setDraft(undefined);
    setSelectedId(roles[0]?.id);
  };

  // Picking another role throws the unsaved draft away.
  const selectRole = (id: string) => {
    if (id !== draft?.id) setDraft(undefined);
    setSelectedId(id);
  };

  const deleteRole = (id: string) => {
    const role = roles.find((r) => r.id === id);
    if (!role || role.readOnly) return;

    const index = roles.indexOf(role);
    const remaining = roles.filter((r) => r.id !== id);
    setRoles(remaining);

    if (id === selectedId) {
      setSelectedId(remaining[Math.min(index, remaining.length - 1)]?.id);
    }
  };

  const confirmDelete = () => {
    if (roleToDelete) deleteRole(roleToDelete.id);
    setRoleToDelete(undefined);
  };

  return (
    <div className="page-flex-setup">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-medium">{t("navbarTitles.rolesAndPermissions")}</h1>
          <p className="text-muted-foreground">{t("roles.subtitle")}</p>
        </div>
        <Button size="lg" onClick={startNewRole}>
          <Plus />
          {t("roles.newRole")}
        </Button>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[17rem_1fr]">
        <RolesList
          roles={roles}
          selectedId={selectedId}
          onSelect={selectRole}
          onDelete={(id) => setRoleToDelete(roles.find((role) => role.id === id))}
        />
        {selected && (
          <RoleEditor
            key={selected.id}
            role={selected}
            mode={isDraft ? "create" : "edit"}
            onChange={(patch) => updateRole(selected.id, patch)}
            onCreate={createRole}
            onCancel={cancelDraft}
          />
        )}
      </div>

      <AlertDialog
        open={roleToDelete !== undefined}
        onOpenChange={(open) => {
          if (!open) setRoleToDelete(undefined);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("roles.delete.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("roles.delete.description", { name: roleToDelete?.name ?? "" })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("roles.delete.cancel")}</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={confirmDelete}>
              {t("roles.delete.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}