import { createColumnHelper } from "@tanstack/react-table";
import type { AppFeatures } from "@/components/data-table/features";
import { t } from "i18next";
import type { Zone } from "../../zones/types/zone";
import { Link } from "@tanstack/react-router";

const helper = createColumnHelper<AppFeatures, Zone>();

export const recordColumns = helper.columns([
  helper.accessor("name", {
    header: t("general.name"),
    cell: (z) => (
      <Link to="/zones/$zoneUid" params={{ zoneUid: z.row.original.uid }}>
        {z.getValue()}
      </Link>
    ),
  }),
  helper.accessor("view", { header: t("zones.view")}),
  helper.accessor("comment", { 
    header: t("general.comment"), 
    cell: (c) => c.getValue() ?? "",
    enableSorting: false,
  }),
]);