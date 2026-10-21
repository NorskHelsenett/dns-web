import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import { Star } from "lucide-react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/_app/my-page")({
  staticData: { crumb: "navbarTitles.myPage" },
  component: MyPage,
});

type ViewKey = "internet" | "helsenett" | "datacenter";

const mockInProgress = [
  {
    url: "vitistack.io",
    unpublishedChangesAmount: 3,
    view: "internet" as ViewKey,
    lastChanged: "08:27",
  },
];

const mockFavoritedZones = [
  { uid: "1", name: "example.no", view: "internet" as ViewKey, favorited: true },
  { uid: "2", name: "example.com", view: "helsenett" as ViewKey, favorited: true, comment: "Dette er en kommentar" },
];
const mockGroups = [
    "R-T1-Internal-Accounts",
    "R-T1-DCN-Admin",
    "R-T1-SDI-Containerdev",
    "A-T1-WinSrv-PAW-RemoteUser",
    "A-T1-TIERBLOCKING-Allroles-Deny",
    "A-T1-SPL-Vitistack-Read",
    "A-T1-Nokkelring-VitiStack-Operator",
    "A-T1-SPL-DC-NAM-Read",
    "A-T1-Flow-DNS-Reverse-ZoneAdmin",
    "A-T1-SPL-DHCP-Read",
    "A-T1-SPL-DC-HEC-Read",
    "A-T1-SCOM-DCN-Operator",
    "A-T1-DCN-NixSrv-LocalAdmin",
    "A-T1-PSKY-vRA-DCN-Members",
    "A-T1-SDI-vRLI-Operators",
    "A-T1-SPL-avi-Read",
    "A-T1-SPL-Skyplattform-Read",
    "A-T0-ADDS-AGPM-DCN-Admin",
    "A-T1-Flow-DNS-DCN-ZoneAdmin",
    "A-T1-SDI-vRA-Service-Broker-Users",
    "A-T1-SDI-vROPS-Content-Admins",
    "A-T1-SDI-vRNI-Administrator",
    "A-T1-ADDNS-SDI-Admin",
    "A-T1-DCN-IPAM-NixSrv-LocalAdmin",
    "A-T1-DCN-Ansible-NixSrv-LocalAdmin",
    "A-T1-Flow-DNS-ZoneAdmin",
    "A-T1-Flow-DNS-ViewZone",
    "A-T1-Flow-DNS-CreateZone",
    "A-T1-SFTP-NixSrv-DCN-LocalUser",
    "A-T1-DCN-NAM-Admin",
    "A-T1-WinSrv-DCN-LocalAdmin",
    "A-T1-ADDS-DCN-Group-Admin",
    "A-T1-ADDS-DCN-Server-Admin",
    "A-T1-ADDS-DCN-OU-Admin",
    "A-T1-ADDS-DCN-ComputerAdmin",
    "A-T1-ADDS-DCN-SAAdmin",
    "A-T1-GitLab-User",
    "A-T1-Puppet-LDP-Developer",
    "A-TX-ADDS-OrphanedComputers-Move",
    "A-T1-NixSrv-DCN-LocalAdmin",
    "A-T1-SPL-F5-Read",
    "A-T1-SPL-DC-Security-Read",
    "A-T1-SPL-DC-Network-Read",
    "A-T1-SPL-DC-FW-Read",
    "A-T1-Nokkelring-DCN-Operator",
    "A-T1-vCenter-DCN-Operator",
    "A-TX-ADDS-DNS-Read",
    "A-T1-DHCP-Admin",
    "A-T1-FILE-ISO_SRV-Modify",
    "A-T1-SDI-Containerdev",
]

function Section({ title, subtext, children }: { title: string; subtext?: string; children: ReactNode }) {
  return (
    <div className="flex w-full flex-col rounded-lg border bg-card">
      <div className="box-padding flex items-center gap-4 border-b">
        <h2>{title}</h2>
        {subtext && <p>{subtext}</p>}
      </div>
      {children}
    </div>
  );
}

const SectionRow = ({ children }: { children: ReactNode }) => (
  <div className="box-padding flex items-center justify-between not-last:border-b">{children}</div>
);

function ViewName({ view }: { view: ViewKey }) {
  const { t } = useTranslation();
  return <>{t(`zones.form.view.field.${view}.title`)}</>;
}

function InProgress() {
  const { t } = useTranslation();
  return (
    <Section
      title={t("myPage.zonesInProgress.title")}
      subtext={t("myPage.zonesInProgress.total", { count: mockInProgress.length })}
    >
      {mockInProgress.map((el) => (
        <SectionRow key={el.url}>
          <div>
            <span className="mr-3 font-bold">{el.url}</span>
            <span className="mx-3 rounded-sm bg-accent-yellow px-2 py-1 font-semibold text-on-yellow">
              {t("myPage.zonesInProgress.unpublishedChanges", { count: el.unpublishedChangesAmount })}
            </span>
            <span className="mx-3"><ViewName view={el.view} /></span>
            <span className="ml-3">{t("myPage.zonesInProgress.lastEdit", { time: el.lastChanged })}</span>
          </div>
          <Button size="lg">{t("myPage.zonesInProgress.reviewAndPublish")}</Button>
        </SectionRow>
      ))}
    </Section>
  );
}

function FavoritedZones() {
  const { t } = useTranslation();
  return (
    <Section title={t("myPage.favoritedZones.title")}>
      {mockFavoritedZones.map((el) => (
        <SectionRow key={el.uid}>
          <div className="flex items-center gap-4">
            <Star className="fill-accent-yellow" />
            <span className="w-56">{el.name}</span>
            <span className="w-56"><ViewName view={el.view} /></span>
            <span className="w-96">{el.comment}</span>
          </div>
        </SectionRow>
      ))}
    </Section>
  );
}

function MyGroups() {
  const { t } = useTranslation();
  return (
    <Section
      title={t("myPage.myGroups.title")}
    >
      {mockGroups.map((el) => (
        <SectionRow key={el}>{el}</SectionRow>
      ))}
    </Section>
  );
}

function MyPage() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-4xl font-medium">{t("navbarTitles.myPage")}</h1>
      <InProgress />
      <FavoritedZones />
      <MyGroups />
    </div>
  );
}