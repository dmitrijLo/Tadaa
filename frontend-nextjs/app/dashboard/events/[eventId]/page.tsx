import { EventDetailTabs } from "@/components";
import { serverApiRequest, SERVER_BACKEND_URL } from "@/utils/server-api";

interface PageProps {
  params: Promise<{ eventId: string }>;
}

export default async function EventDetailPage({ params }: PageProps) {
  const { eventId } = await params;

  const [
    { data: initialEvent, error: eventErr },
    { data: initialGuests, error: guestsErr },
  ] = await Promise.all([
    serverApiRequest<Event>(`${SERVER_BACKEND_URL}/events/${eventId}`),
    serverApiRequest<Guest[]>(`${SERVER_BACKEND_URL}/events/${eventId}/guests`),
  ]);

  if (!initialEvent || !initialGuests) {
    return <div>Fehler beim Laden der Daten</div>;
  }

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
