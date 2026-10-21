import { createFileRoute } from "@tanstack/react-router"
import { useZone } from "@/features/zones/hooks/useZone"

export const Route = createFileRoute("/_app/zones/$zoneUid")({
  component: ZonePage,
})

function ZonePage() {
  const { zoneUid } = Route.useParams()
  const { data, isPending, error } = useZone(zoneUid)

  if (isPending) return <p>Loading…</p>
  if (error) return <p>{error.message}</p>

  return <h1 className="text-4xl font-medium">{data.name}</h1>
}