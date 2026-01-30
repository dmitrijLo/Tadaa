import { BACKEND_URL, makeApiRequest } from "@/utils/api";
import DashboardEvents from "@/components/dashboard/DashboardEvents";

interface PaginatedEventResponse {
  data: EventResponse[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
}

export default async function DashboardPage() {
  const { data: eventsData, error: eventsErr } =
    await makeApiRequest<PaginatedEventResponse>(`${BACKEND_URL}/events`);

  if (eventsErr || !eventsData) {
    return <DashboardEvents />;
  }

  const now = new Date();
  const { data: allEvents, ..._ } = eventsData;
  const sortedEvents = [...allEvents].sort(
    ({ eventDate: aDate }, { eventDate: bDate }) =>
      new Date(bDate).getTime() - new Date(aDate).getTime(),
  );

  const futureEvents = sortedEvents
    .filter(({ eventDate }) => new Date(eventDate) >= now)
    .sort(
      ({ eventDate: aDate }, { eventDate: bDate }) =>
        new Date(aDate).getTime() - new Date(bDate).getTime(),
    );

  const pastEvents = allEvents
    .filter(({ eventDate }) => new Date(eventDate) < now)
    .sort(
      ({ eventDate: aDate }, { eventDate: bDate }) =>
        new Date(bDate).getTime() - new Date(aDate).getTime(),
    );

  const [featuredEvent, ...upcomingEvents] = futureEvents;

  let statsData: GuestStatsResponse | null = null;
  if (featuredEvent) {
    const { data } = await makeApiRequest<GuestStatsResponse>(
      `${BACKEND_URL}/events/${featuredEvent.id}/stats`,
    );
    statsData = data;
  }

  return (
    <DashboardEvents
      featuredEvent={featuredEvent}
      eventStats={statsData || undefined}
      upcomingEvents={upcomingEvents}
      pastEvents={pastEvents}
    />
  );
}
