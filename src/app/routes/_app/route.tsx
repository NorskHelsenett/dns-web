import { createFileRoute, Outlet, useMatches } from "@tanstack/react-router";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Navbar } from "@/components/layouts/Navbar";
import Header from "@/components/layouts/Header";
import type { ReactElement } from "react";
import i18n from "i18next";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout(): ReactElement {
  const matches = useMatches();

  const breadcrumbs = matches.flatMap((match) => {
    const dynamic = (match.loaderData as { crumb?: string } | undefined)?.crumb;
    const staticKey = match.staticData?.crumb;
    const title = dynamic ?? (staticKey ? i18n.t(staticKey) : undefined);
    return title ? [{ title, url: match.pathname }] : [];
  });
  return (
    <SidebarProvider>
      <Navbar />
      <SidebarInset>
        <Header breadcrumbs={breadcrumbs} />
        <div className="p-6">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}