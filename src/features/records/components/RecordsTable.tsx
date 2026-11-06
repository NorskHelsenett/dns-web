import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { DataTable } from "@/components/data-table/DataTable";
import { DataTableSearch } from "@/components/data-table/DataTableSearch";
import { DataTableTab } from "@/components/data-table/DataTableTab";
import { DataTableToolbar } from "@/components/data-table/DataTableToolbar";
import type { DnsRecord } from "../types/record";
import { recordValue } from "../utils/recordValue";
import { createRecordsColumns } from "./RecordsColumns";

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
    <DataTableToolbar
      actions={
        <DataTableSearch
          label={t("records.search")}
          value={query}
          onChange={setQuery}
        />
      }
    >
      <div className="flex flex-wrap items-center gap-x-6" role="group" aria-label={t("records.type")}>
        <DataTableTab selected={selectedType === null} count={records.length} onSelect={() => setSelectedType(null)}>
          {t("records.tabs.all")}
        </DataTableTab>
        {recordTypes.map(([type, count]) => (
          <DataTableTab
            key={type}
            selected={selectedType === type}
            count={count}
            onSelect={() => setSelectedType(type)}
          >
            {type}
          </DataTableTab>
        ))}
      </div>
    </DataTableToolbar>
  );

  return <DataTable columns={columns} data={visible} getRowId={(r: DnsRecord) => r.uid} toolbar={toolbar} />;
}