import type { ZoneChanges } from '../types/pendingChanges'
import type { AppFeatures } from "@/components/data-table/features";
import { createColumnHelper } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Link } from "@tanstack/react-router"

function transformDate(date: string) {
    const d = new Date(date)
    const norwegianDate = d.toLocaleDateString('no-NO')
    const norwegianTime = d.toLocaleTimeString('no-NO');
    return norwegianDate + ', ' + norwegianTime;
}

// Zone Changes Columns - One row per change_uid
const zoneHelper = createColumnHelper<AppFeatures, ZoneChanges>()

export const zoneChangesColumns = zoneHelper.columns([
    zoneHelper.accessor('name', {
        header: 'Zone',
        cell: info => (
            <span className="font-semibold text-sm">
                {info.getValue()}
            </span>
        ),
        enableSorting: true,
    }),
    zoneHelper.accessor('changes', {
        header: 'Change ID',
        cell: info => {
            const changes = info.getValue()
            const changeId = changes?.[0]?.change_uid
            if (!changeId) return <span className="text-gray-400 text-sm">—</span>
            
            return (
                <Link
                    to="/pending-changes/$changeUid"
                    params={{ changeUid: changeId }}
                    className="font-semibold text-sm hover:underline text-blue-600"
                >
                    {changeId}
                </Link>
            )
        },
    }),
    zoneHelper.accessor('changes', {
        header: 'Changes',
        cell: info => {
            const changes = info.getValue()
            if (!changes?.length) return <span className="text-gray-400 text-sm">—</span>
            
            return (
                <div className="flex flex-wrap gap-1">
                    {changes.map((change, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                            {change?.field}
                        </Badge>
                    ))}
                </div>
            )
        },
    }),
    zoneHelper.accessor('changes', {
        id: 'changed_by',
        header: 'By',
        cell: info => {
            const changes = info.getValue()
            return changes && changes.length > 0 ? (
                <span className="text-xs truncate max-w-xs">{changes[0]?.changed_by}</span>
            ) : (
                <span className="text-gray-400">—</span>
            )
        },
        enableSorting: false,
    }),
    zoneHelper.accessor('changes', {
        id: 'changed_at',
        header: 'When',
        cell: info => {
            const changes = info.getValue()
            return changes && changes.length > 0 && changes[0]?.changed_at ? (
                <span className="text-xs">{transformDate(changes[0].changed_at)}</span>
            ) : (
                <span className="text-gray-400">—</span>
            )
        },
        enableSorting: true,
    }),
])

// Record Changes Columns - One row per change_uid with affected records grouped
const recordHelper = createColumnHelper<AppFeatures, any>()

export const recordChangesColumns = recordHelper.columns([
    recordHelper.accessor('change_uid', {
        header: 'Change ID',
        cell: info => (
            <Link
                to="/pending-changes/$changeUid"
                params={{ changeUid: info.getValue() }}
                className="font-semibold text-sm hover:underline text-blue-600"
            >
                {info.getValue()}
            </Link>
        ),
        enableSorting: false,
    }),
    recordHelper.accessor('zone_uid', {
        header: 'Zone',
        cell: info => (
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                {info.getValue()}
            </span>
        ),
        enableSorting: false,
    }),
    recordHelper.accessor('records', {
        header: 'Affected Records',
        cell: info => {
            const records = info.getValue()
            if (!records?.length) return <span className="text-gray-400 text-sm">—</span>
            
            const count = records.length
            const preview = records.slice(0, 2).map((r: any) => r?.name).join(', ')
            const more = count > 2 ? ` +${count - 2} more` : ''
            
            return (
                <span className="text-sm truncate max-w-sm">
                    <span className="font-medium">{preview}</span>
                    {more && <span className="text-gray-500">{more}</span>}
                </span>
            )
        },
    }),
    recordHelper.accessor('changes', {
        header: 'Changes',
        cell: info => {
            const changes = info.getValue()
            if (!changes?.length) return <span className="text-gray-400 text-sm">—</span>
            
            // Group by field type for summary
            const fieldCounts = new Map<string, number>()
            changes.forEach((change: any) => {
                const field = change?.field || 'unknown'
                fieldCounts.set(field, (fieldCounts.get(field) || 0) + 1)
            })
            
            return (
                <div className="flex flex-wrap gap-1">
                    {Array.from(fieldCounts).map(([field, count]) => (
                        <Badge key={field} variant="outline" className="text-xs">
                            {field} ×{count}
                        </Badge>
                    ))}
                </div>
            )
        },
    }),
    recordHelper.accessor('changed_by', {
        header: 'By',
        cell: info => {
            const changedBy = info.getValue()
            return changedBy ? (
                <span className="text-xs truncate max-w-xs">{changedBy}</span>
            ) : (
                <span className="text-gray-400">—</span>
            )
        },
        enableSorting: false,
    }),
    recordHelper.accessor('changed_at', {
        header: 'When',
        cell: info => {
            const changedAt = info.getValue()
            return changedAt ? (
                <span className="text-xs">{transformDate(changedAt)}</span>
            ) : (
                <span className="text-gray-400">—</span>
            )
        },
        enableSorting: true,
    }),
])
