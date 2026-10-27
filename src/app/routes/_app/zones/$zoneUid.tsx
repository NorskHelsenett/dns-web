import { createFileRoute } from "@tanstack/react-router"
import { useZone } from "@/features/zones/hooks/useZone"
import { zoneQueryOptions } from "@/features/zones/api/queries";
import { Star } from "lucide-react";
import { cn } from "cn";
import { RecordsTable } from "@/features/records/components/RecordsTable";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/_app/zones/$zoneUid")({
  staticData: { crumb: "zones.zone" },
  loader: async ({ context: { queryClient }, params }) => {
    try {
      const zone = await queryClient.fetchQuery(zoneQueryOptions(params.zoneUid));
      return { crumb: zone.name };
    } catch {
      return undefined;
    }
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
  const { t } = useTranslation();
  const { zoneUid } = Route.useParams()
  const { data: zone, isPending, error } = useZone(zoneUid)

  if (isPending) return <p>{t("general.loading")}</p>
  if (error) return <p>{error.message}</p>

  return (
    <div className="page-flex-setup">
      <div className="flex items-center gap-4">
        <Star />
        <h1 className="text-4xl font-medium">{zone.name}</h1>
      </div>
      <div className="flex gap-12">
        <ZoneInfo
          title={t("zones.detail.status")}
          value={t("zones.detail.notAvailable")}
        />
        <ZoneInfo
          title={t("zones.detail.ttl")}
          value={t("zones.detail.notAvailable")}
        />
        <ZoneInfo title={t("zones.detail.view")} value={zone.view} />
        <ZoneInfo
          title={t("zones.detail.description")}
          value={zone.comment || t("zones.detail.noDescription")}
        />
      </div>
      <RecordsTable records={zone.records} />
    </div>
  )
}