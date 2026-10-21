import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/zones")({
  staticData: { crumb: "navbarTitles.zones" },
  component: Outlet,
});