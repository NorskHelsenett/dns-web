import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Role } from "../types/role";
import { PermissionsTransfer } from "./PermissionsTransfer";
import { Card, CardContent, CardDescription, CardHeader, CardRadioOption, CardTitle } from "@/components/ui/card";
import { useZones } from "@/features/zones";
import { Trash } from "lucide-react";

interface RoleEditorProps {
  role: Role;
  mode: "create" | "edit";
  onChange: (patch: Partial<Role>) => void;
  onCreate: () => void;
  onCancel: () => void;
};

function AddZoneSelect({
  zones,
  onAdd,
  disabled,
}: {
  zones: string[];
  onAdd: (name: string) => void;
  disabled?: boolean;
}) {
  const { t } = useTranslation();
  const { data } = useZones();

  const options = (data?.data ?? []).map((z) => z.name).filter((name) => !zones.includes(name));

  return (
    <select
      className="h-9 min-w-52 shrink-0 rounded-lg border border-input bg-background px-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
      aria-label={t("roles.appliesTo.addZone")}
      value=""
      disabled={disabled || options.length === 0}
      onChange={(e) => e.target.value && onAdd(e.target.value)}
    >
      <option value="">{t("roles.appliesTo.addZone")}</option>
      {options.map((name) => (
        <option key={name}>{name}</option>
      ))}
    </select>
  );
}

export function RoleEditor({ role, mode, onChange, onCreate, onCancel }: RoleEditorProps) {
  const { t } = useTranslation();
  const disabled = role.readOnly;
  const creating = mode === "create";
  const canCreate = role.name.trim().length > 0;

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{role.name || t("roles.editor.untitled")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="box-padding flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="role-name" className="text-sm font-semibold">
                {t("general.name")}
              </label>
              <Input
                id="role-name"
                className="h-10"
                value={role.name}
                disabled={disabled}
                onChange={(e) => onChange({ name: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="role-description" className="text-sm font-semibold">
                {t("roles.editor.description")}
              </label>
              <textarea
                id="role-description"
                rows={3}
                className="w-full resize-y rounded-lg border border-input bg-transparent px-2.5 py-2 text-base outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                value={role.description}
                disabled={disabled}
                onChange={(e) => onChange({ description: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("roles.permissions.title")}</CardTitle>
          <CardDescription>{t("roles.permissionsCount", { count: role.permissions.length })}</CardDescription>
        </CardHeader>
        <CardContent>
          <PermissionsTransfer
            value={role.permissions}
            disabled={disabled}
            onChange={(permissions) => onChange({ permissions })}
          />
        </CardContent>
      </Card>

      <Card className="gap-0">
        <CardHeader>
          <CardTitle>{t("roles.appliesTo.title")}</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <CardRadioOption
            name="role-scope"
            checked={role.scope === "all"}
            disabled={disabled}
            title={t("roles.appliesTo.all.title")}
            description={t("roles.appliesTo.all.description")}
            onSelect={() => onChange({ scope: "all" })}
          />
          <CardRadioOption
            name="role-scope"
            checked={role.scope === "selected"}
            disabled={disabled}
            title={t("roles.appliesTo.selected.title")}
            description={t("roles.appliesTo.selected.description")}
            onSelect={() => onChange({ scope: "selected" })}
          >
            {role.scope === "selected" && (
              <AddZoneSelect
                zones={role.zones}
                onAdd={(name) => onChange({ zones: [...role.zones, name] })}
                disabled={disabled}
              />
            )}
          </CardRadioOption>

          {role.scope === "selected" &&
            role.zones.map((name) => (
              <div
                key={name}
                className="flex items-center justify-between px-(--card-spacing) py-(--card-spacing) not-last:border-b"
              >
                <span className="font-mono text-sm">{name}</span>
                <Button
                  variant="destructive"
                  disabled={disabled}
                  aria-label={t("roles.appliesTo.removeZone", { name })}
                  onClick={() => onChange({ zones: role.zones.filter((z) => z !== name) })}
                >
                  <Trash />
                </Button>
              </div>
            ))}
        </CardContent>
      </Card>

      {creating && (
        <div className="flex items-center gap-4">
          <Button size="lg" disabled={!canCreate} onClick={onCreate}>
            {t("roles.editor.create")}
          </Button>
          <Button size="lg" variant="ghost" onClick={onCancel}>
            {t("roles.editor.cancel")}
          </Button>
        </div>
      )}
    </div>
  );
}