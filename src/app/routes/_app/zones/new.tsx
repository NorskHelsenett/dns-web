import { ZoneForm } from "@/features/zones/components/ZoneForm";
import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/_app/zones/new")({
  staticData: { crumb: "zones.newZone" },
  component: NewZonePage,
});

function NewZonePage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-4xl font-medium">{t("zones.newZone")}</h1>
      <ZoneForm /> 
    </div>
  );
}