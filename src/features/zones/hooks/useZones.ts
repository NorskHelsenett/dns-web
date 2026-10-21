import { useQuery } from "@tanstack/react-query";
import { fetchZones } from "../api/zones";
import { zoneKeys } from "./queryKeys";

export const useZones = () =>
  useQuery({
    queryKey: zoneKeys.list(),
    queryFn: () => fetchZones(),
  });
