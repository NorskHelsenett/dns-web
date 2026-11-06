import type { ReactNode } from "react";

type DataTableToolbarProps = {
  children?: ReactNode;
  actions?: ReactNode;
};

export function DataTableToolbar({ children, actions }: DataTableToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-7 gap-y-2 border-b border-border box-x-padding py-1.5">
      {children}
      {actions && <div className="ml-auto flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}