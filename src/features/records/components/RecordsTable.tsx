import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { DataTable } from "@/components/data-table/DataTable";
import { Input } from "@/components/ui/input";
import type { DnsRecord } from "../types/record";
import { recordValue } from "../utils/recordValue";
import { createRecordsColumns } from "./RecordsColumns";
import { tabNumberStyles, tabStyles } from "@/styles/tableStyles";

export function RecordsTable({ records }: { records: DnsRecord[] }) {
  const { t } = useTranslation();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const recordTypes = useMemo(() => {
    const counts = new Map<string, number>();
    for (const record of records) {
      counts.set(record.rrtype, (counts.get(record.rrtype) ?? 0) + 1);
    }
    return [...counts].sort(([typeA], [typeB]) => typeA.localeCompare(typeB));
  }, [records]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return records.filter(
      (r) =>
        (!selectedType || r.rrtype === selectedType) &&
        (!q || r.name.toLowerCase().includes(q) || recordValue(r).toLowerCase().includes(q)),
    );
  }, [records, query, selectedType]);

  const columns = useMemo(() => createRecordsColumns(visible, t), [visible, t]);

  const toolbar = (
    <div className="flex flex-wrap items-center gap-x-7 gap-y-2 border-b border-border box-x-padding py-1.5">
      <div className="flex flex-wrap items-center gap-x-6" role="tablist" aria-label={t("records.type")}>
        <button
          type="button"
          role="tab"
          aria-selected={selectedType === null}
          className={`${tabStyles} border-b-2 ${selectedType === null ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          onClick={() => setSelectedType(null)}
        >
          {t("records.tabs.all")}
          <span className={tabNumberStyles}>{records.length}</span>
        </button>
        {recordTypes.map(([type, count]) => (
          <button
            key={type}
            type="button"
            role="tab"
            aria-selected={selectedType === type}
            className={`${tabStyles} border-b-2 ${selectedType === type ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            onClick={() => setSelectedType(type)}
          >
            {type}
            <span className={tabNumberStyles}>{count}</span>
          </button>
        ))}
      </div>

      <div className="relative ml-auto w-60">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <Input
          type="search"
          aria-label={t("records.search")}
          placeholder={t("records.search")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-10 pl-9"
        />
      </div>
    </div>
  );

  return <DataTable columns={columns} data={visible} getRowId={(r: DnsRecord) => r.uid} toolbar={toolbar} />;
}