import { useMemo, useState } from 'react';
import { DataTable } from '@/components/data-table/DataTable';
import type { ZoneChanges, RecordChanges } from '../types/pendingChanges'
import { useTranslation } from 'react-i18next'
import { DataTableToolbar } from '@/components/data-table/DataTableToolbar';
import { DataTableSearch } from '@/components/data-table/DataTableSearch';
import { DataTableTab } from '@/components/data-table/DataTableTab';
import { zoneChangesColumns, recordChangesColumns } from './PendingChangesColumns';
import { Link } from '@tanstack/react-router';

interface PendingChangesTable2Props {
  zoneChanges: ZoneChanges[]
  recordChanges: RecordChanges
}

export function PendingChangesTable2({ zoneChanges, recordChanges }: PendingChangesTable2Props) {
  const { t } = useTranslation()
  const [view, setView] = useState("changes") // "changes", "zones" or "records"
  const [query, setQuery] = useState("")

  // Filter and group all changes by change_uid (from both zone and record changes)
  const visibleChanges = useMemo(() => {
    const grouped = new Map<string, {
      change_uid: string
      type: 'zone' | 'record'
      name: string
      count: number
      changed_by: string
      changed_at: string
    }>()
    
    // Add zone changes
    zoneChanges.forEach(zone => {
      zone.changes.forEach(change => {
        const key = change.change_uid
        if (!grouped.has(key)) {
          grouped.set(key, {
            change_uid: key,
            type: 'zone',
            name: zone.name,
            count: 0,
            changed_by: change.changed_by,
            changed_at: change.changed_at,
          })
        }
        grouped.get(key)!.count++
      })
    })
    
    // Add record changes
    recordChanges.changes.forEach(change => {
      const record = recordChanges.records.find(r => r.uid === change.record_uid)
      const key = change.change_uid
      if (!grouped.has(key)) {
        grouped.set(key, {
          change_uid: key,
          type: 'record',
          name: record?.name || 'Unknown',
          count: 0,
          changed_by: change.changed_by,
          changed_at: change.changed_at,
        })
      } else {
        const existing = grouped.get(key)!
        existing.name = record?.name || existing.name
      }
      grouped.get(key)!.count++
    })
    
    // Filter by query
    const filtered = Array.from(grouped.values()).filter(change =>
      query ? change.name.toLowerCase().includes(query.toLowerCase()) || 
             change.change_uid.toLowerCase().includes(query.toLowerCase()) : true
    )
    
    return filtered
  }, [zoneChanges, recordChanges, query])

  // Filter and group zone changes by change_uid
  const visibleZoneChanges = useMemo(() => {
    const filtered = zoneChanges.filter(change =>
      query ? change.name.toLowerCase().includes(query.toLowerCase()) : true
    )
    
    // Group by change_uid to get one row per change operation
    const grouped = new Map<string, ZoneChanges>()
    
    filtered.forEach(zone => {
      zone.changes.forEach(change => {
        const key = change.change_uid
        if (!grouped.has(key)) {
          grouped.set(key, {
            zone_uid: zone.zone_uid,
            name: zone.name,
            changes: [],
          })
        }
        grouped.get(key)!.changes.push(change)
      })
    })
    
    return Array.from(grouped.values())
  }, [zoneChanges, query])

  // Filter and group record changes by change_uid
  const visibleRecordChanges = useMemo(() => {
    if (!recordChanges) return null
    
    // Filter changes based on query
    const filteredChanges = recordChanges.changes.filter(change => {
      if (!query) return true
      const record = recordChanges.records.find(r => r.uid === change.record_uid)
      return record?.name.toLowerCase().includes(query.toLowerCase()) || 
             String(change.oldvalue).toLowerCase().includes(query.toLowerCase()) ||
             String(change.newvalue).toLowerCase().includes(query.toLowerCase())
    })
    
    // Group by change_uid to get one row per change operation
    const grouped = new Map<string, {
      change_uid: string
      zone_uid: string
      records: Array<{ uid: string; name: string; ttl: number; class: string; a: string }>
      changes: typeof recordChanges.changes
      changed_by: string
      changed_at: string
    }>()
    
    filteredChanges.forEach(change => {
      const key = change.change_uid
      if (!grouped.has(key)) {
        grouped.set(key, {
          change_uid: key,
          zone_uid: recordChanges.zone_uid,
          records: [],
          changes: [],
          changed_by: change.changed_by,
          changed_at: change.changed_at,
        })
      }
      
      const group = grouped.get(key)!
      group.changes.push(change)
      
      // Add unique records affected by this change_uid
      const record = recordChanges.records.find(r => r.uid === change.record_uid)
      if (record && !group.records.find(r => r.uid === record.uid)) {
        group.records.push(record)
      }
    })
    
    return Array.from(grouped.values())
  }, [recordChanges, query])

  const toolbar = (
    <DataTableToolbar
      actions={
        <>
          <label className="sr-only" htmlFor="pendingChanges2-view">{t('navbarTitles.pendingChanges')}</label>
          <select
            id="pendingChanges2-view"
            value={view}
            onChange={e => setView(e.target.value)}
          >
            <option value="changes">Changes</option>
            <option value="zones">Zone Changes</option>
            <option value="records">Record Changes</option>
          </select>
          <DataTableSearch
            label={t('navbarTitles.pendingChanges')}
            value={query}
            onChange={setQuery}
          />
        </>
      }
    >
      {view === "changes" && (
        <DataTableTab count={visibleChanges.length}>Changes</DataTableTab>
      )}
      {view === "zones" && (
        <DataTableTab count={visibleZoneChanges.length}>Zone Changes</DataTableTab>
      )}
      {view === "records" && (
        <DataTableTab count={visibleRecordChanges?.length ?? 0}>Record Changes</DataTableTab>
      )}
    </DataTableToolbar>
  )

  if (view === "changes") {
    return (
      <DataTable
        columns={[
          {
            accessorKey: "change_uid",
            header: "Change ID",
            cell: (info: any) => (
              <Link
                to="/pending-changes/$changeUid"
                params={{ changeUid: info.getValue() as string }}
                className="font-semibold text-sm hover:underline text-blue-600"
              >
                {info.getValue()}
              </Link>
            ),
          },
          {
            accessorKey: "type",
            header: "Type",
            cell: (info: any) => {
              const value = info.getValue()
              return value === 'zone' ? 'Zone' : 'Record'
            },
          },
          {
            accessorKey: "name",
            header: "Name",
            cell: (info: any) => info.getValue(),
          },
          {
            accessorKey: "count",
            header: "Fields Changed",
            cell: (info: any) => info.getValue(),
          },
          {
            accessorKey: "changed_by",
            header: "Changed By",
            cell: (info: any) => info.getValue(),
          },
          {
            accessorKey: "changed_at",
            header: "Changed At",
            cell: (info: any) => info.getValue(),
          },
        ]}
        data={visibleChanges}
        toolbar={toolbar}
        getRowId={(change: any) => change.change_uid}
      />
    )
  }

  if (view === "zones") {
    return (
      <DataTable
        columns={zoneChangesColumns}
        data={visibleZoneChanges}
        toolbar={toolbar}
        getRowId={(change: ZoneChanges) => change.changes[0]?.change_uid || change.zone_uid}
      />
    )
  }

  if (view === "records" && visibleRecordChanges) {
    return (
      <DataTable
        columns={recordChangesColumns}
        data={visibleRecordChanges}
        toolbar={toolbar}
        getRowId={(row: any) => row.change_uid}
      />
    )
  }

  return null
}
