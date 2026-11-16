import { queryOptions } from "@tanstack/react-query";
import { mockZoneChanges, mockRecordChanges } from "../mock";

export const zoneChangeQueryOptions = (zoneUid: string) =>
  queryOptions({
    queryKey: ["pending-changes", "zone", zoneUid],
    queryFn: async () => {
      // TODO: Replace with actual API request
      return mockZoneChanges.find((change) => change.zone_uid === zoneUid) ?? null;
    },
  });

export const recordChangeQueryOptions = (zoneUid: string) =>
  queryOptions({
    queryKey: ["pending-changes", "records", zoneUid],
    queryFn: async () => {
      // TODO: Replace with actual API request
      // For now, return the mock data if zone matches
      return mockRecordChanges.zone_uid === zoneUid ? mockRecordChanges : null;
    },
  });

// Combined query for detail page (fetch both zone and record changes for a changeUid)
export const zoneChangeDetailQueryOptions = (changeUid: string) =>
  queryOptions({
    queryKey: ["pending-changes", "detail", changeUid],
    queryFn: async () => {
      // Find record changes that match this changeUid first
      const recordChanges = mockRecordChanges.changes.some((change) => change.change_uid === changeUid)
        ? mockRecordChanges
        : null;
      
      // Find zone changes that match this changeUid
      let zoneChange: typeof mockZoneChanges[0] | null = mockZoneChanges.find((zone) =>
        zone.changes.some((change) => change.change_uid === changeUid)
      ) || null;

      // If we have record changes, prioritize getting the zone that owns those records
      if (recordChanges) {
        // First check if the zone with record changes also has the matching change_uid
        const recordZone = mockZoneChanges.find((zone) => zone.zone_uid === recordChanges.zone_uid);
        if (recordZone?.changes.some((change) => change.change_uid === changeUid)) {
          // Zone has this change_uid - use it
          zoneChange = recordZone;
        } else {
          // Zone doesn't have this change_uid - still use it as the zone context for the records
          zoneChange = recordZone || null;
        }
      }

      return {
        zone: zoneChange,
        records: recordChanges,
      };
    },
  });