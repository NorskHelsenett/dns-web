import { createColumnHelper } from "@tanstack/react-table";
import type { AppFeatures } from "@/components/data-table/features";
import { t } from "i18next";
import type { Zone } from "../types/zone";
import { Star } from "lucide-react";
import { Link } from "@tanstack/react-router";

const helper = createColumnHelper<AppFeatures, Zone>();

export const zoneColumns = helper.columns([
  helper.accessor("favorited", { 
    header: "", 
    cell: (c) => c.getValue() ? <Star className="fill-accent-yellow" /> : <Star />,
    size: 30,
    minSize: 30,
    maxSize: 30,
    enableSorting: false 
  }),
  helper.accessor("name", { 
    header: t("general.name"),
    cell: (z) => <Link
      to="/zones/$zoneUid"
      params={{ zoneUid: z.row.original.uid }}
      state={{ zone: z.row.original }} // TODO: Change to fetch of zone with api
    >
  {z.getValue()}
</Link>
  }),
  helper.accessor("view", { header: t("zones.view")}),
  helper.accessor("comment", { 
    header: t("general.comment"), 
    cell: (c) => c.getValue() ?? "",
    enableSorting: false,
  }),
]);