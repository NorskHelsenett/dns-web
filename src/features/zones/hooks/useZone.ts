import { useQuery } from "@tanstack/react-query";
import { fetchZoneWithRecords } from "../api/zones";
import { zoneKeys } from "./queryKeys";

export const useZone = (uid: string) =>
  useQuery({
    queryKey: zoneKeys.detail(uid),
    queryFn: () => fetchZoneWithRecords(uid),
  });
