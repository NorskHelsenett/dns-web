import { zonePaginationSchema, zoneWithRecordsSchema } from "../types/zone";

export async function fetchZones() {
  const res = await fetch("/v1/zones/filter", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      Filters: [{ Field: "name", MatchMode: "wildcard", Value: "*" }],
    }),
  });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return zonePaginationSchema.parse(await res.json());
}

export async function fetchZoneWithRecords(uid: string) {
  const res = await fetch(`/v1/zones/${uid}/withRecords`);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return zoneWithRecordsSchema.parse(await res.json());
}
