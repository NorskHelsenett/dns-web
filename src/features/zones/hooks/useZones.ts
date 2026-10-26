import { useQuery } from "@tanstack/react-query";
import { fetchZones } from "../api/zones";
import { zoneKeys } from "../api/queryKeys";

export const useZones = () =>
  useQuery({
    queryKey: zoneKeys.list(),
    queryFn: () => fetchZones(),
  });
