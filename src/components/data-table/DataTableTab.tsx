import type { ReactNode } from "react";

type DataTableTabProps = {
  children: ReactNode;
  count?: number;
  selected?: boolean;
  onSelect?: () => void;
};

const tabStyles = "flex items-baseline justify-center gap-1.5 text-sm font-medium leading-10";
const tabNumberStyles = "font-mono text-xs text-muted-foreground";

export function DataTableTab({ children, count, selected = false, onSelect }: DataTableTabProps) {
  const content = (
    <>
      {children}
      {count !== undefined && <span className={tabNumberStyles}>{count}</span>}
    </>
  );

  if (!onSelect) {
    return <span className={tabStyles}>{content}</span>;
  }

  return (
    <button
      type="button"
      aria-pressed={selected}
      className={`${tabStyles} border-b-2 ${selected ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
      onClick={onSelect}
    >
      {content}
    </button>
  );
}