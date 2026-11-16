import { createFileRoute, notFound } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useZone } from '@/features/zones/hooks/useZone'
import { useTranslation } from 'react-i18next'
import { zoneChangeDetailQueryOptions } from '@/features/pending-changes/api/queries'
import { FieldChangeBadge } from '@/features/pending-changes/components/ChangeDisplay'
import type { ZoneChanges, RecordChanges, RecordChange } from '@/features/pending-changes/types/pendingChanges'
import { ChangeDiff } from '@/features/pending-changes/components/DomainDraftChanges'
import * as React from 'react'
import type {Record} from '@/features/pending-changes/types/pendingChanges'

export const Route = createFileRoute('/_app/pending-changes/$changeUid')({
  staticData: { crumb: "pendingChanges.viewChange" },
  loader: async ({ context: { queryClient }, params }) => {
    const data = await queryClient.ensureQueryData(
      zoneChangeDetailQueryOptions(params.changeUid),
    );

    // Only throw notFound if there's neither zone nor record changes
    if (!data?.zone && !data?.records) throw notFound();

    return {
      parentCrumbs: data?.zone ? [{ 
        title: data.zone.name, 
        url: `/zones/${encodeURIComponent(data.zone.zone_uid)}` 
      }] : [], 
    };
  },

  component: RouteComponent,
})

function RouteComponent() {
  const { t } = useTranslation()
  const { changeUid } = Route.useParams()
  const { data, isLoading } = useQuery(zoneChangeDetailQueryOptions(changeUid))
  const zoneUid = data?.zone?.zone_uid ?? ""
  const { data: unchangedZoneRecords } = useZone(zoneUid)
  const [viewMode, setViewMode] = React.useState<'summary' | 'advanced'>('summary')
  const [showAllChanges, setShowAllChanges] = React.useState(false)

  if (isLoading) {
    return (
      <div className="page-flex-setup flex items-center justify-center">
        <div className="text-gray-500">{t("general.loading")}</div>
      </div>
    )
  }

  // If there's neither zone nor records, show error
  if (!data?.zone && !data?.records) {
    return (
      <div className="page-flex-setup">
        <div className="text-red-500">Change not found</div>
      </div>
    )
  }

  const { zone, records } = data
  
  // Filter changes to show only the current changeUid by default, or all if toggled
  const filteredZoneChanges = showAllChanges 
    ? zone?.changes ?? []
    : zone?.changes?.filter(c => c.change_uid === changeUid) ?? []
  
  const filteredRecordChanges = showAllChanges 
    ? records?.changes ?? []
    : records?.changes?.filter(c => c.change_uid === changeUid) ?? []
  
  // Filter records to only those with changes in the current view
  const affectedRecordUids = new Set(filteredRecordChanges.map(c => c.record_uid))
  const filteredRecords = records?.records.filter(r => affectedRecordUids.has(r.uid)) ?? []
  
  // Extract change metadata
  const displayChanges = [...filteredZoneChanges, ...filteredRecordChanges]
  const changedBy = displayChanges[0]?.changed_by || 'Unknown'
  const changedAt = displayChanges[0]?.changed_at
  
  // Determine the zone name - from zone data or from records
  const zoneName = zone?.name || (records ? `Zone (${records.zone_uid})` : 'Unknown Zone')
  
  return (
    <div className="page-flex-setup">
      <div className="space-y-6">
        {/* Breadcrumbs */}
        <div className="text-sm text-gray-600">
          <span className="text-blue-600 hover:underline cursor-pointer">Domains</span>
          <span className="mx-2">/</span>
          <span className="text-blue-600 hover:underline cursor-pointer">{zoneName}</span>
          <span className="mx-2">/</span>
          <span>Draft changes</span>
        </div>

        {/* Header Section */}
        <div className="border-b pb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="bg-gray-900 text-white px-3 py-1 rounded text-sm font-semibold">Draft</span>
              <p className="text-sm text-gray-700">
                Proposed by <span className="font-semibold">{changedBy}</span> · {changedAt ? formatTime(changedAt) : 'Unknown time'}
              </p>
            </div>
            <div className="flex gap-3">
              <button className="px-6 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition">
                Discard draft
              </button>
              <button className="px-6 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-900 transition">
                Merge into live
              </button>
            </div>
          </div>

          {/* Title and Description */}
          <h1 className="text-4xl font-bold mb-2">{zoneName}</h1>
          <p className="text-gray-700">Proposed change to this domain's records</p>
        </div>

        {/* Show All Changes Toggle */}
        <div className="flex gap-4 items-center">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('summary')}
              className={`px-4 py-2 rounded font-medium transition-colors ${
                viewMode === 'summary'
                  ? 'bg-black text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Summarized
            </button>
            <button
              onClick={() => setViewMode('advanced')}
              className={`px-4 py-2 rounded font-medium transition-colors ${
                viewMode === 'advanced'
                  ? 'bg-black text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Advanced
            </button>
          </div>
          
          <div className="flex items-center gap-2 ml-auto">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showAllChanges}
                onChange={(e) => setShowAllChanges(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium text-gray-700">Show all changes in this zone</span>
            </label>
          </div>
        </div>

        {/* Content based on view mode */}
        {viewMode === 'summary' ? (
          <>
            {/* Zone Changes Section */}
            <div>
              <h2 className="text-lg font-semibold mb-4">
                Zone Changes {!showAllChanges && `(Change ${changeUid})`}
              </h2>
              <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
                {filteredZoneChanges.length === 0 ? (
                  <p className="text-gray-500 text-sm">No zone-level changes</p>
                ) : (
                  <div className="space-y-3">
                    {filteredZoneChanges.map((change) => (
                      <ChangeItem key={change.change_uid} change={change} />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Record Changes Section */}
            {records && (
              <div>
                <h2 className="text-lg font-semibold mb-4">
                  Record Changes {!showAllChanges && `(Change ${changeUid})`}
                </h2>
                <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
                  {filteredRecords.length === 0 ? (
                    <p className="text-gray-500 text-sm">No record changes</p>
                  ) : (
                    <div className="space-y-6">
                      {filteredRecords.map((record) => (
                        <RecordChangeItem 
                          key={record.uid} 
                          record={record} 
                          changes={filteredRecordChanges?.filter(c => c.record_uid === record.uid) ?? []}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          /* Advanced View with ChangeDiff */
          zone ? (
            <ChangeDiff 
              zoneChanges={{
                ...zone,
                changes: filteredZoneChanges
              }} 
              recordChanges={records ? {
                ...records,
                changes: filteredRecordChanges,
                records: filteredRecords
              } : undefined}
              contextRecords={unchangedZoneRecords?.records as Record[] | undefined}
            />
          ) : (
            <div className="text-gray-500 text-sm">
              <p>No zone data available. Showing record changes only.</p>
              {records && (
                <div className="mt-4">
                  <h2 className="text-lg font-semibold mb-4">Record Changes</h2>
                  <div className="space-y-6">
                    {filteredRecords.map((record) => (
                      <RecordChangeItem 
                        key={record.uid} 
                        record={record} 
                        changes={filteredRecordChanges.filter(c => c.record_uid === record.uid)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  )
}

/**
 * Displays a single zone-level field change
 */
function ChangeItem({ change }: { change: ZoneChanges['changes'][0] }) {
  return (
    <div className="bg-white p-3 rounded border border-gray-200">
      <div className="flex items-start justify-between mb-2">
        <FieldChangeBadge
          field={change.field}
          oldValue={change.oldvalue}
          newValue={change.newvalue}
        />
      </div>
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{change.changed_by}</span>
        <span>{formatTime(change.changed_at)}</span>
      </div>
    </div>
  )
}

/**
 * Displays all changes for a single record
 */
function RecordChangeItem({ 
  record, 
  changes
}: { 
  record: RecordChanges['records'][0]
  changes: RecordChange[]
}) {
  return (
    <div className="bg-white p-4 rounded border border-gray-200">
      <div className="mb-3">
        <h3 className="font-semibold text-gray-900">{record.name}</h3>
        <p className="text-xs text-gray-500">Record UID: <code className="bg-gray-100 px-1">{record.uid}</code></p>
      </div>
      
      {changes.length === 0 ? (
        <p className="text-gray-500 text-sm">No field changes</p>
      ) : (
        <div className="space-y-2">
          {changes.map((change: RecordChange, idx: number) => (
            <FieldChangeBadge
              key={idx}
              field={change.field}
              oldValue={change.oldvalue}
              newValue={change.newvalue}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function formatTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return "just now"
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  
  return date.toLocaleDateString()
}
