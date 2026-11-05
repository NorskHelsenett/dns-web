import { useTranslation } from "react-i18next";
import { cn } from "cn";
import type { Role } from "../types/role";
import { Button } from "@/components/ui/button";
import { Dot, Trash } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { t } from "i18next";

interface ListProps {
  roles: Role[];
  selectedId: string | undefined;
  draftId?: string;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
};

interface ListItemProps {
  role: Role, 
  active: boolean, 
  onSelect: (id: string) => void, 
  onDelete: (id: string) => void
}

function RoleListItem({role, active, onSelect, onDelete}: ListItemProps) {
  return (
    <button 
      type="button"
      aria-current={active}
      onClick={() => onSelect(role.id)}
      className={cn("border-b last:border-0 w-full transition-colors hover:bg-muted", 
      active && "bg-success-bg text-success-fg hover:bg-success-bg")}
    >
    <div className="p-4 flex justify-between gap-3">
      <div className="text-left">
        <p className="text-base font-bold mb-1.5">{role.name}</p>
        <p className="text-muted-foreground mb-1.5">{role.description}</p>
        <p className="flex items-center text-muted-foreground">
          {t("roles.permissionsCount", { count: role.permissions.length })} 
          <Dot />
          {role.scope === "all" ? t("roles.allZones") : t("roles.zonesCount", { count: role.zones.length })}
        </p>
      </div>
      {!role.readOnly && (
        <Button variant="destructive" size="lg" className="text-danger-fg" onClick={() => onDelete(role.id)}>
          <Trash />
        </Button>
      )}
    </div>
    </button>
  )
}

export function RolesList({ roles, selectedId, onSelect, onDelete }: ListProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t("roles.list.title")}
        </CardTitle>
        <CardDescription>
          {roles.length}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0 -my-4">
        {roles.map((role) => {
          const active = role.id === selectedId;
          return (
            <RoleListItem role={role} active={active} onSelect={onSelect} onDelete={onDelete} />
          )
        })}
      </CardContent>
    </Card>
  );
}