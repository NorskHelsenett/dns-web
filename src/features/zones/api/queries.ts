import { queryOptions } from "@tanstack/react-query";
import { zoneKeys } from "./queryKeys";
import { fetchZoneWithRecords } from "./zones";

export const zoneQueryOptions = (uid: string) =>
  queryOptions({
    queryKey: zoneKeys.detail(uid),
    queryFn: () => fetchZoneWithRecords(uid),
  });
