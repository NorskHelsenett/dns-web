import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute("/_app/pending-changes")({
  staticData: { crumb: "navbarTitles.pendingChanges" },
  component: Outlet,
})