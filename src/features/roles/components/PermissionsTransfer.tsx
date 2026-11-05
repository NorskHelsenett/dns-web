import { useState } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { permissions, type Permission } from "../types/role";

interface PermissionsTransferProps {
  value: Permission[];
  onChange: (next: Permission[]) => void;
  disabled?: boolean;
};

export function PermissionsTransfer({ value, onChange, disabled }: PermissionsTransferProps) {
  const { t } = useTranslation();
  
  const [ticked, setTicked] = useState<Set<Permission>>(new Set());
  const [availableFilter, setAvailableFilter] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");

  const available = permissions.filter((p) => !value.includes(p));
  const selected = permissions.filter((p) => value.includes(p));

  const matches = (filter: string) => (p: Permission) => p.includes(filter.trim().toLowerCase());
  const visibleAvailable = available.filter(matches(availableFilter));
  const visibleSelected = selected.filter(matches(selectedFilter));

  const tickedAvailable = visibleAvailable.filter((p) => ticked.has(p));
  const tickedSelected = visibleSelected.filter((p) => ticked.has(p));

  const toggle = (permission: Permission) =>
    setTicked((prev) => {
      const next = new Set(prev);
      if (next.has(permission)) next.delete(permission);
      else next.add(permission);
      return next;
    });

  const add = (items: Permission[]) => {
    onChange(permissions.filter((p) => value.includes(p) || items.includes(p)));
    setTicked(new Set());
  };
  const remove = (items: Permission[]) => {
    onChange(value.filter((p) => !items.includes(p)));
    setTicked(new Set());
  };

  return (
    <div className="box-padding grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto_1fr]">
      <PermissionList
        title={t("roles.permissions.available")}
        filterLabel={t("roles.permissions.filter")}
        filter={availableFilter}
        onFilterChange={setAvailableFilter}
        items={visibleAvailable}
        tickedCount={tickedAvailable.length}
        total={visibleAvailable.length}
        ticked={ticked}
        onToggle={toggle}
        disabled={disabled}
      />

      <div className="flex flex-row justify-center gap-2 self-center md:flex-col">
        <Button
          variant="outline"
          size="icon-lg"
          aria-label={t("roles.permissions.addSelected")}
          disabled={disabled || tickedAvailable.length === 0}
          onClick={() => add(tickedAvailable)}
        >
          <ChevronRight />
        </Button>
        <Button
          variant="outline"
          size="icon-lg"
          aria-label={t("roles.permissions.addAll")}
          disabled={disabled || visibleAvailable.length === 0}
          onClick={() => add(visibleAvailable)}
        >
          <ChevronsRight />
        </Button>
        <Button
          variant="outline"
          size="icon-lg"
          aria-label={t("roles.permissions.removeAll")}
          disabled={disabled || visibleSelected.length === 0}
          onClick={() => remove(visibleSelected)}
        >
          <ChevronsLeft />
        </Button>
        <Button
          variant="outline"
          size="icon-lg"
          aria-label={t("roles.permissions.removeSelected")}
          disabled={disabled || tickedSelected.length === 0}
          onClick={() => remove(tickedSelected)}
        >
          <ChevronLeft />
        </Button>
      </div>

      <PermissionList
        title={t("roles.permissions.selected")}
        filterLabel={t("roles.permissions.filter")}
        filter={selectedFilter}
        onFilterChange={setSelectedFilter}
        items={visibleSelected}
        tickedCount={tickedSelected.length}
        total={visibleSelected.length}
        ticked={ticked}
        onToggle={toggle}
        disabled={disabled}
      />
    </div>
  );
}

function PermissionList({
  title,
  filterLabel,
  filter,
  onFilterChange,
  items,
  tickedCount,
  total,
  ticked,
  onToggle,
  disabled,
}: {
  title: string;
  filterLabel: string;
  filter: string;
  onFilterChange: (value: string) => void;
  items: Permission[];
  tickedCount: number;
  total: number;
  ticked: Set<Permission>;
  onToggle: (permission: Permission) => void;
  disabled?: boolean;
}) {
  const { t } = useTranslation();

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <h3 className="text-sm font-semibold">{title}</h3>
        <span className="text-sm text-muted-foreground">
          {t("roles.permissions.selectedCount", { selected: tickedCount, total })}
        </span>
      </div>
      <div className="relative">
        <Search
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          className="h-9 pl-8"
          aria-label={filterLabel}
          placeholder={filterLabel}
          value={filter}
          onChange={(e) => onFilterChange(e.target.value)}
        />
      </div>
      <ul className="h-64 overflow-y-auto rounded-lg border border-input bg-card">
        {items.map((permission) => (
          <li key={permission} className="not-last:border-b">
            <label
              className={
                disabled
                  ? "flex cursor-not-allowed items-center gap-3 px-3 py-2.5 opacity-60"
                  : "flex cursor-pointer items-center gap-3 px-3 py-2.5 hover:bg-muted"
              }
            >
              <input
                type="checkbox"
                className="size-4 accent-primary"
                checked={ticked.has(permission)}
                disabled={disabled}
                onChange={() => onToggle(permission)}
              />
              <span className="font-mono text-sm">{permission}</span>
            </label>
          </li>
        ))}
        {items.length === 0 && (
          <li className="p-3 text-sm text-muted-foreground">{t("table.empty")}</li>
        )}
      </ul>
    </div>
  );
}