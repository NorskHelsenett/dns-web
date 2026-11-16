import { Badge } from '@/components/ui/badge'
import { fieldChangeColors } from '../utils/env-colors'

/**
 * Displays a single field change with old value → new value
 * Uses color coding: orange for old, green for new
 */
export function FieldChangeBadge({
  field,
  oldValue,
  newValue,
}: {
  field: string
  oldValue: any
  newValue: any
}) {
  return (
    <div className="flex items-center gap-2 px-2 py-1 bg-gray-50 border border-gray-200 rounded">
      <span className="font-medium text-sm text-gray-700 min-w-[60px]">{field}</span>
      <div className="flex items-center gap-1">
        <span
          className="px-2 py-0.5 rounded text-xs font-mono"
          style={fieldChangeColors('old')}
        >
          {String(oldValue)}
        </span>
        <span className="text-gray-400 text-sm">→</span>
        <span
          className="px-2 py-0.5 rounded text-xs font-mono"
          style={fieldChangeColors('new')}
        >
          {String(newValue)}
        </span>
      </div>
    </div>
  )
}

/**
 * Displays multiple field changes in a compact vertical layout
 */
export function FieldChangesGroup({
  changes,
}: {
  changes: Array<{ field: string; oldValue: any; newValue: any }>
}) {
  if (changes.length === 0) return <span className="text-gray-400">No changes</span>

  return (
    <div className="flex flex-col gap-2">
      {changes.map((change) => (
        <FieldChangeBadge
          key={change.field}
          field={change.field}
          oldValue={change.oldValue}
          newValue={change.newValue}
        />
      ))}
    </div>
  )
}

/**
 * Displays a DNS record in a compact badge format
 * Shows record name and IP address
 */
export function RecordBadge({
  name,
  ip,
  className,
}: {
  name: string
  ip: string
  className?: string
}) {
  return (
    <Badge variant="secondary" className={className}>
      <span className="font-medium">{name}</span>
      <span className="text-gray-500 ml-1">({ip})</span>
    </Badge>
  )
}

/**
 * Displays multiple records in a compact layout
 */
export function RecordsGroup({
  records,
}: {
  records: Array<{ name: string; ip: string; uid: string }>
}) {
  if (records.length === 0) return <span className="text-gray-400">No records</span>

  return (
    <div className="flex flex-wrap gap-2">
      {records.map((record) => (
        <RecordBadge key={record.uid} name={record.name} ip={record.ip} />
      ))}
    </div>
  )
}

/**
 * Displays a single change in the Changes column
 * Shows the field and old → new values in a compact format
 */
function ChangeItem({
  field,
  oldValue,
  newValue,
}: {
  field: string
  oldValue: any
  newValue: any
}) {
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-gray-200 bg-white text-sm whitespace-nowrap">
      <span className="font-semibold text-gray-700">{field}:</span>
      <span
        className="px-1.5 py-0 rounded text-xs font-mono font-medium"
        style={fieldChangeColors('old')}
      >
        {String(oldValue)}
      </span>
      <span className="text-gray-400">→</span>
      <span
        className="px-1.5 py-0 rounded text-xs font-mono font-medium"
        style={fieldChangeColors('new')}
      >
        {String(newValue)}
      </span>
    </div>
  )
}

/**
 * Displays multiple changes in a compact horizontal layout
 * Used in tables where space is limited
 */
export function ChangesGroup({
  changes,
}: {
  changes: Array<{ field: string; oldValue: any; newValue: any }>
}) {
  if (changes.length === 0) return <span className="text-gray-400 text-sm">No changes</span>

  return (
    <div className="flex flex-wrap gap-2">
      {changes.map((change) => (
        <ChangeItem
          key={change.field}
          field={change.field}
          oldValue={change.oldValue}
          newValue={change.newValue}
        />
      ))}
    </div>
  )
}
