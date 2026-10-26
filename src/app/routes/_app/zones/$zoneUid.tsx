import { createFileRoute } from "@tanstack/react-router"
import { useZone } from "@/features/zones/hooks/useZone"
import { zoneQueryOptions } from "@/features/zones/api/queries";
import { noop } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { recordValue } from "@/features/records/utils/recordValue";
import { cn } from "cn";

export const Route = createFileRoute("/_app/zones/$zoneUid")({
  loader: ({ context: { queryClient }, params }) => {
    queryClient.query(zoneQueryOptions(params.zoneUid)).catch(noop);
  },
  component: ZonePage,
})

const ZoneInfo = ({ title, value, className }: { title: string, value: string, className?: string}) => (
  <div className={cn(className)}>
    <div className="text-sm text-gray-700">{title}</div>
    <div>{value}</div>
  </div>
)

function ZonePage() {
  const { zoneUid } = Route.useParams()
  const { data: zone, isPending, error } = useZone(zoneUid)

  if (isPending) return <p>Loading...</p>
  if (error) return <p>{error.message}</p>

  return (
    <div className="page-flex-setup">
      <div className="flex items-center gap-4">
        <Star />
        <h1 className="text-4xl font-medium">{zone.name}</h1>
      </div>
      <div className="flex gap-12">
        <ZoneInfo title="Status" value="*status here*" />
        <ZoneInfo title="TTL" value="*ttl here*" />
        <ZoneInfo title="View" value={zone.view} />
        <ZoneInfo title="Description" value={zone.comment || "No description"} className="col-span-2" />
      </div>
      <ul>
        {zone.records.map((r) => (
          <li key={r.uid}>
            {r.name} | {r.rrtype} | {r.ttl} | {recordValue(r)}
          </li>
        ))}
      </ul>

      <pre className="text-xs">{JSON.stringify(zone.records, null, 2)}</pre>
    </div>
  )
}