import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ZoneTable } from "@/features/zones/components/ZoneTable";
import type { Zone } from "@/features/zones/types/zone";

export const Route = createFileRoute("/_app/zones/")({
  component: ZonesPage,
});

const fakeZones: Zone[] = [
  { uid: "1", name: "example.no", view: "internal", favorited: true },
  { uid: "2", name: "example.com", view: "external", favorited: false, comment: "Dette er en kommentar" },
];

function ZonesPage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-medium">{t("navbarTitles.zones")}</h1>
        <Button size="lg" render={<Link to="/zones/new" />}>
          <Plus />
          {t("zones.newZone")}
        </Button>
      </div>
      <ZoneTable zones={fakeZones} />
    </div>
  );
}