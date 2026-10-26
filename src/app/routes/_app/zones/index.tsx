import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ZonesTable } from "@/features/zones/components/ZonesTable";
import { useZones } from "@/features/zones/hooks/useZones";

export const Route = createFileRoute("/_app/zones/")({
  component: ZonesPage,
});

function ZonesPage() {
  const { t } = useTranslation();
  const { data, isPending, error } = useZones()

  if (isPending) return <p>Loading…</p>;
  if (error) return <p>{error.message}</p>;

  const zones = data.data

  return (
    <div className="page-flex-setup">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-medium">{t("navbarTitles.zones")}</h1>
        <Button size="lg" nativeButton={false} render={<Link to="/zones/new" />}>
          <Plus />
          {t("zones.newZone")}
        </Button>
      </div>
      <ZonesTable zones={zones} />
    </div>
  );
}