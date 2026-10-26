import { useQuery } from "@tanstack/react-query";
import { zoneQueryOptions } from "../api/queries";

export const useZone = (uid: string) => useQuery(zoneQueryOptions(uid));
