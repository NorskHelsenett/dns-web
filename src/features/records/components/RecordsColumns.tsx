import { createColumnHelper } from "@tanstack/react-table";
import type { AppFeatures } from "@/components/data-table/features";
import type { TFunction } from "i18next";
import type { DnsRecord } from "../types/record";
import { recordValue } from "../utils/recordValue";

const helper = createColumnHelper<AppFeatures, DnsRecord>();

export function createRecordsColumns(records: DnsRecord[], t: TFunction) {
  const types = [...new Set(records.map((record) => record.rrtype))].sort();

  return helper.columns([
  helper.accessor("name", {
    header: t("general.name"),
  }),
  helper.accessor("rrtype", {
    header: t("records.type"),
  }),
  helper.accessor("ttl", {
    header: t("records.ttl"),
  }),
  ...types.map((type) =>
    helper.accessor((record) => record.rrtype === type ? recordValue(record) : "", {
      id: `record-type-${type}`,
      header: type,
    }),
  ),
  helper.accessor("comment", { 
    header: t("general.comment"), 
    cell: (c) => c.getValue() ?? "",
    enableSorting: false,
  }),
  ]);
}