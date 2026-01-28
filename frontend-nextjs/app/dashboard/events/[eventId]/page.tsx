import { EventDetailTabs } from "@/components";
import { BACKEND_URL, makeApiRequest } from "@/utils/api";

interface PageProps {
  params: Promise<{ eventId: string }>;
}

export default async function EventDetailPage({ params }: PageProps) {
  const { eventId } = await params;

  const [
    { data: initialEvent, error: eventErr },
    { data: initialGuests, error: guestsErr },
  ] = await Promise.all([
    makeApiRequest<Event>(`${BACKEND_URL}/events/${eventId}`),
    makeApiRequest<Guest[]>(`${BACKEND_URL}/events/${eventId}/guests`),
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
