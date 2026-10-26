import { zonePaginationSchema, zoneWithRecordsSchema } from "../types/zone";
import { apiGet, apiPost } from "@/services/apiClient";

export async function fetchZones() {
  return apiPost("/v1/zones/filter", zonePaginationSchema, {
    body: {
      Filters: [{ Field: "name", MatchMode: "wildcard", Value: "*" }],
    },
  });
}

export async function fetchZoneWithRecords(uid: string) {
  return apiGet(`/v1/zones/${encodeURIComponent(uid)}/withRecords`, zoneWithRecordsSchema);
}
