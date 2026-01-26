import { EventDetailTabs } from "@/components";
import { BACKEND_URL, getAuthHeader } from "@/utils/api";

interface PageProps {
  params: Promise<{ eventId: string }>;
}

export default async function EventDetailPage({ params }: PageProps) {
  const { eventId } = await params;

  const eventResponse = await fetch(`${BACKEND_URL}/events/${eventId}`, {
    cache: "no-store",
    headers: getAuthHeader(),
  });

  const guestsResponse = await fetch(
    `${BACKEND_URL}/events/${eventId}/guests`,
    {
      cache: "no-store",
      headers: getAuthHeader(),
    },
  );

  if (!eventResponse.ok || !guestsResponse.ok) {
    return <div>Fehler beim Laden der Daten</div>;
  }

  const initialEvent = await eventResponse.json();
  const initialGuests = await guestsResponse.json();

  return (
    <>
      <EventDetailTabs
        eventId={eventId}
        initialEvent={initialEvent}
        initialGuests={initialGuests}
      />
    </>
  );
}
