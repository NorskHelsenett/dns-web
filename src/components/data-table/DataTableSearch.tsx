import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

type DataTableSearchProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export function DataTableSearch({ label, value, onChange }: DataTableSearchProps) {
  return (
    <div className="relative w-60">
      <Search
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <Input
        type="search"
        aria-label={label}
        placeholder={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 pl-9"
      />
    </div>
  );
}