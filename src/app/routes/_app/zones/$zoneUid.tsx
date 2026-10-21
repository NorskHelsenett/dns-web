import { createFileRoute, useLocation } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/zones/$zoneUid")({
  loader: ({ params, location }) => ({
    crumb: location.state.zone?.name ?? params.zoneUid,
  }),
  component: ZonePage,
});

function ZonePage() {
  // const { zoneUid } = Route.useParams();
  const zone = useLocation({ select: (l) => l.state.zone });
  return <h1>{zone?.name}</h1>;
}