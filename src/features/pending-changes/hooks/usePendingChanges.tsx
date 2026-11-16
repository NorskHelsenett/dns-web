import { mockZoneChanges, mockRecordChanges } from '../mock'

export interface PendingChangeData {
  zoneChanges: typeof mockZoneChanges
  recordChanges: typeof mockRecordChanges
}

export const usePendingChanges = () => {
  // This only uses MockData generated in frontend
  // TODO: Replace with actual data from API
  const data: PendingChangeData = {
    zoneChanges: mockZoneChanges,
    recordChanges: mockRecordChanges,
  }

  return { data }
}