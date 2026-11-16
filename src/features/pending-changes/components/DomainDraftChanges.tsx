"use client"

/**
 * zone-change-diff.tsx
 *
 * Side-by-side and unified review of a draft change to a zone, built on the API
 * types ZoneChanges / ZoneChange / RecordChanges / RecordChange / Record.
 *
 * shadcn/ui pieces used:
 *   npx shadcn@latest add badge checkbox label toggle-group
 *
 * Exports:
 *   ChangeDiff       the whole box (summary, controls, zone settings, records)
 *   ChangeRow        one record row, in "split" or "unified" layout
 *   ZoneChangeRow    one zone-setting row, in "split" or "unified" layout
 *   buildRecordRows  (RecordChanges + optional context records) -> rows
 *   buildZoneRows    ZoneChanges -> rows
 *
 * HOW THE API DATA IS READ (confirm these against the backend):
 *
 *  1. The API sends a flat audit log of field changes, not added/removed sets.
 *     Several entries for the same field are collapsed to one net change
 *     (first oldvalue -> last newvalue, ordered by changed_at). a -> b -> a is
 *     dropped as a no-op.
 *
 *  2. Before/after versions of a record are built by laying oldvalue / newvalue
 *     from the changes over `records[]`. So it doesn't matter whether
 *     `records[]` holds the live or the draft state of a record.
 *
 *  3. ASSUMPTION: there is no explicit "added"/"removed" in the API. A record is
 *     treated as ADDED when its `name` goes from null/undefined to a value, and
 *     as REMOVED when its `name` goes to null/undefined. Everything else with
 *     changes is CHANGED.
 *
 *  4. A record in `records[]` with no changes is shown as unchanged context.
 *     The API only sends changed records, so to get real "unchanged records"
 *     context, pass the zone's current live records as `contextRecords`.
 *
 *  5. Fields that the cells don't have a column for (anything except name,
 *     class, ttl and the value fields) are listed as text under the row so
 *     they are never silently hidden.
 */

import * as React from "react"


import { cn }  from "cn"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ToggleGroup } from "@/components/ui/toggle-group"
import {Toggle as ToggleGroupItem} from "@/components/ui/toggle"

// Adjust this path to wherever your API types live.
// `Record` is imported under another name: a type called `Record` shadows
// TypeScript's built-in Record<K, V> in any file that imports it unaliased.
import type {
  Record as ZoneRecord,
  RecordChange,
  RecordChanges,
  ZoneChange,
  ZoneChanges,
} from "@/features/pending-changes/types/pendingChanges"

/* ========================================================================== */
/* NEW TYPES (not in the API types)                                           */
/* ========================================================================== */

/** NEW (UI only) A record as shown in a cell. Partial: some data may be absent. */
export type RecordView = Partial<ZoneRecord>

/** NEW (UI only) "same" = a record the draft doesn't touch. */
export type DiffKind = "same" | "added" | "removed" | "changed"

/** NEW (UI only) */
export type DiffLayout = "split" | "unified"

/** NEW (UI only) One field's net change after collapsing audit entries. */
export interface FieldChange {
  field: string
  from: unknown
  to: unknown
  /** Everyone who touched the field. */
  by: string[]
  /** Timestamp of the latest entry. */
  at: string
}

/** NEW (UI only) One record row. */
export interface DiffRow {
  scope: "record"
  /** Record uid. */
  key: string
  kind: DiffKind
  /** Record as it is in live. Missing for "added". */
  before?: RecordView
  /** Record as it would be after the merge. Missing for "removed". */
  after?: RecordView
  /** For "changed" rows: fields that differ, used to highlight them. */
  changedFields?: ReadonlySet<string>
  /** Changed fields that have no column in the cell. */
  extras?: FieldChange[]
  by?: string[]
  at?: string
  /** Shown under the row. Set via the getConflict prop. */
  conflict?: string
}

/** NEW (UI only) One zone-setting row (default_ttl, negative_ttl, ...). */
export interface ZoneDiffRow {
  scope: "zone"
  /** Field name. */
  key: string
  kind: Exclude<DiffKind, "same">
  field: string
  from: unknown
  to: unknown
  by: string[]
  at: string
  conflict?: string
}

/* ========================================================================== */
/* Helpers                                                                    */
/* ========================================================================== */

/**
 * The fields that carry a record's value, in the order they're looked up. The
 * API's Record type only has `a` for now. When it gets `aaaa`, `cname`, ... add
 * them here (and to the Record type) and the type label follows automatically.
 */
const VALUE_FIELDS = ["a"] as const

const DISPLAY_FIELDS = new Set<string>([
  "uid",
  "name",
  "class",
  "ttl",
  ...VALUE_FIELDS,
])

type AuditEntry = Pick<
  ZoneChange,
  "field" | "oldvalue" | "newvalue" | "changed_by" | "changed_at"
>

const isNil = (v: unknown) => v === null || v === undefined

const sameValue = (a: unknown, b: unknown) =>
  a === b || (isNil(a) && isNil(b)) || JSON.stringify(a) === JSON.stringify(b)

const fmt = (v: unknown) =>
  isNil(v)
    ? "—"
    : v === ""
      ? '""'
      : typeof v === "object"
        ? JSON.stringify(v)
        : String(v)

// Fixed locale and zone so server and client render the same text.
const whenFormat = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "UTC",
})

function formatWhen(iso: string) {
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? iso : `${whenFormat.format(d)} UTC`
}

const metaOf = (by?: string[], at?: string) =>
  by && by.length > 0 && at ? `${by.join(", ")} · ${formatWhen(at)}` : undefined

/** Collapses audit entries into one net change per field. */
export function netFieldChanges(entries: AuditEntry[]): FieldChange[] {
  const sorted = [...entries].sort((a, b) =>
    a.changed_at < b.changed_at ? -1 : a.changed_at > b.changed_at ? 1 : 0
  )

  // One pass, no array indexing (safe with noUncheckedIndexedAccess):
  // `from` is the first entry's oldvalue, `to` the latest entry's newvalue.
  const byField = new Map<
    string,
    { from: unknown; to: unknown; by: Set<string>; at: string }
  >()
  for (const e of sorted) {
    const cur = byField.get(e.field)
    if (cur) {
      cur.to = e.newvalue
      cur.at = e.changed_at
      if (e.changed_by) cur.by.add(e.changed_by)
    } else {
      byField.set(e.field, {
        from: e.oldvalue,
        to: e.newvalue,
        by: new Set(e.changed_by ? [e.changed_by] : []),
        at: e.changed_at,
      })
    }
  }

  const out: FieldChange[] = []
  for (const [field, c] of byField) {
    if (sameValue(c.from, c.to)) continue
    out.push({ field, from: c.from, to: c.to, by: [...c.by], at: c.at })
  }
  return out
}

function typeOf(rec: RecordView): { type: string; value?: string } {
  const field = VALUE_FIELDS.find((f) => !isNil(rec[f]))
  return field
    ? { type: field.toUpperCase(), value: rec[field] }
    : { type: "—" }
}

const collator = new Intl.Collator("en", { numeric: true })

function compareRows(a: DiffRow, b: DiffRow) {
  const ra: RecordView = a.before ?? a.after ?? {}
  const rb: RecordView = b.before ?? b.after ?? {}
  return (
    collator.compare(ra.name ?? "", rb.name ?? "") ||
    collator.compare(typeOf(ra).type, typeOf(rb).type) ||
    collator.compare(typeOf(ra).value ?? "", typeOf(rb).value ?? "")
  )
}

/* ========================================================================== */
/* Building rows                                                              */
/* ========================================================================== */

function makeRecordRow(
  uid: string,
  base: ZoneRecord | undefined,
  fields: FieldChange[]
): DiffRow | undefined {
  if (fields.length === 0) {
    return base
      ? { scope: "record", key: uid, kind: "same", before: base, after: base }
      : undefined
  }

  // Lay old/new values over the record data.
  const before: Record<string, unknown> = { ...base, uid }
  const after: Record<string, unknown> = { ...base, uid }
  for (const f of fields) {
    before[f.field] = f.from
    after[f.field] = f.to
  }

  const nameChange = fields.find((f) => f.field === "name")
  const kind: DiffKind =
    nameChange && isNil(nameChange.from)
      ? "added"
      : nameChange && isNil(nameChange.to)
        ? "removed"
        : "changed"

  const extras = fields.filter((f) => !DISPLAY_FIELDS.has(f.field))

  return {
    scope: "record",
    key: uid,
    kind,
    before: kind === "added" ? undefined : (before as RecordView),
    after: kind === "removed" ? undefined : (after as RecordView),
    changedFields:
      kind === "changed" ? new Set(fields.map((f) => f.field)) : undefined,
    extras: extras.length > 0 ? extras : undefined,
    by: [...new Set(fields.flatMap((f) => f.by))],
    at: fields.reduce((max, f) => (f.at > max ? f.at : max), ""),
  }
}

/**
 * @param recordChanges  response of the "record changes for one zone" endpoint
 * @param contextRecords optional: the zone's current live records, used only to
 *                       show unchanged context rows ("Show unchanged records")
 */
export function buildRecordRows(
  recordChanges?: RecordChanges | null,
  contextRecords?: ZoneRecord[] | null
): DiffRow[] {
  const entries = new Map<string, RecordChange[]>()
  for (const c of recordChanges?.changes ?? []) {
    const list = entries.get(c.record_uid)
    if (list) list.push(c)
    else entries.set(c.record_uid, [c])
  }

  const records = new Map((recordChanges?.records ?? []).map((r) => [r.uid, r]))
  // Every record the response mentions, as data or in a change.
  const uids = new Set([...records.keys(), ...entries.keys()])

  const rows: DiffRow[] = []
  for (const uid of uids) {
    const row = makeRecordRow(
      uid,
      records.get(uid),
      netFieldChanges(entries.get(uid) ?? [])
    )
    if (row) rows.push(row)
  }

  for (const rec of contextRecords ?? []) {
    if (!uids.has(rec.uid)) {
      rows.push({
        scope: "record",
        key: rec.uid,
        kind: "same",
        before: rec,
        after: rec,
      })
    }
  }

  return rows.sort(compareRows)
}

/** @param zoneChanges  ONE zone's entry from the "zone changes" endpoint */
export function buildZoneRows(zoneChanges?: ZoneChanges | null): ZoneDiffRow[] {
  return netFieldChanges(zoneChanges?.changes ?? [])
    .map(
      (f): ZoneDiffRow => ({
        scope: "zone",
        key: f.field,
        kind: isNil(f.from) ? "added" : isNil(f.to) ? "removed" : "changed",
        field: f.field,
        from: f.from,
        to: f.to,
        by: f.by,
        at: f.at,
      })
    )
    .sort((a, b) => collator.compare(a.field, b.field))
}

/* ========================================================================== */
/* Shared cell styling                                                        */
/* ========================================================================== */

type CellTone = "same" | "added" | "removed" | "empty"

const toneClasses: Record<CellTone, string> = {
  same: "bg-white",
  // Blue and orange instead of green and red: easier to tell apart with
  // colour-vision deficiency. The +/- signs and labels carry the meaning too.
  added: "bg-blue-100 text-blue-950 dark:bg-blue-950/60 dark:text-blue-100",
  removed:
    "bg-orange-100 text-orange-950 dark:bg-orange-950/60 dark:text-orange-100",
  empty: "bg-muted/50",
}

// Stronger tint on the individual fields that changed (like word-level diff).
const fieldHighlight: Record<CellTone, string> = {
  same: "",
  empty: "",
  added: "-mx-1 rounded bg-blue-300/70 px-1 font-semibold dark:bg-blue-700/60",
  removed:
    "-mx-1 rounded bg-orange-300/70 px-1 font-semibold dark:bg-orange-700/60",
}

const sign: Record<CellTone, string> = {
  same: "",
  empty: "",
  added: "+",
  removed: "−",
}

// Static strings so Tailwind can see them.
const RECORD_GRID =
  "grid grid-cols-[1rem_4.5rem_minmax(0,1fr)_minmax(0,1fr)_3.75rem] items-center gap-x-3"
const RECORD_GRID_LABEL =
  "grid grid-cols-[1rem_4.5rem_minmax(0,1fr)_minmax(0,1fr)_3.75rem_4.5rem] items-center gap-x-3"
const ZONE_GRID =
  "grid grid-cols-[1rem_minmax(0,1fr)_minmax(0,1fr)] items-center gap-x-3"
const ZONE_GRID_LABEL =
  "grid grid-cols-[1rem_minmax(0,1fr)_minmax(0,1fr)_4.5rem] items-center gap-x-3"

const conflictBadge =
  "border-amber-500 bg-amber-100 text-amber-950 dark:bg-amber-900/50 dark:text-amber-100"

interface NotesProps {
  conflict?: string
  extras?: string[]
  meta?: string
}

/** Lines under a cell: conflict, fields without a column, who and when. */
function Notes({ conflict, extras, meta }: NotesProps) {
  if (!conflict && !extras?.length && !meta) return null
  return (
    <div className="flex flex-col gap-1 pl-7 text-xs leading-snug">
      {conflict && (
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className={conflictBadge}>
            Conflict
          </Badge>
          <span>{conflict}</span>
        </div>
      )}
      {extras?.map((e) => (
        <span key={e} className="break-all font-mono">
          {e}
        </span>
      ))}
      {meta && <span className="opacity-80">{meta}</span>}
    </div>
  )
}

function EmptyCell() {
  return <div aria-hidden="true" className={cn("min-h-11", toneClasses.empty)} />
}

const cellBox = "flex min-h-11 flex-col justify-center gap-1 px-4 py-1.5"

/* ========================================================================== */
/* Record cell + ChangeRow                                                    */
/* ========================================================================== */

interface RecordCellProps {
  tone: CellTone
  record?: RecordView
  highlight?: ReadonlySet<string>
  /** "Added", "Removed", "Before", "After". Screen-reader only unless labelVisible. */
  label?: string
  labelVisible?: boolean
  notes?: NotesProps
}

function RecordCell({
  tone,
  record,
  highlight,
  label,
  labelVisible,
  notes,
}: RecordCellProps) {
  if (tone === "empty" || !record) return <EmptyCell />

  const hl = (hit: boolean) => (hit ? fieldHighlight[tone] : undefined)
  const { type, value } = typeOf(record)
  const typeText = [record.class?.toUpperCase(), type].filter(Boolean).join(" ")

  return (
    <div className={cn(cellBox, toneClasses[tone])}>
      <div className={labelVisible ? RECORD_GRID_LABEL : RECORD_GRID}>
        <span aria-hidden="true" className="font-mono text-base font-semibold">
          {sign[tone]}
        </span>

        <span
          className={cn(
            "w-fit max-w-full text-[11px] font-semibold tracking-wide",
            tone === "same" && "text-muted-foreground",
            hl(!!highlight?.has("class"))
          )}
        >
          {label && !labelVisible && <span className="sr-only">{label}: </span>}
          {typeText}
        </span>

        <span
          className={cn(
            "w-fit max-w-full break-all font-mono text-sm",
            hl(!!highlight?.has("name"))
          )}
        >
          {record.name ?? "—"}
        </span>

        <span
          className={cn(
            "w-fit max-w-full break-all font-mono text-sm font-medium",
            hl(VALUE_FIELDS.some((f) => highlight?.has(f)))
          )}
        >
          {value ?? "—"}
        </span>

        <span
          className={cn(
            "w-fit max-w-full justify-self-end text-xs",
            tone === "same" && "text-muted-foreground",
            hl(!!highlight?.has("ttl"))
          )}
        >
          <span className="sr-only">TTL </span>
          {record.ttl !== undefined && record.ttl !== null
            ? `${record.ttl}s`
            : "—"}
        </span>

        {labelVisible && (
          <span className="text-right text-xs font-semibold">{label}</span>
        )}
      </div>

      {notes && <Notes {...notes} />}
    </div>
  )
}

function describeExtra(kind: DiffKind, e: FieldChange) {
  if (kind === "added") return `${e.field}: ${fmt(e.to)}`
  if (kind === "removed") return `${e.field}: ${fmt(e.from)}`
  return `${e.field}: ${fmt(e.from)} → ${fmt(e.to)}`
}

export function ChangeRow({
  row,
  layout,
}: {
  row: DiffRow
  layout: DiffLayout
}) {
  const { kind, before, after, changedFields, conflict } = row
  const isSame = kind === "same"

  const notes: NotesProps = {
    conflict,
    extras: row.extras?.map((e) => describeExtra(kind, e)),
    meta: isSame ? undefined : metaOf(row.by, row.at),
  }

if (layout === "split") {
    // changed = two grid rows: old on the left, new on the right underneath
    if (kind === "changed") {
      return (
        <li className="border-b last:border-b-0">
          <div className="grid grid-cols-2 divide-x border-b">
            <RecordCell
              tone="removed"
              record={before}
              highlight={changedFields}
              label="Before"
            />
            <EmptyCell />
          </div>
          <div className="grid grid-cols-2 divide-x">
            <EmptyCell />
            <RecordCell
              tone="added"
              record={after}
              highlight={changedFields}
              label="After"
              notes={notes}
            />
          </div>
        </li>
      )
    }

    // same / added / removed: one row, as before
    const left: RecordCellProps =
      kind === "added"
        ? { tone: "empty" }
        : {
            tone: isSame ? "same" : "removed",
            record: before,
            label: kind === "removed" ? "Removed" : undefined,
          }

    const right: RecordCellProps =
      kind === "removed"
        ? { tone: "empty" }
        : {
            tone: isSame ? "same" : "added",
            record: after,
            label: kind === "added" ? "Added" : undefined,
          }

    // Notes go once, on the side that carries the change.
    const onLeft = kind === "removed"
    return (
      <li className="grid grid-cols-2 divide-x border-b last:border-b-0">
        <RecordCell {...left} notes={onLeft ? notes : undefined} />
        <RecordCell {...right} notes={onLeft ? undefined : notes} />
      </li>
    )
  }

  // unified
  return (
    <li className="border-b last:border-b-0">
      {isSame && (
        <RecordCell tone="same" record={before} labelVisible notes={notes} />
      )}
      {kind === "removed" && (
        <RecordCell
          tone="removed"
          record={before}
          label="Removed"
          labelVisible
          notes={notes}
        />
      )}
      {kind === "added" && (
        <RecordCell
          tone="added"
          record={after}
          label="Added"
          labelVisible
          notes={notes}
        />
      )}
      {kind === "changed" && (
        <>
          <RecordCell
            tone="removed"
            record={before}
            highlight={changedFields}
            label="Before"
            labelVisible
          />
          <RecordCell
            tone="added"
            record={after}
            highlight={changedFields}
            label="After"
            labelVisible
            notes={notes}
          />
        </>
      )}
    </li>
  )
}

/* ========================================================================== */
/* Zone-setting cell + ZoneChangeRow                                          */
/* ========================================================================== */

interface ZoneCellProps {
  tone: CellTone
  field: string
  value: unknown
  label?: string
  labelVisible?: boolean
  notes?: NotesProps
}

function ZoneCell({
  tone,
  field,
  value,
  label,
  labelVisible,
  notes,
}: ZoneCellProps) {
  if (tone === "empty") return <EmptyCell />

  return (
    <div className={cn(cellBox, toneClasses[tone])}>
      <div className={labelVisible ? ZONE_GRID_LABEL : ZONE_GRID}>
        <span aria-hidden="true" className="font-mono text-base font-semibold">
          {sign[tone]}
        </span>
        <span className="min-w-0 break-all font-mono text-sm">
          {label && !labelVisible && <span className="sr-only">{label}: </span>}
          {field}
        </span>
        <span className="min-w-0 break-all font-mono text-sm font-semibold">
          {fmt(value)}
        </span>
        {labelVisible && (
          <span className="text-right text-xs font-semibold">{label}</span>
        )}
      </div>
      {notes && <Notes {...notes} />}
    </div>
  )
}

export function ZoneChangeRow({
  row,
  layout,
}: {
  row: ZoneDiffRow
  layout: DiffLayout
}) {
  const { kind, field, from, to } = row
  const notes: NotesProps = {
    conflict: row.conflict,
    meta: metaOf(row.by, row.at),
  }

   if (layout === "split") {
    // changed = two grid rows: old value on the left, new value underneath on the right
    if (kind === "changed") {
      return (
        <li className="border-b last:border-b-0">
          <div className="grid grid-cols-2 divide-x border-b">
            <ZoneCell tone="removed" field={field} value={from} label="Before" />
            <EmptyCell />
          </div>
          <div className="grid grid-cols-2 divide-x">
            <EmptyCell />
            <ZoneCell
              tone="added"
              field={field}
              value={to}
              label="After"
              notes={notes}
            />
          </div>
        </li>
      )
    }

    // added (right side) or removed (left side): one row
    return (
      <li className="grid grid-cols-2 divide-x border-b last:border-b-0">
        {kind === "added" ? (
          <EmptyCell />
        ) : (
          <ZoneCell tone="removed" field={field} value={from} label="Removed" notes={notes} />
        )}
        {kind === "removed" ? (
          <EmptyCell />
        ) : (
          <ZoneCell tone="added" field={field} value={to} label="Added" notes={notes} />
        )}
      </li>
    )
  }

  return (
    <li className="border-b last:border-b-0">
      {kind !== "added" && (
        <ZoneCell
          tone="removed"
          field={field}
          value={from}
          label={kind === "changed" ? "Before" : "Removed"}
          labelVisible
          notes={kind === "removed" ? notes : undefined}
        />
      )}
      {kind !== "removed" && (
        <ZoneCell
          tone="added"
          field={field}
          value={to}
          label={kind === "changed" ? "After" : "Added"}
          labelVisible
          notes={notes}
        />
      )}
    </li>
  )
}

/* ========================================================================== */
/* ChangeDiff: the whole box                                                  */
/* ========================================================================== */

export interface ChangeDiffProps {
  /** ONE zone's entry from the "zone changes" endpoint. Optional, may be null. */
  zoneChanges?: ZoneChanges | null
  /** Response of the "record changes for one zone" endpoint. Optional, may be null. */
  recordChanges?: RecordChanges | null
  /**
   * Optional: the zone's current live records. Only used to fill the
   * "Show unchanged records" context; the API itself only sends changed records.
   */
  contextRecords?: ZoneRecord[] | null
  /**
   * Optional: flag rows that conflict with something else. Return the
   * explanation, or undefined for no conflict. Wrap in useCallback to avoid
   * recomputing rows on every render.
   */
  getConflict?: (row: DiffRow | ZoneDiffRow) => string | undefined
  defaultLayout?: DiffLayout
  className?: string
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <p className="border-b bg-muted/30 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      {children}
    </p>
  )
}

export function ChangeDiff({
  zoneChanges,
  recordChanges,
  contextRecords,
  getConflict,
  defaultLayout = "split",
  className,
}: ChangeDiffProps) {
  const [layout, setLayout] = React.useState<DiffLayout>(defaultLayout)
  const [showUnchanged, setShowUnchanged] = React.useState(true)

  const zoneRows = React.useMemo(
    () =>
      buildZoneRows(zoneChanges).map((r) => ({
        ...r,
        conflict: getConflict?.(r),
      })),
    [zoneChanges, getConflict]
  )

  const rows = React.useMemo(
    () =>
      buildRecordRows(recordChanges, contextRecords).map((r) => ({
        ...r,
        conflict: getConflict?.(r),
      })),
    [recordChanges, contextRecords, getConflict]
  )

  const counts = React.useMemo(() => {
    const c = { added: 0, removed: 0, changed: 0, same: 0, conflicts: 0 }
    for (const r of rows) {
      c[r.kind]++
      if (r.conflict) c.conflicts++
    }
    for (const r of zoneRows) if (r.conflict) c.conflicts++
    return c
  }, [rows, zoneRows])

  const visible = showUnchanged ? rows : rows.filter((r) => r.kind !== "same")
  const hiddenCount = showUnchanged ? 0 : counts.same
  const zoneName = zoneChanges?.name ?? recordChanges?.zone_uid ?? "zone"

  return (
    <section
      aria-label={`Changes for ${zoneName}`}
      className={cn("flex flex-col gap-4", className)}
    >
    {/* Summary strip */}
    <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
        {zoneRows.length > 0 && (
          <Badge variant="secondary">
            {zoneRows.length} zone {zoneRows.length === 1 ? "setting" : "settings"}
          </Badge>
        )}
        {counts.added > 0 && (
          <Badge className="bg-blue-100 text-blue-950 hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-100">
            +{counts.added} added
          </Badge>
        )}
        {counts.removed > 0 && (
          <Badge className="bg-orange-100 text-orange-950 hover:bg-orange-100 dark:bg-orange-950/60 dark:text-orange-100">
            {"−"}
            {counts.removed} removed
          </Badge>
        )}
        {counts.changed > 0 && (
          <Badge variant="secondary">{counts.changed} changed</Badge>
        )}
        {counts.same > 0 && (
          <Badge variant="secondary">{counts.same} unchanged</Badge>
        )}
        {counts.conflicts > 0 && (
          <Badge className="bg-amber-200 text-amber-950 hover:bg-amber-200 dark:bg-amber-900/60 dark:text-amber-100">
            {counts.conflicts} {counts.conflicts === 1 ? "conflict" : "conflicts"}
          </Badge>
        )}
        </div>
            <ToggleGroup
              value={[layout]}
              onValueChange={(v) => v && v.length > 0 && setLayout(v[0] as DiffLayout)}
              aria-label="Diff layout"
            >
            <ToggleGroupItem value="split" className="min-h-11 px-4">
              Side by side
            </ToggleGroupItem>
            <ToggleGroupItem value="unified" className="min-h-11 px-4">
              Unified
            </ToggleGroupItem>
          </ToggleGroup>
        <div>

         {(counts.same > 0 || !showUnchanged) && (
             <div className="flex items-center gap-2.5">
            <Checkbox
              id="show-unchanged"
              checked={showUnchanged}
              onCheckedChange={(c) => setShowUnchanged(c === true)}
              />
            <Label
              htmlFor="show-unchanged"
              className="min-h-11 cursor-pointer items-center"
              >
              Show unchanged records
            </Label>
          </div>
        )}
        </div>
      </div>

     
      {/* The box */}
      <div className="overflow-hidden rounded-xl border bg-card">
        <div className="overflow-x-auto">
          <div className={layout === "split" ? "min-w-[880px]" : "min-w-[600px]"}>
            {layout === "split" ? (
              <div className="grid grid-cols-2 divide-x border-b bg-muted/60">
                <p className="px-4 py-3 text-sm font-semibold">Live</p>
                <p className="px-4 py-3 text-sm font-semibold">Draft</p>
              </div>
            ) : (
              <p className="border-b bg-muted/60 px-4 py-3 text-sm font-semibold">
                Changes from live to draft
              </p>
            )}

            {zoneRows.length > 0 && (
              <>
                <SectionHeader>Zone settings</SectionHeader>
                <ul aria-label="Zone setting changes">
                  {zoneRows.map((row) => (
                    <ZoneChangeRow key={row.key} row={row} layout={layout} />
                  ))}
                </ul>
              </>
            )}

            {(visible.length > 0 || hiddenCount > 0) && (
              <>
                <SectionHeader>Records</SectionHeader>
                {hiddenCount > 0 && (
                  <div className="flex min-h-11 flex-wrap items-center justify-between gap-2 border-b bg-muted/30 px-4 text-sm text-muted-foreground">
                    <span>{hiddenCount} unchanged records hidden</span>
                    <button
                      type="button"
                      onClick={() => setShowUnchanged(true)}
                      className="min-h-11 px-1 font-semibold text-primary underline underline-offset-2"
                    >
                      Show unchanged
                    </button>
                  </div>
                )}
                <ul aria-label="Record changes">
                  {visible.map((row) => (
                    <ChangeRow key={row.key} row={row} layout={layout} />
                  ))}
                </ul>
              </>
            )}

            {zoneRows.length === 0 && rows.length === 0 && (
              <p className="px-4 py-6 text-sm text-muted-foreground">
                No changes in this draft.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ========================================================================== */
/* Usage                                                                      */
/* ========================================================================== */
/*
// zoneChanges: pick this zone's entry from the "zone changes" endpoint array
// recordChanges: response of the "record changes for one zone" endpoint
<ChangeDiff zoneChanges={zoneChanges} recordChanges={recordChanges} />

// with real unchanged context from the zone's normal records endpoint:
<ChangeDiff zoneChanges={zoneChanges} recordChanges={recordChanges} contextRecords={zoneRecords} />
*/
